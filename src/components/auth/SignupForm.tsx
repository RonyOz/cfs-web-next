/**
 * TODO: Implement form logic with React Hook Form
 * TODO: Add Zod validation
 * TODO: Add password strength indicator
 * TODO: Show error messages properly (no window.alert!)
 * TODO: Redirect after successful signup
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Input } from '@/components/ui';
import { ROUTES } from '@/config/constants';
import { signup as apiSignup, login as apiLogin, getProfile } from '@/lib/api/auth';
import { useAuth } from '@/lib/hooks';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { TOKEN_KEY } from '@/config/constants';

export const SignupForm = () => {
  const router = useRouter();
  const [error, setError] = useState('');
  const { login: storeLogin } = useAuth();

  const signupSchema = z
    .object({
      email: z.string().min(1, 'El email es requerido').email('Formato de email inválido'),
      username: z.string().min(3, 'El nombre de usuario debe tener al menos 3 caracteres'),
      password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
      confirmPassword: z.string().min(6, 'Confirma tu contraseña'),
    })
    .superRefine((val, ctx) => {
      if (val.password !== val.confirmPassword) {
        ctx.addIssue({ path: ['confirmPassword'], message: 'Las contraseñas no coinciden', code: z.ZodIssueCode.custom });
      }
    });

  type SignupFormData = z.infer<typeof signupSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({ resolver: zodResolver(signupSchema) });

  // TODO: Initialize React Hook Form
  // const { register, handleSubmit, formState: { errors } } = useForm<SignupFormData>({
  //   resolver: zodResolver(signupSchema),
  // });

  // TODO: Implement signup handler
  const onSubmit = async (data: SignupFormData) => {
    setError('');
    try {
      const created = await apiSignup({ email: data.email, username: data.username, password: data.password });

      // If signup returns a token directly, use it to fetch profile and log the user in
      const token = (created && (created.token || created.access_token)) as string | undefined;
      if (token) {
        // temporarily store token so apiClient can include it in the profile request
        if (typeof window !== 'undefined') {
          localStorage.setItem(TOKEN_KEY, token);
        }

        const profile = await getProfile();
        storeLogin(profile.user, token);
        router.push(ROUTES.PRODUCTS);
        return;
      }

      // Otherwise attempt to login (backend may require explicit login)
      const loginResp = await apiLogin({ email: data.email, password: data.password });
      if ((loginResp as any).requires2FA) {
        router.push(ROUTES.LOGIN);
        return;
      }

      const loginData = loginResp as any;
      storeLogin(loginData.user, loginData.access_token);
      router.push(ROUTES.PRODUCTS);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Error al crear la cuenta');
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Crear Cuenta</h2>
        <p className="mt-2 text-gray-600">
          Regístrate en Campus Food Sharing
        </p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-danger-50 border border-danger-200 rounded-lg">
          <p className="text-sm text-danger-700">{error}</p>
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Email"
          type="email"
          placeholder="tu@email.com"
          {...register('email')}
          error={errors.email?.message}
        />

        <Input
          label="Nombre de Usuario"
          type="text"
          placeholder="usuario123"
          {...register('username')}
          error={errors.username?.message}
        />

        <Input
          label="Contraseña"
          type="password"
          placeholder="••••••••"
          helperText="Mínimo 6 caracteres"
          {...register('password')}
          error={errors.password?.message}
        />

        <Input
          label="Confirmar Contraseña"
          type="password"
          placeholder="••••••••"
          {...register('confirmPassword')}
          error={errors.confirmPassword?.message}
        />

        <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
          Crear Cuenta
        </Button>
      </form>

      <div className="mt-6 text-center text-sm">
        <p className="text-gray-600">
          ¿Ya tienes una cuenta?{' '}
          <Link href={ROUTES.LOGIN} className="text-primary-600 hover:text-primary-700 font-medium">
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </div>
  );
};
