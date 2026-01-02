'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import { logoutUser } from '../../lib/api';
import { cn } from '@/lib/utils';

const navItems = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { label: 'Người dùng', href: '/admin/users', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
    { label: 'Chuyên khoa', href: '/admin/specialties', icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z' },
    { label: 'Phân công', href: '/admin/schedules', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { label: 'Lịch khám', href: '/admin/appointments', icon: 'M9 5H7a2 2 0 00-2 2v11a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = () => {
        logoutUser();
        router.push('/auth/login');
    };

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <p className="text-gray-600 mb-4">Vui lòng đăng nhập</p>
                    <Link href="/auth/login" className="text-blue-600 hover:underline">
                        Đăng nhập
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen flex overflow-hidden bg-gray-100">
            {/* Sidebar */}
            <aside className="w-56 bg-white border-r flex flex-col flex-shrink-0">
                {/* Logo */}
                <div className="h-14 flex items-center px-4 border-b">
                    <Link href="/admin/dashboard" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">PK</span>
                        </div>
                        <span className="font-semibold text-gray-900">Admin</span>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                                    isActive
                                        ? 'bg-blue-50 text-blue-700'
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                )}
                            >
                                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                                </svg>
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* User section */}
                <div className="p-3 border-t">
                    <div className="flex items-center gap-3 px-3 py-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                                {user.firstName} {user.lastName}
                            </p>
                            <p className="text-xs text-gray-500">Admin</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full mt-2 flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Đăng xuất
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 overflow-auto">
                {children}
            </main>
        </div>
    );
}
