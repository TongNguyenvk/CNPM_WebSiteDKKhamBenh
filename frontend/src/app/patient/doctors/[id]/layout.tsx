'use client';
import React from 'react';

export default function DoctorDetailLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50">
            <main className="container mx-auto px-4 py-2">
                {children}
            </main>
        </div>
    );
} 