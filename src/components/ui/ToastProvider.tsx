'use client';

import { Toaster } from 'react-hot-toast';

export const ToastProvider = () => {
    return (
        <Toaster
            position="top-center"
            reverseOrder={false}
            gutter={8}
            toastOptions={{
                // Default options
                duration: 3000,
                style: {
                    background: '#1f2937',
                    color: '#f3f4f6',
                    border: '1px solid #374151',
                    padding: '16px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                },
                // Success
                success: {
                    duration: 2000,
                    style: {
                        background: '#065f46',
                        color: '#d1fae5',
                        border: '1px solid #10b981',
                    },
                    iconTheme: {
                        primary: '#10b981',
                        secondary: '#d1fae5',
                    },
                },
                // Error
                error: {
                    duration: 4000,
                    style: {
                        background: '#7f1d1d',
                        color: '#fecaca',
                        border: '1px solid #ef4444',
                    },
                    iconTheme: {
                        primary: '#ef4444',
                        secondary: '#fecaca',
                    },
                },
                // Loading
                loading: {
                    style: {
                        background: '#1e40af',
                        color: '#dbeafe',
                        border: '1px solid #3b82f6',
                    },
                },
            }}
        />
    );
};
