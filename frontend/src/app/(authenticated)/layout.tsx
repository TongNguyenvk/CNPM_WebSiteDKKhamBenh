'use client';
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/hooks/useAuth';

export default function AuthenticatedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading } = useAuth();
    const [navItems, setNavItems] = useState([
        { label: 'Dashboard', href: '/patient/dashboard' },
        { label: 'Chuyên Khoa', href: '/patient/specialties' },
        { label: 'Bác Sĩ', href: '/patient/doctors' },
        { label: 'Lịch Khám', href: '/patient/schedule' },
        { label: 'Lịch Đã Đặt', href: '/patient/appointments' },
        { label: 'Tôi', href: '/patient/profile' }
    ]);

    useEffect(() => {
        if (user) {
            if (user.role === 'R2') {
                setNavItems([
                    { label: 'Dashboard', href: '/doctor/dashboard' },
                    { label: 'Lịch Khám', href: '/doctor/appointments' },
                    { label: 'Lịch Phân Công', href: '/doctor/schedule' },
                    { label: 'Tôi', href: '/doctor/profile' }
                ]);
            } else if (user.role === 'R3') {
                setNavItems([
                    { label: 'Dashboard', href: '/patient/dashboard' },
                    { label: 'Chuyên Khoa', href: '/patient/specialties' },
                    { label: 'Bác Sĩ', href: '/patient/doctors' },
                    { label: 'Lịch Khám', href: '/patient/schedule' },
                    { label: 'Lịch Đã Đặt', href: '/patient/appointments' },
                    { label: 'Tôi', href: '/patient/profile' }
                ]);
            }
        }
    }, [user]);

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

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar
                role={user?.role || 'guest'}
                userName={user ? `${user.firstName} ${user.lastName}` : ''}
                navItems={navItems}
            />
            {children}
        </div>
    );
} 