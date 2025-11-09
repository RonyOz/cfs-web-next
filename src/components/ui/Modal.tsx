/**
 * TODO: Implement modal with overlay
 * TODO: Add close on escape key
 * TODO: Add close on overlay click
 * TODO: Add animations (fade in/out)
 */

'use client';

import { ReactNode, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal = ({ isOpen, onClose, children, title, size = 'md' }: ModalProps) => {
  // TODO: Implement modal functionality
  // - Close on escape key
  // - Close on overlay click
  // - Prevent body scroll when open
  // - Focus trap

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // TODO: Prevent body scroll
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Modal content */}
      <div
        className={cn(
          'relative bg-white rounded-lg shadow-xl p-6 w-full mx-4',
          sizeStyles[size]
        )}
      >
        {title && (
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          </div>
        )}
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
        
        {children}
      </div>
    </div>
  );
};
