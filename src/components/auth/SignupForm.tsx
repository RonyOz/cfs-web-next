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
import { signup as apiSignup, login as apiLogin } from '@/lib/api/auth';
import { useAuth } from '@/lib/hooks';

export const SignupForm = () => {
  const router = useRouter();
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { login: storeLogin } = useAuth();

  // TODO: Initialize React Hook Form
  // const { register, handleSubmit, formState: { errors } } = useForm<SignupFormData>({
  //   resolver: zodResolver(signupSchema),
  // });

  // TODO: Implement signup handler
  const onSubmit = async (data: any) => {
    setError('');
    try {
      if (password !== confirmPassword) {
        setError('Las contraseñas no coinciden');
        return;
      }

      const created = await apiSignup({ email, username, password });

      // Auto-login
      const loginResp = await apiLogin({ email, password });
      if ((loginResp as any).requires2FA) {
        // Signup succeeded but user has 2FA enabled for some reason — ask for login separately
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

      <form
        className="space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit({});
        }}
      >
        <Input
          label="Email"
          type="email"
          placeholder="tu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          label="Nombre de Usuario"
          type="text"
          placeholder="usuario123"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <Input
          label="Contraseña"
          type="password"
          placeholder="••••••••"
          helperText="Mínimo 6 caracteres"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Input
          label="Confirmar Contraseña"
          type="password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
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
