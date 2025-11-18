'use client';

import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className,
  disabled,
  ...props
}: ButtonProps) => {
  const baseStyles = 'inline-flex items-center justify-center gap-2 rounded-lg font-normal transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-dark-900 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none cursor-pointer transform hover:scale-105 active:scale-95';
  
  const variantStyles = {
    primary: 'bg-primary-400 text-dark-900 hover:bg-primary-500 active:bg-primary-600 shadow-sm hover:shadow-lg hover:shadow-primary-400/20',
    secondary: 'bg-dark-700 text-gray-100 hover:bg-dark-600 active:bg-dark-500 border border-dark-600 hover:border-dark-500',
    danger: 'bg-danger-600 text-white hover:bg-danger-700 active:bg-danger-800 shadow-sm hover:shadow-lg hover:shadow-danger-600/20',
    outline: 'border-2 border-primary-400 text-primary-400 hover:bg-primary-400/10 active:bg-primary-400/20 hover:border-primary-500',
    ghost: 'text-gray-300 hover:bg-dark-800 active:bg-dark-700 hover:text-primary-400',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm h-8',
    md: 'px-4 py-2 text-base h-10',
    lg: 'px-6 py-3 text-lg h-12',
  };

  return (
    <button
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
      {isLoading ? 'Cargando...' : children}
    </button>
  );
};
