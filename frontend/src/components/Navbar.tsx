'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { logoutUser } from '../lib/api';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { cn, getRoleText, getInitials } from '@/lib/utils';

interface NavItem {
    label: string;
    href: string;
    icon?: React.ReactNode;
    badge?: string;
}

interface NavbarProps {
    role: string;
    userName: string;
    navItems: NavItem[];
}

export default function Navbar({ role, userName, navItems }: NavbarProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logoutUser();
        router.push('/auth/login');
    };

    const getRoleColor = (role: string) => {
        const roleColors: Record<string, string> = {
            R1: 'primary',
            R2: 'success',
            R3: 'warning',
            patient: 'primary',
            doctor: 'success',
            admin: 'warning',
        };
        return roleColors[role] || 'neutral';
    };

    const isActiveLink = (href: string) => {
        return pathname === href || pathname.startsWith(href + '/');
    };

    const getShortLabel = (label: string) => {
        const shortLabels: Record<string, string> = {
            'Dashboard': 'Home',
            'Quản Lý User': 'Users',
            'Quản Lý Bác Sĩ': 'Bác Sĩ',
            'Quản Lý Chuyên Khoa': 'Chuyên Khoa',
            'Quản Lý Lịch Phân Công': 'Phân Công',
            'Quản Lý Lịch Khám': 'Lịch Khám',
            'Chuyên Khoa': 'Khoa',
            'Bác Sĩ': 'BS',
            'Lịch Khám': 'Lịch',
            'Lịch Đã Đặt': 'Đã Đặt',
            'Đặt Lịch Khám': 'Đặt Lịch',
            'Bệnh Nhân': 'BN',
            'Hồ Sơ Bệnh Án': 'Hồ Sơ',
            'Lịch Phân Công': 'Phân Công',
            'Tôi': 'Tôi'
        };
        return shortLabels[label] || label;
    };

    const getNavIcon = (label: string) => {
        const iconMap: Record<string, React.ReactNode> = {
            'Dashboard': (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6a2 2 0 01-2 2H10a2 2 0 01-2-2V5z" />
                </svg>
            ),
            'Quản Lý User': (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
            ),
            'Quản Lý Bác Sĩ': (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            ),
            'Quản Lý Chuyên Khoa': (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
            ),
            'Quản Lý Lịch Phân Công': (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            ),
            'Quản Lý Lịch Khám': (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v11a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
            ),
            'Lịch Khám': (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v11a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
            ),
            'Tôi': (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            ),
        };
        return iconMap[label] || null;
    };

    return (
        <nav className="bg-white/95 backdrop-blur-md shadow-soft border-b border-neutral-200 fixed top-0 w-full z-50">
            <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
                <div className="flex justify-between items-center h-16">
                    {/* Logo and Navigation */}
                    <div className="flex items-center space-x-2 sm:space-x-4 lg:space-x-8 flex-1 min-w-0">
                        <div className="flex-shrink-0 flex items-center">
                            <Link
                                href="/"
                                className="flex items-center space-x-2 text-lg sm:text-xl font-bold text-primary-600 hover:text-primary-700 transition-colors"
                            >
                                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">PK</span>
                                </div>
                                <span className="hidden sm:block">Phòng Khám</span>
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex lg:space-x-1">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        'inline-flex items-center px-3 py-2 text-sm font-medium rounded-xl transition-all duration-200 whitespace-nowrap',
                                        isActiveLink(item.href)
                                            ? 'bg-primary-100 text-primary-700 shadow-soft'
                                            : 'text-neutral-600 hover:text-primary-600 hover:bg-neutral-50'
                                    )}
                                >
                                    <span className="mr-2">{getNavIcon(item.label)}</span>
                                    <span className="hidden xl:inline">{item.label}</span>
                                    <span className="xl:hidden">{getShortLabel(item.label)}</span>
                                    {item.badge && (
                                        <Badge variant="error" size="sm" className="ml-2">
                                            {item.badge}
                                        </Badge>
                                    )}
                                </Link>
                            ))}
                        </div>

                        {/* Tablet Navigation - Icon only */}
                        <div className="hidden md:flex lg:hidden md:space-x-1">
                            {navItems.slice(0, 4).map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        'inline-flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200',
                                        isActiveLink(item.href)
                                            ? 'bg-primary-100 text-primary-700 shadow-soft'
                                            : 'text-neutral-600 hover:text-primary-600 hover:bg-neutral-50'
                                    )}
                                    title={item.label}
                                >
                                    {getNavIcon(item.label)}
                                    {item.badge && (
                                        <Badge variant="error" size="xs" className="absolute -top-1 -right-1">
                                            {item.badge}
                                        </Badge>
                                    )}
                                </Link>
                            ))}
                            {navItems.length > 4 && (
                                <button
                                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                    className="inline-flex items-center justify-center w-10 h-10 rounded-xl text-neutral-600 hover:text-primary-600 hover:bg-neutral-50 transition-all duration-200"
                                    title="Thêm"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* User Menu */}
                    <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
                        {/* User Info */}
                        <div className="hidden md:flex items-center space-x-3">
                            <div className="text-right hidden lg:block">
                                <p className="text-sm font-medium text-neutral-900 truncate max-w-32">
                                    {userName}
                                </p>
                                <Badge
                                    variant={getRoleColor(role) as any}
                                    size="sm"
                                >
                                    {getRoleText(role)}
                                </Badge>
                            </div>
                            <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-white font-medium text-sm">
                                {getInitials(userName.split(' ')[0] || '', userName.split(' ')[1] || '')}
                            </div>
                        </div>

                        {/* Logout Button */}
                        <Button
                            variant="error"
                            size="sm"
                            onClick={handleLogout}
                            className="hidden lg:flex"
                        >
                            <span className="hidden xl:inline">Đăng xuất</span>
                            <span className="xl:hidden">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                            </span>
                        </Button>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden inline-flex items-center justify-center p-2 rounded-xl text-neutral-600 hover:text-primary-600 hover:bg-neutral-50 transition-colors"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                {isMobileMenuOpen ? (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                ) : (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="lg:hidden border-t border-neutral-200 bg-white">
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            {/* User Info Mobile */}
                            <div className="flex items-center space-x-3 px-3 py-3 border-b border-neutral-200">
                                <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-white font-medium text-sm">
                                    {getInitials(userName.split(' ')[0] || '', userName.split(' ')[1] || '')}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-neutral-900">
                                        {userName}
                                    </p>
                                    <Badge
                                        variant={getRoleColor(role) as any}
                                        size="sm"
                                    >
                                        {getRoleText(role)}
                                    </Badge>
                                </div>
                            </div>

                            {/* Navigation Items Mobile */}
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        'flex items-center px-3 py-2 text-sm font-medium rounded-xl transition-all duration-200',
                                        isActiveLink(item.href)
                                            ? 'bg-primary-100 text-primary-700'
                                            : 'text-neutral-600 hover:text-primary-600 hover:bg-neutral-50'
                                    )}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <span className="mr-3">{getNavIcon(item.label)}</span>
                                    {item.label}
                                    {item.badge && (
                                        <Badge variant="error" size="sm" className="ml-auto">
                                            {item.badge}
                                        </Badge>
                                    )}
                                </Link>
                            ))}

                            {/* Logout Button Mobile */}
                            <Button
                                variant="error"
                                size="sm"
                                onClick={handleLogout}
                                className="w-full mt-4"
                            >
                                Đăng xuất
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}