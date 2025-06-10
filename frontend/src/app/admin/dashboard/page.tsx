'use client';
import React, { useEffect, useState } from 'react';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LoadingPage } from '@/components/ui/loading';
import Link from 'next/link';

interface DashboardStats {
    totalUsers: number;
    totalDoctors: number;
    totalPatients: number;
    totalAppointments: number;
    pendingAppointments: number;
    completedAppointments: number;
    totalSpecialties: number;
    activeSchedules: number;
}

interface RecentActivity {
    id: number;
    type: 'appointment' | 'user' | 'schedule';
    title: string;
    description: string;
    time: string;
    status?: string;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate API calls - replace with actual API calls
        const fetchDashboardData = async () => {
            try {
                setLoading(true);

                // Simulate API delay
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Mock data - replace with actual API calls
                setStats({
                    totalUsers: 1250,
                    totalDoctors: 45,
                    totalPatients: 1205,
                    totalAppointments: 3420,
                    pendingAppointments: 28,
                    completedAppointments: 3392,
                    totalSpecialties: 12,
                    activeSchedules: 156
                });

                setRecentActivities([
                    {
                        id: 1,
                        type: 'appointment',
                        title: 'Lịch khám mới',
                        description: 'Bệnh nhân Nguyễn Văn A đặt lịch khám với BS. Trần Thị B',
                        time: '5 phút trước',
                        status: 'pending'
                    },
                    {
                        id: 2,
                        type: 'user',
                        title: 'Người dùng mới',
                        description: 'Bác sĩ Lê Văn C đã đăng ký tài khoản',
                        time: '15 phút trước',
                        status: 'active'
                    },
                    {
                        id: 3,
                        type: 'schedule',
                        title: 'Lịch làm việc cập nhật',
                        description: 'BS. Phạm Thị D cập nhật lịch làm việc tuần tới',
                        time: '1 giờ trước',
                        status: 'updated'
                    },
                    {
                        id: 4,
                        type: 'appointment',
                        title: 'Lịch khám hoàn thành',
                        description: 'Bệnh nhân Hoàng Văn E đã hoàn thành khám với BS. Nguyễn Thị F',
                        time: '2 giờ trước',
                        status: 'completed'
                    }
                ]);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return <LoadingPage text="Đang tải dashboard..." />;
    }

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'appointment':
                return (
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                );
            case 'user':
                return (
                    <div className="w-10 h-10 bg-success-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                );
            case 'schedule':
                return (
                    <div className="w-10 h-10 bg-accent-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                );
            default:
                return (
                    <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                );
        }
    };

    const getStatusBadge = (status?: string) => {
        if (!status) return null;

        const statusMap: Record<string, { variant: any; text: string }> = {
            pending: { variant: 'warning', text: 'Chờ xử lý' },
            active: { variant: 'success', text: 'Hoạt động' },
            completed: { variant: 'success', text: 'Hoàn thành' },
            updated: { variant: 'primary', text: 'Đã cập nhật' }
        };

        const statusInfo = statusMap[status] || { variant: 'neutral', text: status };

        return (
            <Badge variant={statusInfo.variant} size="sm">
                {statusInfo.text}
            </Badge>
        );
    };

    return (
        <div className="min-h-screen bg-neutral-50">
            <div className="container py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-neutral-900 mb-2">
                        Dashboard Quản Trị
                    </h1>
                    <p className="text-neutral-600">
                        Tổng quan hệ thống và quản lý toàn bộ hoạt động phòng khám
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Total Users */}
                    <Card>
                        <CardBody className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-neutral-900">{stats?.totalUsers.toLocaleString()}</p>
                                <p className="text-sm text-neutral-600">Tổng người dùng</p>
                            </div>
                        </CardBody>
                    </Card>

                    {/* Total Doctors */}
                    <Card>
                        <CardBody className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-success-100 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-neutral-900">{stats?.totalDoctors}</p>
                                <p className="text-sm text-neutral-600">Bác sĩ</p>
                            </div>
                        </CardBody>
                    </Card>

                    {/* Total Appointments */}
                    <Card>
                        <CardBody className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-neutral-900">{stats?.totalAppointments.toLocaleString()}</p>
                                <p className="text-sm text-neutral-600">Lịch khám</p>
                            </div>
                        </CardBody>
                    </Card>

                    {/* Pending Appointments */}
                    <Card>
                        <CardBody className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-warning-100 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-neutral-900">{stats?.pendingAppointments}</p>
                                <p className="text-sm text-neutral-600">Chờ xác nhận</p>
                            </div>
                        </CardBody>
                    </Card>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Quick Actions */}
                    <div className="lg:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle>Thao Tác Nhanh</CardTitle>
                            </CardHeader>
                            <CardBody className="space-y-4">
                                <Link href="/admin/users/new">
                                    <Button className="w-full justify-start" variant="outline">
                                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        Thêm người dùng mới
                                    </Button>
                                </Link>

                                <Link href="/admin/schedules">
                                    <Button className="w-full justify-start" variant="outline">
                                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        Quản lý lịch làm việc
                                    </Button>
                                </Link>

                                <Link href="/admin/appointments">
                                    <Button className="w-full justify-start" variant="outline">
                                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                        Xem lịch khám
                                    </Button>
                                </Link>

                                <Link href="/admin/doctors">
                                    <Button className="w-full justify-start" variant="outline">
                                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        Quản lý bác sĩ
                                    </Button>
                                </Link>
                            </CardBody>
                        </Card>

                        {/* System Stats */}
                        <Card className="mt-6">
                            <CardHeader>
                                <CardTitle>Thống Kê Hệ Thống</CardTitle>
                            </CardHeader>
                            <CardBody className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-neutral-600">Chuyên khoa</span>
                                    <span className="font-semibold text-neutral-900">{stats?.totalSpecialties}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-neutral-600">Lịch làm việc</span>
                                    <span className="font-semibold text-neutral-900">{stats?.activeSchedules}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-neutral-600">Bệnh nhân</span>
                                    <span className="font-semibold text-neutral-900">{stats?.totalPatients.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-neutral-600">Khám hoàn thành</span>
                                    <span className="font-semibold text-success-600">{stats?.completedAppointments.toLocaleString()}</span>
                                </div>
                            </CardBody>
                        </Card>
                    </div>

                    {/* Recent Activities */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Hoạt Động Gần Đây</CardTitle>
                                    <Button variant="ghost" size="sm">
                                        Xem tất cả
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardBody>
                                {recentActivities.length > 0 ? (
                                    <div className="space-y-4">
                                        {recentActivities.map((activity) => (
                                            <div key={activity.id} className="flex items-start space-x-4 p-4 bg-neutral-50 rounded-xl">
                                                {getActivityIcon(activity.type)}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <h4 className="text-sm font-medium text-neutral-900">
                                                            {activity.title}
                                                        </h4>
                                                        {getStatusBadge(activity.status)}
                                                    </div>
                                                    <p className="text-sm text-neutral-600 mb-2">
                                                        {activity.description}
                                                    </p>
                                                    <p className="text-xs text-neutral-500">
                                                        {activity.time}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <p className="text-neutral-600">Chưa có hoạt động nào</p>
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