'use client';
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { logoutUser } from '../lib/api';

interface NavItem {
    label: string;
    href: string;
}

interface NavbarProps {
    role: string;
    userName: string;
    navItems: NavItem[];
}

export default function Navbar({ role, userName, navItems }: NavbarProps) {
    const router = useRouter();

    console.log('Navbar Props:', { role, userName, navItems });

    const handleLogout = () => {
        logoutUser();
        router.push('/auth/login');
    };

    return (
        <nav className="bg-white shadow-md fixed top-0 w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center space-x-8">
                        <div className="flex-shrink-0 flex items-center">
                            <Link href="/" className="text-xl font-bold text-blue-600">
                                Phòng Khám
                            </Link>
                        </div>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-900 hover:text-blue-600"
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="text-gray-700 mr-4">
                            Xin chào, {userName}
                        </span>
                        <button
                            onClick={handleLogout}
                            className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700"
                        >
                            Đăng xuất
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
} 