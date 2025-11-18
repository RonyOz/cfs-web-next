const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const { default: getPort } = require('get-port');

async function choosePort() {
  if (process.env.PORT) {
    const parsed = Number(process.env.PORT);
    if (!Number.isNaN(parsed) && parsed >= 0) {
      return parsed === 0 ? getPort() : parsed;
    }
  }

  return getPort({ port: 3010 });
}

async function start() {
  const port = await choosePort();
  const resolvedPort = String(port);

  console.log(`[dev:test] Starting Next.js dev server on port ${resolvedPort}`);

  const env = {
    ...process.env,
    PORT: resolvedPort,
    NEXT_TELEMETRY_DISABLED: process.env.NEXT_TELEMETRY_DISABLED || '1',
  };

  const nextBin = path.join(__dirname, '..', 'node_modules', 'next', 'dist', 'bin', 'next');
  const lockFile = path.join(__dirname, '..', '.next', 'dev', 'lock');

  if (fs.existsSync(lockFile)) {
    fs.rmSync(lockFile);
  }

  const devServer = spawn(process.execPath, [nextBin, 'dev', '-p', resolvedPort], {
    stdio: 'inherit',
    env,
  });

  devServer.on('close', (code) => {
    process.exit(code ?? 0);
  });
}

start().catch((error) => {
  console.error(error);
  process.exit(1);
});
