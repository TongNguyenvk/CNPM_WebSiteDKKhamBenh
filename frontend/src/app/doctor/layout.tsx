'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import { logoutUser, getUserProfile } from '../../lib/api';
import { cn, getAvatarUrl } from '@/lib/utils';

const navItems = [
    { label: 'Tổng quan', href: '/doctor/dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { label: 'Lịch khám', href: '/doctor/appointments', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { label: 'Lịch làm việc', href: '/doctor/schedule', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { label: 'Bệnh nhân', href: '/doctor/patients', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
    { label: 'Hồ sơ', href: '/doctor/profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
];

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const pathname = usePathname();
    const router = useRouter();
    const [userImage, setUserImage] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserImage = async () => {
            try {
                const profile = await getUserProfile();
                if (profile?.image) setUserImage(profile.image);
            } catch (e) { console.error(e); }
        };
        if (user) fetchUserImage();
    }, [user]);

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
        router.push('/auth/login?redirect=/doctor/dashboard');
        return null;
    }

    if (user.role !== 'R2') {
        router.push('/');
        return null;
    }

    return (
        <div className="h-screen flex overflow-hidden bg-gray-100">
            {/* Sidebar */}
            <aside className="w-56 bg-white border-r flex flex-col flex-shrink-0">
                {/* Logo */}
                <div className="h-14 flex items-center px-4 border-b">
                    <Link href="/doctor/dashboard" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </div>
                        <span className="font-semibold text-gray-900">Bác sĩ</span>
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
                        {userImage ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img src={getAvatarUrl(userImage)} alt="Avatar" className="w-8 h-8 rounded-full object-cover" />
                        ) : (
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                                Dr. {user.firstName} {user.lastName}
                            </p>
                            <p className="text-xs text-gray-500">Bác sĩ</p>
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
