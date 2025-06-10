'use client';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getPatientAppointments } from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardBody, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge, StatusBadge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LoadingPage } from '@/components/ui/loading';
import { cn, formatDate, formatTime } from '@/lib/utils';

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
}

export default function PatientDashboard() {
    const { user, loading } = useAuth();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAppointments = async () => {
            if (!user) return;

            try {
                setError('');
                const data = await getPatientAppointments(user.userId);
                setAppointments(data);
            } catch (error: unknown) {
                const err = error as Error;
                setError(err.message || 'Lỗi khi tải lịch hẹn');
            }
        };

        fetchAppointments();
    }, [user]);

    if (loading) {
        return <LoadingPage text="Đang tải dashboard..." />;
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-50">
                <Card className="max-w-md mx-4">
                    <CardBody className="text-center py-8">
                        <div className="w-16 h-16 bg-error-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-error-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-neutral-900 mb-2">Có lỗi xảy ra</h3>
                        <p className="text-neutral-600 mb-6">{error}</p>
                        <Button onClick={() => window.location.reload()}>
                            Thử lại
                        </Button>
                    </CardBody>
                </Card>
            </div>
        );
    }

    const upcomingAppointments = appointments.filter(apt =>
        new Date(apt.date) >= new Date() && apt.statusId !== 'S3'
    ).slice(0, 3);

    const recentAppointments = appointments.slice(0, 5);

    return (
        <div className="min-h-screen bg-neutral-50">
            <div className="container py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-neutral-900 mb-2">
                        Chào mừng, {user?.firstName}! 👋
                    </h1>
                    <p className="text-neutral-600">
                        Quản lý lịch khám và theo dõi sức khỏe của bạn
                    </p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card>
                        <CardBody className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-neutral-900">{upcomingAppointments.length}</p>
                                <p className="text-sm text-neutral-600">Lịch khám sắp tới</p>
                            </div>
                        </CardBody>
                    </Card>

                    <Card>
                        <CardBody className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-success-100 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-neutral-900">{appointments.length}</p>
                                <p className="text-sm text-neutral-600">Tổng lịch khám</p>
                            </div>
                        </CardBody>
                    </Card>

                    <Card>
                        <CardBody className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-neutral-900">
                                    {new Set(appointments.map(apt => apt.doctorId)).size}
                                </p>
                                <p className="text-sm text-neutral-600">Bác sĩ đã khám</p>
                            </div>
                        </CardBody>
                    </Card>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Link href="/patient/specialties">
                        <Card hover className="h-full">
                            <CardBody className="text-center py-8">
                                <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                                <CardTitle as="h3" className="text-lg mb-2">Chuyên Khoa</CardTitle>
                                <CardDescription>Xem danh sách các chuyên khoa</CardDescription>
                            </CardBody>
                        </Card>
                    </Link>

                    <Link href="/patient/appointments">
                        <Card hover className="h-full">
                            <CardBody className="text-center py-8">
                                <div className="w-16 h-16 bg-success-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                    </svg>
                                </div>
                                <CardTitle as="h3" className="text-lg mb-2">Lịch Đã Đặt</CardTitle>
                                <CardDescription>Quản lý các lịch khám của bạn</CardDescription>
                            </CardBody>
                        </Card>
                    </Link>

                    <Link href="/patient/doctors">
                        <Card hover className="h-full">
                            <CardBody className="text-center py-8">
                                <div className="w-16 h-16 bg-accent-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <CardTitle as="h3" className="text-lg mb-2">Bác Sĩ</CardTitle>
                                <CardDescription>Tìm kiếm bác sĩ phù hợp</CardDescription>
                            </CardBody>
                        </Card>
                    </Link>

                    <Link href="/patient/profile">
                        <Card hover className="h-full">
                            <CardBody className="text-center py-8">
                                <div className="w-16 h-16 bg-secondary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <CardTitle as="h3" className="text-lg mb-2">Hồ Sơ</CardTitle>
                                <CardDescription>Cập nhật thông tin cá nhân</CardDescription>
                            </CardBody>
                        </Card>
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Upcoming Appointments */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Lịch Khám Sắp Tới</CardTitle>
                                <Link href="/patient/appointments">
                                    <Button variant="ghost" size="sm">
                                        Xem tất cả
                                    </Button>
                                </Link>
                            </div>
                        </CardHeader>
                        <CardBody>
                            {upcomingAppointments.length > 0 ? (
                                <div className="space-y-4">
                                    {upcomingAppointments.map((appointment) => (
                                        <div key={appointment.id} className="flex items-center space-x-4 p-4 bg-neutral-50 rounded-xl">
                                            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                                                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium text-neutral-900">
                                                    BS. {appointment.doctorData?.firstName} {appointment.doctorData?.lastName}
                                                </p>
                                                <p className="text-sm text-neutral-600">
                                                    {appointment.doctorData?.Specialty?.name || 'Chưa có thông tin'}
                                                </p>
                                                <div className="flex items-center space-x-4 mt-1">
                                                    <span className="text-sm text-neutral-500">
                                                        {formatDate(appointment.date)}
                                                    </span>
                                                    <StatusBadge status={appointment.statusId} size="sm" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <p className="text-neutral-600 mb-4">Chưa có lịch khám sắp tới</p>
                                    <Link href="/patient/specialties">
                                        <Button size="sm">Đặt lịch khám</Button>
                                    </Link>
                                </div>
                            )}
                        </CardBody>
                    </Card>

                    {/* Recent Appointments */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Lịch Sử Khám Bệnh</CardTitle>
                        </CardHeader>
                        <CardBody>
                            {recentAppointments.length > 0 ? (
                                <div className="space-y-4">
                                    {recentAppointments.map((appointment) => (
                                        <div key={appointment.id} className="flex items-center justify-between p-4 border border-neutral-200 rounded-xl">
                                            <div className="flex items-center space-x-3">
                                                {appointment.doctorData?.image ? (
                                                    <Image
                                                        src={appointment.doctorData.image}
                                                        alt={`${appointment.doctorData?.firstName} ${appointment.doctorData?.lastName}`}
                                                        width={40}
                                                        height={40}
                                                        className="w-10 h-10 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 bg-neutral-200 rounded-full flex items-center justify-center">
                                                        <svg className="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                        </svg>
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-medium text-neutral-900 text-sm">
                                                        BS. {appointment.doctorData?.firstName} {appointment.doctorData?.lastName}
                                                    </p>
                                                    <p className="text-xs text-neutral-500">
                                                        {formatDate(appointment.date)}
                                                    </p>
                                                </div>
                                            </div>
                                            <StatusBadge status={appointment.statusId} size="sm" />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-neutral-600">Chưa có lịch sử khám bệnh</p>
                                </div>
                            )}
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    );
} 