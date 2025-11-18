'use client';

import { InputHTMLAttributes, forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, type, prefixIcon, suffixIcon, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPasswordType = type === 'password';
    const inputType = isPasswordType && showPassword ? 'text' : type;

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {label}
          </label>
        )}
        
        <div className="relative">
          {/* Prefix Icon */}
          {prefixIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {prefixIcon}
            </div>
          )}

          {/* Input */}
          <input
            ref={ref}
            type={inputType}
            className={cn(
              'w-full px-4 py-2.5 rounded-lg transition-all duration-300',
              'bg-dark-900 border text-gray-100',
              'placeholder:text-gray-500',
              'focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent focus:shadow-lg focus:shadow-primary-400/10',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              error 
                ? 'border-danger-500 focus:ring-danger-500' 
                : 'border-gray-700 hover:border-primary-400/50',
              prefixIcon && 'pl-10',
              (suffixIcon || isPasswordType) && 'pr-10',
              className
            )}
            {...props}
          />

          {/* Suffix Icon or Password Toggle */}
          {isPasswordType ? (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors cursor-pointer"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          ) : suffixIcon ? (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {suffixIcon}
            </div>
          ) : null}
        </div>

        {/* Error Message */}
        {error && (
          <p className="mt-1.5 text-sm text-danger-400 flex items-center gap-1">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}

        {/* Helper Text */}
        {helperText && !error && (
          <p className="mt-1.5 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
