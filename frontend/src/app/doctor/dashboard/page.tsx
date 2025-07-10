'use client';
import React, { useEffect, useState } from 'react';
import { getTodayAppointments, getDoctorSchedules, getDoctorAppointments } from '../../../lib/api';
import { useAuth } from '../../../hooks/useAuth';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LoadingPage } from '@/components/ui/loading';
import { format, parseISO, isToday, isTomorrow, isPast } from 'date-fns';
import { vi } from 'date-fns/locale';
import Link from 'next/link';

interface Appointment {
    id: number;
    date: string;
    timeType: string;
    statusId: string;
    patientId: number;
    doctorId: number;
    patientData?: {
        firstName: string;
        lastName: string;
        email: string;
    };
    statusData?: {
        keyMap: string;
        valueVi: string;
        valueEn: string;
    };
}

interface Schedule {
    id: number;
    date: string;
    timeType: string;
    maxNumber: number;
    currentNumber: number;
    timeTypeData?: {
        valueVi: string;
        valueEn: string;
    };
}

export default function DoctorDashboard() {
    const { user } = useAuth();
    const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([]);
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [allAppointments, setAllAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [stats, setStats] = useState({
        totalPatients: 0,
        completedAppointments: 0,
        upcomingAppointments: 0,
        todayAppointments: 0,
        thisWeekAppointments: 0,
        thisMonthAppointments: 0,
        pendingAppointments: 0,
        cancelledAppointments: 0
    });

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;

            try {
                setLoading(true);
                setError('');

                // Gọi API song song để tối ưu thời gian
                const [todayData, schedulesData, allAppointmentsData] = await Promise.all([
                    getTodayAppointments(user.userId),
                    getDoctorSchedules(user.userId),
                    getDoctorAppointments(user.userId),
                ]);

                console.log('Today Appointments:', todayData);
                console.log('Schedules:', schedulesData);
                console.log('All Appointments:', allAppointmentsData);

                setTodayAppointments(todayData);
                setSchedules(schedulesData);
                setAllAppointments(allAppointmentsData);

                // Calculate statistics
                const today = new Date();
                const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
                const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

                const uniquePatients = new Set(allAppointmentsData.map(apt => apt.patientId)).size;
                const completed = allAppointmentsData.filter(apt => apt.statusId === 'S3').length;
                const pending = allAppointmentsData.filter(apt => apt.statusId === 'S1').length;
                const cancelled = allAppointmentsData.filter(apt => apt.statusId === 'S4').length;
                const upcoming = allAppointmentsData.filter(apt =>
                    apt.statusId === 'S1' && new Date(apt.date) >= new Date()
                ).length;

                const thisWeek = allAppointmentsData.filter(apt =>
                    new Date(apt.date) >= startOfWeek
                ).length;

                const thisMonth = allAppointmentsData.filter(apt =>
                    new Date(apt.date) >= startOfMonth
                ).length;

                setStats({
                    totalPatients: uniquePatients,
                    completedAppointments: completed,
                    upcomingAppointments: upcoming,
                    todayAppointments: todayData.length,
                    thisWeekAppointments: thisWeek,
                    thisMonthAppointments: thisMonth,
                    pendingAppointments: pending,
                    cancelledAppointments: cancelled
                });
            } catch (error: unknown) {
                const err = error as Error;
                setError(err.message || 'Lỗi khi tải lịch hẹn');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    const getDateLabel = (dateString: string) => {
        const date = parseISO(dateString);
        if (isToday(date)) return 'Hôm nay';
        if (isTomorrow(date)) return 'Ngày mai';
        return format(date, 'dd/MM/yyyy', { locale: vi });
    };

    const getStatusBadge = (statusId: string, statusData?: any) => {
        const statusMap: Record<string, { variant: any; text: string }> = {
            S1: { variant: 'warning', text: 'Chờ xác nhận' },
            S2: { variant: 'primary', text: 'Đã xác nhận' },
            S3: { variant: 'success', text: 'Hoàn thành' },
            S4: { variant: 'error', text: 'Đã hủy' }
        };

        const status = statusMap[statusId] || { variant: 'neutral', text: statusData?.valueVi || statusId };
        return (
            <Badge variant={status.variant} size="sm">
                {status.text}
            </Badge>
        );
    };

    if (loading) {
        return <LoadingPage text="Đang tải dashboard..." />;
    }

    if (error) {
        return (
            <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
                <Card className="max-w-md">
                    <CardBody className="text-center p-8">
                        <div className="w-16 h-16 bg-error-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-error-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-neutral-900 mb-2">Có lỗi xảy ra</h3>
                        <p className="text-neutral-600 mb-6">{error}</p>
                        <Button onClick={() => window.location.reload()}>
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Thử lại
                        </Button>
                    </CardBody>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50">
            <div className="container py-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-neutral-900 mb-2">
                        Dashboard Bác sĩ
                    </h1>
                    <p className="text-neutral-600">
                        Chào mừng trở lại, {user?.firstName} {user?.lastName}
                    </p>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardBody className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-neutral-900">{stats.todayAppointments}</p>
                                <p className="text-sm text-neutral-600">Lịch hôm nay</p>
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
                                <p className="text-2xl font-bold text-neutral-900">{stats.completedAppointments}</p>
                                <p className="text-sm text-neutral-600">Đã hoàn thành</p>
                            </div>
                        </CardBody>
                    </Card>

                    <Card>
                        <CardBody className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-neutral-900">{stats.upcomingAppointments}</p>
                                <p className="text-sm text-neutral-600">Sắp tới</p>
                            </div>
                        </CardBody>
                    </Card>

                    <Card>
                        <CardBody className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-warning-100 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-neutral-900">{stats.totalPatients}</p>
                                <p className="text-sm text-neutral-600">Tổng bệnh nhân</p>
                            </div>
                        </CardBody>
                    </Card>
                </div>

                {/* Additional Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardBody className="text-center">
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                                </svg>
                            </div>
                            <p className="text-lg font-semibold text-neutral-900">{stats.thisWeekAppointments}</p>
                            <p className="text-xs text-neutral-600">Tuần này</p>
                        </CardBody>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <CardBody className="text-center">
                            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <p className="text-lg font-semibold text-neutral-900">{stats.thisMonthAppointments}</p>
                            <p className="text-xs text-neutral-600">Tháng này</p>
                        </CardBody>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <CardBody className="text-center">
                            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <p className="text-lg font-semibold text-neutral-900">{stats.pendingAppointments}</p>
                            <p className="text-xs text-neutral-600">Chờ xử lý</p>
                        </CardBody>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <CardBody className="text-center">
                            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                            <p className="text-lg font-semibold text-neutral-900">{stats.cancelledAppointments}</p>
                            <p className="text-xs text-neutral-600">Đã hủy</p>
                        </CardBody>
                    </Card>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Today's Appointments */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Lịch khám hôm nay</CardTitle>
                                    <Link href="/doctor/appointments">
                                        <Button variant="ghost" size="sm">
                                            Xem tất cả
                                        </Button>
                                    </Link>
                                </div>
                            </CardHeader>
                            <CardBody>
                                {todayAppointments.length > 0 ? (
                                    <div className="space-y-4">
                                        {todayAppointments.slice(0, 5).map((appointment) => (
                                            <div key={appointment.id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                                                        <span className="text-primary-600 font-medium text-sm">
                                                            {appointment.patientData?.firstName?.charAt(0)}{appointment.patientData?.lastName?.charAt(0)}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-medium text-neutral-900">
                                                            {appointment.patientData?.firstName} {appointment.patientData?.lastName}
                                                        </h4>
                                                        <p className="text-sm text-neutral-600">
                                                            {appointment.patientData?.email}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-medium text-neutral-900">
                                                        {appointment.timeType}
                                                    </p>
                                                    {getStatusBadge(appointment.statusId, appointment.statusData)}
                                                </div>
                                            </div>
                                        ))}
                                        {todayAppointments.length > 5 && (
                                            <div className="text-center pt-4">
                                                <Link href="/doctor/appointments">
                                                    <Button variant="outline" size="sm">
                                                        Xem thêm {todayAppointments.length - 5} lịch khám
                                                    </Button>
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <p className="text-neutral-600 mb-4">Hôm nay bạn không có lịch khám nào</p>
                                        <Link href="/doctor/schedule">
                                            <Button variant="outline">
                                                Xem lịch làm việc
                                            </Button>
                                        </Link>
                                    </div>
                                )}
                            </CardBody>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Thao Tác Nhanh</CardTitle>
                            </CardHeader>
                            <CardBody className="space-y-4">
                                <Link href="/doctor/appointments">
                                    <Button className="w-full justify-start m-1" variant="outline">
                                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        Xem lịch khám
                                    </Button>
                                </Link>

                                <Link href="/doctor/patients">
                                    <Button className="w-full justify-start m-1" variant="outline">
                                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        Quản lý bệnh nhân
                                    </Button>
                                </Link>

                                <Link href="/doctor/medical-records">
                                    <Button className="w-full justify-start m-1" variant="outline">
                                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Hồ sơ bệnh án
                                    </Button>
                                </Link>

                                <Link href="/doctor/schedule">
                                    <Button className="w-full justify-start m-1" variant="outline">
                                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Lịch làm việc
                                    </Button>
                                </Link>
                            </CardBody>
                        </Card>

                        {/* Upcoming Schedules */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Lịch Làm Việc Sắp Tới</CardTitle>
                                    <Link href="/doctor/schedule">
                                        <Button variant="ghost" size="sm">
                                            Xem tất cả
                                        </Button>
                                    </Link>
                                </div>
                            </CardHeader>
                            <CardBody>
                                {schedules.length > 0 ? (
                                    <div className="space-y-4">
                                        {schedules.slice(0, 4).map((schedule) => (
                                            <div key={schedule.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                                                <div>
                                                    <p className="font-medium text-neutral-900">
                                                        {getDateLabel(schedule.date)}
                                                    </p>
                                                    <p className="text-sm text-neutral-600">
                                                        {schedule.timeTypeData?.valueVi || schedule.timeType}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-medium text-neutral-900">
                                                        {schedule.currentNumber}/{schedule.maxNumber}
                                                    </p>
                                                    <div className="w-16 bg-neutral-200 rounded-full h-1.5 mt-1">
                                                        <div
                                                            className="bg-primary-600 h-1.5 rounded-full"
                                                            style={{
                                                                width: `${Math.min((schedule.currentNumber / schedule.maxNumber) * 100, 100)}%`
                                                            }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-6">
                                        <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <svg className="w-6 h-6 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <p className="text-sm text-neutral-600">Chưa có lịch làm việc</p>
                                    </div>
                                )}
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}