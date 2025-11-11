/**
 * TODO: Implement form logic with React Hook Form
 * TODO: Add Zod validation
 * TODO: Handle 2FA flow
 * TODO: Show error messages properly (no window.alert!)
 * TODO: Redirect after successful login
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Input } from '@/components/ui';
import { ROUTES } from '@/config/constants';
import { login as apiLogin } from '@/lib/api/auth';
import { useAuth } from '@/lib/hooks';

export const LoginForm = () => {
  const router = useRouter();
  const [requires2FA, setRequires2FA] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const { login: storeLogin } = useAuth();

  // TODO: Initialize React Hook Form
  // const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
  //   resolver: zodResolver(loginSchema),
  // });

  // TODO: Implement login handler
  const onSubmit = async (data: any) => {
    setError('');
    try {
      if (!requires2FA) {
        const resp = await apiLogin({ email, password });

        if ((resp as any).requires2FA) {
          setRequires2FA(true);
          return;
        }

        const loginData = resp as any;
        // Persist in store
        storeLogin(loginData.user, loginData.access_token);
        router.push(ROUTES.PRODUCTS);
      } else {
        // verify with twoFactorCode
        const resp = await apiLogin({ email, password, twoFactorCode });

        if ((resp as any).requires2FA) {
          // still requires 2FA or invalid
          setError((resp as any).message || 'Código 2FA inválido');
          return;
        }

        const loginData = resp as any;
        storeLogin(loginData.user, loginData.access_token);
        router.push(ROUTES.PRODUCTS);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Iniciar Sesión</h2>
        <p className="mt-2 text-gray-600">
          Ingresa a tu cuenta de Campus Food Sharing
        </p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-danger-50 border border-danger-200 rounded-lg">
          <p className="text-sm text-danger-700">{error}</p>
        </div>
      )}

      <form
        className="space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit({});
        }}
      >
        {!requires2FA ? (
          <>
            <Input
              label="Email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              label="Contraseña"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button type="submit" className="w-full" size="lg">
              Iniciar Sesión
            </Button>
          </>
        ) : (
          <>
            <p className="text-sm text-gray-600">
              Ingresa el código de autenticación de dos factores de tu aplicación.
            </p>

            <Input
              label="Código 2FA"
              type="text"
              placeholder="123456"
              maxLength={6}
              value={twoFactorCode}
              onChange={(e) => setTwoFactorCode(e.target.value)}
            />

            <Button type="submit" className="w-full" size="lg">
              Verificar
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => setRequires2FA(false)}
            >
              Volver
            </Button>
          </>
        )}
      </form>

      <div className="mt-6 text-center text-sm">
        <p className="text-gray-600">
          ¿No tienes una cuenta?{' '}
          <Link href={ROUTES.SIGNUP} className="text-primary-600 hover:text-primary-700 font-medium">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
};
