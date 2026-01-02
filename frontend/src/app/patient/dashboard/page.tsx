'use client';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getPatientAppointments } from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';
import { cn, formatDate, getAvatarUrl } from '@/lib/utils';

interface Appointment {
    id: number;
    date: string;
    timeType: string;
    statusId: string;
    doctorId: number;
    doctorData?: {
        firstName: string;
        lastName: string;
        image: string;
        Specialty?: {
            name: string;
        };
    };
    statusData?: {
        keyMap: string;
        valueVi: string;
        valueEn: string;
    };
    timeTypeData?: {
        valueVi: string;
    };
}

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
    S1: { label: 'Chờ xác nhận', color: 'text-yellow-700', bg: 'bg-yellow-100' },
    S2: { label: 'Đã xác nhận', color: 'text-blue-700', bg: 'bg-blue-100' },
    S3: { label: 'Hoàn thành', color: 'text-green-700', bg: 'bg-green-100' },
    S4: { label: 'Đã hủy', color: 'text-red-700', bg: 'bg-red-100' },
};

export default function PatientDashboard() {
    const { user, loading } = useAuth();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({
        totalAppointments: 0,
        upcomingAppointments: 0,
        completedAppointments: 0,
        cancelledAppointments: 0,
    });

    useEffect(() => {
        const fetchAppointments = async () => {
            if (!user) return;

            try {
                setError('');
                const data = await getPatientAppointments(user.userId);
                setAppointments(data);

                const today = new Date();
                const upcoming = data.filter((apt: Appointment) =>
                    new Date(apt.date) >= today && apt.statusId !== 'S3' && apt.statusId !== 'S4'
                ).length;
                const completed = data.filter((apt: Appointment) => apt.statusId === 'S3').length;
                const cancelled = data.filter((apt: Appointment) => apt.statusId === 'S4').length;

                setStats({
                    totalAppointments: data.length,
                    upcomingAppointments: upcoming,
                    completedAppointments: completed,
                    cancelledAppointments: cancelled,
                });
            } catch (error: unknown) {
                const err = error as Error;
                setError(err.message || 'Lỗi khi tải lịch hẹn');
            } finally {
                setIsLoading(false);
            }
        };

        fetchAppointments();
    }, [user]);

    if (loading || isLoading) {
        return (
            <div className="h-full flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    const upcomingAppointments = appointments
        .filter(apt => new Date(apt.date) >= new Date() && apt.statusId !== 'S3' && apt.statusId !== 'S4')
        .slice(0, 5);

    return (
        <div className="h-full overflow-auto bg-gray-50">
            <div className="p-6">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Xin chào, {user?.firstName}! 👋
                    </h1>
                    <p className="text-gray-600 mt-1">Quản lý lịch khám và theo dõi sức khỏe của bạn</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-xl p-5 border shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stats.upcomingAppointments}</p>
                                <p className="text-sm text-gray-600">Lịch sắp tới</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-5 border shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stats.completedAppointments}</p>
                                <p className="text-sm text-gray-600">Đã hoàn thành</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-5 border shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stats.cancelledAppointments}</p>
                                <p className="text-sm text-gray-600">Đã hủy</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-5 border shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stats.totalAppointments}</p>
                                <p className="text-sm text-gray-600">Tổng lịch khám</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <Link href="/patient/specialties" className="bg-white rounded-xl p-5 border shadow-sm hover:shadow-md transition-shadow group">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">Chuyên khoa</p>
                                <p className="text-sm text-gray-500">Xem danh sách</p>
                            </div>
                        </div>
                    </Link>

                    <Link href="/patient/doctors" className="bg-white rounded-xl p-5 border shadow-sm hover:shadow-md transition-shadow group">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">Bác sĩ</p>
                                <p className="text-sm text-gray-500">Tìm bác sĩ</p>
                            </div>
                        </div>
                    </Link>

                    <Link href="/patient/book_appointment" className="bg-white rounded-xl p-5 border shadow-sm hover:shadow-md transition-shadow group">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">Đặt lịch</p>
                                <p className="text-sm text-gray-500">Đặt lịch khám</p>
                            </div>
                        </div>
                    </Link>

                    <Link href="/patient/profile" className="bg-white rounded-xl p-5 border shadow-sm hover:shadow-md transition-shadow group">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">Hồ sơ</p>
                                <p className="text-sm text-gray-500">Thông tin cá nhân</p>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Upcoming Appointments */}
                <div className="bg-white rounded-xl border shadow-sm">
                    <div className="px-5 py-4 border-b flex items-center justify-between">
                        <h2 className="font-semibold text-gray-900">Lịch khám sắp tới</h2>
                        <Link href="/patient/appointments" className="text-sm text-blue-600 hover:text-blue-700">
                            Xem tất cả →
                        </Link>
                    </div>
                    <div className="p-5">
                        {upcomingAppointments.length === 0 ? (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <p className="text-gray-600 mb-4">Chưa có lịch khám sắp tới</p>
                                <Link
                                    href="/patient/book_appointment"
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Đặt lịch khám
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {upcomingAppointments.map((apt) => {
                                    const status = statusConfig[apt.statusId] || statusConfig.S1;
                                    return (
                                        <div key={apt.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                {apt.doctorData?.image ? (
                                                    <Image
                                                        src={getAvatarUrl(apt.doctorData?.image)}
                                                        alt=""
                                                        width={48}
                                                        height={48}
                                                        className="w-12 h-12 rounded-full object-cover"
                                                        unoptimized
                                                    />
                                                ) : (
                                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-gray-900">
                                                    BS. {apt.doctorData?.firstName} {apt.doctorData?.lastName}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {apt.doctorData?.Specialty?.name || 'Chưa có thông tin'}
                                                </p>
                                                <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                                                    <span>{formatDate(apt.date)}</span>
                                                    <span>•</span>
                                                    <span>{apt.timeTypeData?.valueVi || apt.timeType}</span>
                                                </div>
                                            </div>
                                            <span className={cn('px-2.5 py-1 rounded-full text-xs font-medium', status.bg, status.color)}>
                                                {status.label}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
