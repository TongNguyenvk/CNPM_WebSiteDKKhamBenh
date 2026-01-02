'use client';

import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';

interface SlidePanelProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    width?: 'sm' | 'md' | 'lg' | 'xl';
}

const widthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
};

export function SlidePanel({ isOpen, onClose, title, children, width = 'md' }: SlidePanelProps) {
    // Lock body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    // Handle escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    return (
        <>
            {/* Backdrop */}
            <div
                className={cn(
                    'fixed inset-0 bg-black/30 transition-opacity duration-300',
                    isOpen ? 'opacity-100 z-[100]' : 'opacity-0 pointer-events-none z-[-1]'
                )}
                onClick={onClose}
            />

            {/* Panel */}
            <div
                className={cn(
                    'fixed inset-y-0 right-0 z-[101] w-full bg-white shadow-2xl transform transition-transform duration-300 ease-out flex flex-col',
                    widthClasses[width],
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b bg-gray-50 flex-shrink-0">
                    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content - scrollable if needed */}
                <div className="flex-1 overflow-y-auto p-5">
                    {children}
                </div>
            </div>
        </>
    );
}
