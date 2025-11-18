'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { ROUTES } from '@/config/constants';
import { login as apiLogin, signup as apiSignup, getProfile } from '@/lib/api/auth';
import { useAuth } from '@/lib/hooks';
import { TOKEN_KEY } from '@/config/constants';

export default function AuthPage() {
  const router = useRouter();
  const { login: storeLogin } = useAuth();
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const resp = await apiLogin({ email, password });

      if ((resp as any).requires2FA) {
        setError('2FA no está soportado en esta versión');
        setIsLoading(false);
        return;
      }

      const token = (resp as any).access_token || (resp as any).token;

      if (!token) {
        setError('Credenciales incorrectas. Verifica tu email y contraseña.');
        setIsLoading(false);
        return;
      }

      // Guardar token en localStorage
      localStorage.setItem(TOKEN_KEY, token);

      // Pequeño delay para asegurar que localStorage se actualice
      await new Promise(resolve => setTimeout(resolve, 100));

      try {
        // Obtener perfil del usuario
        const profile = await getProfile();
        
        if (!profile) {
          setError('Error al obtener la información del usuario. Intenta nuevamente.');
          localStorage.removeItem(TOKEN_KEY);
          setIsLoading(false);
          return;
        }
        
        // El backend devuelve {user: {user: {...}}} - necesitamos extraer el user interno
        const userData = (profile as any).user?.user || (profile as any).user || profile;

        if (!userData) {
          setError('Error al procesar la información del usuario. Intenta nuevamente.');
          localStorage.removeItem(TOKEN_KEY);
          setIsLoading(false);
          return;
        }

        storeLogin(userData, token);
        router.push(ROUTES.HOME);
      } catch (profileError: any) {
        // Error al obtener el perfil
        localStorage.removeItem(TOKEN_KEY);
        setError('Error al obtener la información del usuario. Intenta nuevamente.');
        setIsLoading(false);
      }
    } catch (err: any) {
      // Manejar diferentes tipos de errores
      const status = err?.response?.status;
      const message = err?.response?.data?.message;
      
      if (status === 401 || status === 404) {
        setError('Usuario o contraseña incorrectos. Verifica tus credenciales.');
      } else if (status === 400) {
        setError(message || 'Datos inválidos. Verifica tu email y contraseña.');
      } else if (message) {
        setError(message);
      } else if (err?.message) {
        setError(err.message);
      } else {
        setError('Error al iniciar sesión. Verifica tu conexión e intenta nuevamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const username = formData.get('username') as string;
    const email = formData.get('email') as string;
    const phoneNumber = formData.get('phoneNumber') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      setIsLoading(false);
      return;
    }

    try {
      if (!phoneNumber) {
        setError('El número de teléfono es obligatorio');
        setIsLoading(false);
        return;
      }

      const resp = await apiSignup({ email, username, password, phoneNumber });
      const token = (resp as any).access_token || (resp as any).token;

      if (!token) {
        setError('No se pudo crear la cuenta. Intenta nuevamente.');
        setIsLoading(false);
        return;
      }

      // Guardar token en localStorage
      localStorage.setItem(TOKEN_KEY, token);

      // Pequeño delay para asegurar que localStorage se actualice
      await new Promise(resolve => setTimeout(resolve, 100));

      try {
        // Obtener perfil del usuario
        const profile = await getProfile();
        
        if (!profile) {
          setError('Cuenta creada, pero hubo un error. Por favor inicia sesión.');
          localStorage.removeItem(TOKEN_KEY);
          setActiveTab('login');
          setIsLoading(false);
          return;
        }
        
        // El backend devuelve {user: {user: {...}}} - necesitamos extraer el user interno
        const userData = (profile as any).user?.user || (profile as any).user || profile;

        if (!userData) {
          setError('Cuenta creada, pero hubo un error. Por favor inicia sesión.');
          localStorage.removeItem(TOKEN_KEY);
          setActiveTab('login');
          setIsLoading(false);
          return;
        }

        storeLogin(userData, token);
        router.push(ROUTES.HOME);
      } catch (profileError: any) {
        // Error al obtener el perfil
        localStorage.removeItem(TOKEN_KEY);
        setError('Cuenta creada, pero hubo un error. Por favor inicia sesión.');
        setActiveTab('login');
        setIsLoading(false);
      }
    } catch (err: any) {
      // Manejar diferentes tipos de errores
      const status = err?.response?.status;
      const message = err?.response?.data?.message;
      
      if (status === 409) {
        setError('Este email o nombre de usuario ya está registrado.');
      } else if (status === 400) {
        setError(message || 'Datos inválidos. Verifica la información ingresada.');
      } else if (message) {
        setError(message);
      } else if (err?.message) {
        setError(err.message);
      } else {
        setError('Error al crear la cuenta. Verifica tu conexión e intenta nuevamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-dark-900">
      {/* Back button */}
      <div className="container mx-auto px-4 py-6">
        <Link href={ROUTES.HOME}>
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Volver al Marketplace
          </Button>
        </Link>
      </div>

      {/* Auth Card */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Card Header */}
          <div className="bg-dark-800 rounded-2xl shadow-2xl border border-gray-800 p-8">
            <div className="text-center mb-8">
              {/* Logo */}
              <div className="flex justify-center mb-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-400 shadow-lg shadow-primary-400/20 p-3">
                  <img src="/logo.svg" alt="Bocado" className="h-full w-full" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Bienvenido a Bocado</h2>
              <p className="text-gray-400">
                Únete a la comunidad de compartir comida del campus
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-900/20 border border-red-500/50 rounded-lg backdrop-blur-sm">
                <p className="text-sm text-red-300 text-center">{error}</p>
              </div>
            )}

            {/* Tabs */}
            <div className="mb-6">
              <div className="grid grid-cols-2 gap-2 p-1 bg-dark-900 rounded-lg">
                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  className={`py-2 px-4 rounded-md text-sm font-medium transition-all ${activeTab === 'login'
                      ? 'bg-primary-400 text-dark-900 shadow-lg'
                      : 'text-gray-400 hover:text-gray-300'
                    }`}
                >
                  Iniciar Sesión
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('signup')}
                  className={`py-2 px-4 rounded-md text-sm font-medium transition-all ${activeTab === 'signup'
                      ? 'bg-primary-400 text-dark-900 shadow-lg'
                      : 'text-gray-400 hover:text-gray-300'
                    }`}
                >
                  Registrarse
                </button>
              </div>
            </div>

            {/* Login Form */}
            {activeTab === 'login' && (
              <form onSubmit={handleLogin} className="space-y-5">
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="tu@universidad.edu"
                  required
                />

                <Input
                  label="Contraseña"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                />

                <Button
                  type="submit"
                  className="w-full mt-6"
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? 'Ingresando...' : 'Iniciar Sesión'}
                </Button>
              </form>
            )}

            {/* Signup Form */}
            {activeTab === 'signup' && (
              <form onSubmit={handleSignup} className="space-y-5">
                <Input
                  label="Nombre de Usuario"
                  name="username"
                  type="text"
                  placeholder="usuario123"
                  required
                  minLength={3}
                />

                <Input
                  label="Email Universitario"
                  name="email"
                  type="email"
                  placeholder="tu@universidad.edu"
                  required
                />

                <Input
                  label="Número de teléfono"
                  name="phoneNumber"
                  type="tel"
                  placeholder="+57 300 000 0000"
                  required
                  minLength={7}
                />

                <Input
                  label="Contraseña"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />

                <Input
                  label="Confirmar Contraseña"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />

                <Button
                  type="submit"
                  className="w-full mt-6"
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
