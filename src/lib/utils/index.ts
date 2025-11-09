export * from './format';
export * from './validation';

/**
 * Utility function to merge Tailwind classes
 * Prevents duplicate classes and handles conflicts
 */
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
