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
import { login as apiLogin, getProfile } from '@/lib/api/auth';
import { useAuth } from '@/lib/hooks';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { TOKEN_KEY } from '@/config/constants';

export const LoginForm = () => {
  const router = useRouter();
  const [requires2FA, setRequires2FA] = useState(false);
  const [error, setError] = useState('');
  const { login: storeLogin } = useAuth();

  // Validation schema
  const loginSchema = z.object({
    email: z.string().min(1, 'El email es requerido').email('Formato de email inválido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    twoFactorCode: z.string().optional(),
  });

  type LoginFormData = z.infer<typeof loginSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  // TODO: Initialize React Hook Form
  // const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
  //   resolver: zodResolver(loginSchema),
  // });

  // TODO: Implement login handler
  const onSubmit = async (data: LoginFormData) => {
    setError('');
    try {
      // If 2FA is required, ensure code is present
      if (requires2FA && !data.twoFactorCode) {
        setError('Ingresa el código de autenticación de dos factores');
        return;
      }

      const payload: any = {
        email: data.email,
        password: data.password,
      };

      if (requires2FA && data.twoFactorCode) {
        payload.twoFactorCode = data.twoFactorCode;
      }

      const resp = await apiLogin(payload);

      if ((resp as any).requires2FA) {
        setRequires2FA(true);
        return;
      }

      // Where to redirect after successful login. Prefer `next` query param, otherwise home.
      const redirectTo = typeof window !== 'undefined'
        ? (new URLSearchParams(window.location.search).get('next') || ROUTES.HOME)
        : ROUTES.HOME;
      // If backend returns { message, token }
      const anyResp = resp as any;
      const token = (anyResp && (anyResp.token || anyResp.access_token)) as string | undefined;
      if (token) {
        // store token temporarily so apiClient includes it in profile request
        if (typeof window !== 'undefined') {
          localStorage.setItem(TOKEN_KEY, token);
        }

        const profile = await getProfile();
        storeLogin(profile.user, token);
        router.push(redirectTo);
        return;
      }

      const loginData = resp as any;
      storeLogin(loginData.user, loginData.access_token);
      router.push(redirectTo);
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
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        {!requires2FA ? (
          <>
            <Input
              label="Email"
              type="email"
              placeholder="tu@email.com"
              {...register('email')}
              error={errors.email?.message}
            />

            <Input
              label="Contraseña"
              type="password"
              placeholder="••••••••"
              {...register('password')}
              error={errors.password?.message}
            />

            <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
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
              {...register('twoFactorCode')}
              error={errors.twoFactorCode?.message}
            />

            <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
              Verificar
            </Button>

            <Button type="button" variant="ghost" className="w-full" onClick={() => setRequires2FA(false)}>
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
    </div >
  );
};
