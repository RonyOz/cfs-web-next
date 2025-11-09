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

export const LoginForm = () => {
  const router = useRouter();
  const [requires2FA, setRequires2FA] = useState(false);
  const [error, setError] = useState('');

  // TODO: Initialize React Hook Form
  // const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
  //   resolver: zodResolver(loginSchema),
  // });

  // TODO: Implement login handler
  const onSubmit = async (data: any) => {
    // TODO: Call login API
    // const response = await login(data);
    // 
    // if ('requires2FA' in response) {
    //   setRequires2FA(true);
    //   return;
    // }
    // 
    // // Store token and user in auth store
    // // Redirect to products page
    // router.push(ROUTES.PRODUCTS);
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

      <form className="space-y-6">
        {!requires2FA ? (
          <>
            <Input
              label="Email"
              type="email"
              placeholder="tu@email.com"
              // {...register('email')}
              // error={errors.email?.message}
            />

            <Input
              label="Contraseña"
              type="password"
              placeholder="••••••••"
              // {...register('password')}
              // error={errors.password?.message}
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
              // {...register('twoFactorCode')}
              // error={errors.twoFactorCode?.message}
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
