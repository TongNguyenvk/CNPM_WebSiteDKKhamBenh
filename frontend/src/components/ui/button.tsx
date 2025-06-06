import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'outline';
    children: React.ReactNode;
}

export function Button({ variant = 'default', children, className = '', ...props }: ButtonProps) {
    const baseStyles = 'px-4 py-2 rounded-md font-medium transition-colors';
    const variantStyles = {
        default: 'bg-blue-600 text-white hover:bg-blue-700',
        outline: 'border border-gray-300 hover:bg-gray-100'
    };

    return (
        <button
            className={`${baseStyles} ${variantStyles[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
} 