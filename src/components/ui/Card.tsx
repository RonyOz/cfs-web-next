/**
 * TODO: Add different card variants
 * TODO: Add hover effects
 * TODO: Add card header, body, footer sections
 */

'use client';

import { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hover?: boolean;
}

export const Card = ({ children, hover = false, className, ...props }: CardProps) => {
  return (
    <div
      className={cn(
        'bg-dark-800 rounded-lg border border-dark-700 shadow-sm p-6',
        hover && 'hover:border-primary-400/50 hover:shadow-lg transition-all duration-200',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// Card sub-components for better composition
export const CardHeader = ({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('mb-4', className)} {...props}>
    {children}
  </div>
);

export const CardBody = ({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('', className)} {...props}>
    {children}
  </div>
);

export const CardFooter = ({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('mt-4 pt-4 border-t border-dark-700', className)} {...props}>
    {children}
  </div>
);
