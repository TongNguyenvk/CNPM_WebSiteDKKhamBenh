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

    return (
        <nav className="bg-white/95 backdrop-blur-md shadow-soft border-b border-neutral-200 fixed top-0 w-full z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo and Navigation */}
                    <div className="flex items-center space-x-8">
                        <div className="flex-shrink-0 flex items-center">
                            <Link
                                href="/"
                                className="flex items-center space-x-2 text-xl font-bold text-primary-600 hover:text-primary-700 transition-colors"
                            >
                                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">PK</span>
                                </div>
                                <span className="hidden sm:block">Phòng Khám</span>
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex md:space-x-1">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        'inline-flex items-center px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200',
                                        isActiveLink(item.href)
                                            ? 'bg-primary-100 text-primary-700 shadow-soft'
                                            : 'text-neutral-600 hover:text-primary-600 hover:bg-neutral-50'
                                    )}
                                >
                                    {item.icon && (
                                        <span className="mr-2">{item.icon}</span>
                                    )}
                                    {item.label}
                                    {item.badge && (
                                        <Badge variant="error" size="sm" className="ml-2">
                                            {item.badge}
                                        </Badge>
                                    )}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* User Menu */}
                    <div className="flex items-center space-x-4">
                        {/* User Info */}
                        <div className="hidden sm:flex items-center space-x-3">
                            <div className="text-right">
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
                            <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-white font-medium text-sm">
                                {getInitials(userName.split(' ')[0] || '', userName.split(' ')[1] || '')}
                            </div>
                        </div>

                        {/* Logout Button */}
                        <Button
                            variant="error"
                            size="sm"
                            onClick={handleLogout}
                            className="hidden sm:flex"
                        >
                            Đăng xuất
                        </Button>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden inline-flex items-center justify-center p-2 rounded-xl text-neutral-600 hover:text-primary-600 hover:bg-neutral-50 transition-colors"
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
                    <div className="md:hidden border-t border-neutral-200 bg-white">
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
                                    {item.icon && (
                                        <span className="mr-3">{item.icon}</span>
                                    )}
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