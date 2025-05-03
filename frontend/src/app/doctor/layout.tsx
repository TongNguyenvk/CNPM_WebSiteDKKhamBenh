'use client';
import React from 'react';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function DoctorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading } = useAuth();
    const router = useRouter();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Đang tải...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        router.push('/auth/login?redirect=/doctor/dashboard');
        return null;
    }

    if (user.role !== 'R2') {
        router.push('/');
        return null;
    }

    const navItems = [
        { label: 'Dashboard', href: '/doctor/dashboard' },
        { label: 'Lịch Khám', href: '/doctor/appointments' },
        { label: 'Lịch Phân Công', href: '/doctor/schedule' },
        { label: 'Tôi', href: '/doctor/profile' }
    ];

    return (
        <div>
            <Navbar
                role="doctor"
                userName={`${user.firstName} ${user.lastName}`}
                navItems={navItems}
            />
            <main className="container mx-auto px-4 py-8 pt-20"> {/* Increased padding-top */}
                {children}
            </main>
        </div>
    );
}