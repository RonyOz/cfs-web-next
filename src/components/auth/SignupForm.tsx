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

export const SignupForm = () => {
  const router = useRouter();
  const [error, setError] = useState('');

  // TODO: Initialize React Hook Form
  // const { register, handleSubmit, formState: { errors } } = useForm<SignupFormData>({
  //   resolver: zodResolver(signupSchema),
  // });

  // TODO: Implement signup handler
  const onSubmit = async (data: any) => {
    // TODO: Call signup API
    // const user = await signup(data);
    // 
    // // Auto-login after signup
    // const loginResponse = await login({
    //   email: data.email,
    //   password: data.password,
    // });
    // 
    // // Store token and user in auth store
    // // Redirect to products page
    // router.push(ROUTES.PRODUCTS);
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

      <form className="space-y-6">
        <Input
          label="Email"
          type="email"
          placeholder="tu@email.com"
          // {...register('email')}
          // error={errors.email?.message}
        />

        <Input
          label="Nombre de Usuario"
          type="text"
          placeholder="usuario123"
          // {...register('username')}
          // error={errors.username?.message}
        />

        <Input
          label="Contraseña"
          type="password"
          placeholder="••••••••"
          helperText="Mínimo 6 caracteres"
          // {...register('password')}
          // error={errors.password?.message}
        />

        <Input
          label="Confirmar Contraseña"
          type="password"
          placeholder="••••••••"
          // {...register('confirmPassword')}
          // error={errors.confirmPassword?.message}
        />

        <Button type="submit" className="w-full" size="lg">
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
