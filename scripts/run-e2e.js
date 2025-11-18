const { spawn } = require('child_process');
const http = require('http');
const { default: getPort } = require('get-port');

const extraArgs = process.argv.slice(2);
const waitTimeout = Number(process.env.E2E_SERVER_TIMEOUT ?? 60000);
const npmExecPath = process.env.npm_execpath;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const pingServer = (url) =>
  new Promise((resolve, reject) => {
    const req = http.get(url, (res) => {
      res.resume();
      resolve();
    });

    req.on('error', reject);
    req.setTimeout(2000, () => {
      req.destroy(new Error('timeout'));
    });
  });

async function waitForServer(url, timeout) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      await pingServer(url);
      return;
    } catch {
      await sleep(750);
    }
  }
  throw new Error(`Timed out waiting for dev server at ${url}`);
}

async function resolvePort() {
  if (process.env.PORT) {
    const parsed = Number(process.env.PORT);
    if (!Number.isNaN(parsed) && parsed > 0) {
      return parsed;
    }
  }

  return getPort({ port: 3010 });
}

async function run() {
  const port = await resolvePort();
  const serverUrl = `http://localhost:${port}`;

  console.log(`[e2e] Starting Next.js dev server on port ${port}`);

  const serverEnv = { ...process.env, PORT: String(port) };
  const devServer = npmExecPath
    ? spawn(process.execPath, [npmExecPath, 'run', 'dev:test'], {
        env: serverEnv,
        stdio: 'pipe',
      })
    : spawn('npm', ['run', 'dev:test'], {
        env: serverEnv,
        stdio: 'pipe',
        shell: process.platform === 'win32',
      });

  devServer.stdout.on('data', (data) => {
    process.stdout.write(`[dev] ${data}`);
  });

  devServer.stderr.on('data', (data) => {
    process.stderr.write(`[dev] ${data}`);
  });

  const handleServerExit = (code) => {
    if (code !== null && code !== 0) {
      console.error(`[e2e] Dev server exited with code ${code}`);
      process.exit(code);
    }
  };

  devServer.on('exit', handleServerExit);

  try {
    await waitForServer(serverUrl, waitTimeout);
  } catch (error) {
    devServer.kill();
    console.error(`[e2e] ${error.message}`);
    process.exit(1);
  }

  console.log(`[e2e] Dev server ready at ${serverUrl}`);

  const baseCypressArgs = ['cypress', 'run', '--config', `baseUrl=${serverUrl}`];
  if (extraArgs.length > 0) {
    baseCypressArgs.push(...extraArgs);
  }

  const cypress = spawn('npx', baseCypressArgs, {
    stdio: 'inherit',
    env: serverEnv,
    shell: process.platform === 'win32',
  });

  const shutdown = (signal) => {
    devServer.off('exit', handleServerExit);
    cypress.kill(signal);
    devServer.kill(signal);
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));

  cypress.on('close', (code) => {
    devServer.off('exit', handleServerExit);
    devServer.kill();
    process.exit(code ?? 0);
  });
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
