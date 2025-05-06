'use client';
import React from 'react';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../hooks/useAuth';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <div>Vui lòng đăng nhập</div>;
    }

    const navItems = [
        { label: 'Dashboard', href: '/admin/dashboard' },
        { label: 'Quản Lý User', href: '/admin/users' },
        { label: 'Quản Lý Bác Sĩ', href: '/admin/doctors' },
        { label: 'Quản Lý Lịch Khám', href: '/admin/appointments' },
        { label: 'Tôi', href: '/admin/profile' }
    ];

    return (
        <div>
            <Navbar
                role="admin"
                userName={`${user.firstName} ${user.lastName}`}
                navItems={navItems}
            />
            <main className="container mx-auto px-4 py-8">
                {children}
            </main>
        </div>
    );
} 