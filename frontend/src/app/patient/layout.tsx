'use client';
import React from 'react';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function PatientLayout({
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
        router.push('/auth/login?redirect=/patient/dashboard');
        return null;
    }

    if (user.role !== 'R1') {
        router.push('/');
        return null;
    }

    const navItems = [
        { label: 'Dashboard', href: '/patient/dashboard' },
        { label: 'Chuyên Khoa', href: '/patient/specialties' },
        { label: 'Lịch Đã Đặt', href: '/patient/appointments' },
        { label: 'Tôi', href: '/patient/profile' }
    ];

    return (
        <div>
            <Navbar
                role="patient"
                userName={`${user.firstName} ${user.lastName}`}
                navItems={navItems}
            />
            <main className="container mx-auto px-4 pt-16 pb-8"> {/* Changed py-8 to pt-16 pb-8 */}
                {children}
            </main>
        </div>
    );
}