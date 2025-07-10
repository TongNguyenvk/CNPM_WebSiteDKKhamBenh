'use client';
import React, { useEffect, useState } from 'react';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LoadingPage } from '@/components/ui/loading';
import { getDashboardStats, DashboardStats } from '@/lib/api';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

interface RecentActivity {
    id: number;
    type: 'appointment' | 'user' | 'schedule' | 'system';
    title: string;
    description: string;
    time: string;
    status?: string;
    priority?: 'low' | 'medium' | 'high';
}

interface QuickAction {
    id: string;
    title: string;
    description: string;
    icon: string;
    href: string;
    color: string;
    count?: number;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [selectedTimeRange, setSelectedTimeRange] = useState<'today' | 'week' | 'month'>('today');

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Lấy thống kê thực tế từ API
                const dashboardStats = await getDashboardStats();
                setStats(dashboardStats);

                setRecentActivities([
                    {
                        id: 1,
                        type: 'appointment',
                        title: 'Lịch khám khẩn cấp',
                        description: 'Bệnh nhân Nguyễn Văn A đặt lịch khám khẩn cấp với BS. Trần Thị B',
                        time: '2 phút trước',
                        status: 'pending',
                        priority: 'high'
                    },
                    {
                        id: 2,
                        type: 'user',
                        title: 'Bác sĩ mới tham gia',
                        description: 'BS. Lê Văn C - Chuyên khoa Tim mạch đã được phê duyệt',
                        time: '15 phút trước',
                        status: 'active',
                        priority: 'medium'
                    },
                    {
                        id: 3,
                        type: 'system',
                        title: 'Cập nhật hệ thống',
                        description: 'Hệ thống đã được cập nhật phiên bản 2.1.0 thành công',
                        time: '30 phút trước',
                        status: 'completed',
                        priority: 'low'
                    },
                    {
                        id: 4,
                        type: 'schedule',
                        title: 'Lịch làm việc thay đổi',
                        description: 'BS. Phạm Thị D thay đổi lịch làm việc cuối tuần',
                        time: '45 phút trước',
                        status: 'updated',
                        priority: 'medium'
                    },
                    {
                        id: 5,
                        type: 'appointment',
                        title: 'Khám bệnh hoàn thành',
                        description: 'Bệnh nhân Hoàng Văn E đã hoàn thành khám với BS. Nguyễn Thị F',
                        time: '1 giờ trước',
                        status: 'completed',
                        priority: 'low'
                    }
                ]);
            } catch (err: any) {
                setError(err.message || 'Không thể tải dữ liệu dashboard');
                console.error('Dashboard error:', err);
                toast.error('Lỗi khi tải thống kê dashboard');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return <LoadingPage text="Đang tải dashboard..." />;
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 text-xl mb-4">{error}</div>
                    <Button onClick={() => window.location.reload()}>
                        Thử lại
                    </Button>
                </div>
            </div>
        );
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

    const quickActions: QuickAction[] = [
        {
            id: 'add-user',
            title: 'Thêm người dùng',
            description: 'Tạo tài khoản mới',
            icon: 'user-plus',
            href: '/admin/users/new',
            color: 'primary',
            count: stats?.pendingAppointments
        },
        {
            id: 'manage-schedules',
            title: 'Lịch làm việc',
            description: 'Quản lý lịch bác sĩ',
            icon: 'calendar',
            href: '/admin/schedules',
            color: 'success',
            count: stats?.activeSchedules
        },
        {
            id: 'view-appointments',
            title: 'Lịch khám',
            description: 'Xem tất cả lịch khám',
            icon: 'clipboard',
            href: '/admin/appointments',
            color: 'accent',
            count: stats?.todayAppointments
        },
        {
            id: 'manage-doctors',
            title: 'Quản lý bác sĩ',
            description: 'Thông tin bác sĩ',
            icon: 'doctor',
            href: '/admin/doctors',
            color: 'secondary',
            count: stats?.totalDoctors
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary-50/20">
            <div className="container py-8">
                {/* Enhanced Header with Real-time Info */}
                <div className="mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div>
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center shadow-medium">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <div>
                                    <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                                        Dashboard quản trị
                                    </h1>
                                    <p className="text-neutral-600 text-lg">
                                        Tổng quan hệ thống và quản lý toàn bộ hoạt động phòng khám
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Real-time Status Panel */}
                        <div className="bg-white rounded-2xl p-6 shadow-large border border-neutral-200/50 min-w-[320px]">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="text-sm font-medium text-neutral-600">Hệ thống hoạt động</span>
                                </div>
                                <span className="text-xs text-neutral-500">
                                    {currentTime.toLocaleTimeString('vi-VN')}
                                </span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-green-600">{stats?.systemHealth}%</p>
                                    <p className="text-xs text-neutral-500">Hiệu suất</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-primary-600">{stats?.activeUsers}</p>
                                    <p className="text-xs text-neutral-500">Đang online</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Enhanced Stats Grid with Animations */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Total Users */}
                    <Card className="group hover:shadow-large transition-all duration-300 hover:-translate-y-1 border-0 bg-gradient-to-br from-white to-primary-50/30">
                        <CardBody className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-medium group-hover:scale-110 transition-transform duration-300">
                                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                    </svg>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center space-x-1 text-green-600 text-sm font-medium">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                                        </svg>
                                        <span>+{stats?.monthlyGrowth}%</span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-neutral-900 mb-1">{stats?.totalUsers.toLocaleString()}</p>
                                <p className="text-neutral-600 font-medium">Tổng người dùng</p>
                                <p className="text-xs text-neutral-500 mt-1">Tăng trưởng tháng này</p>
                            </div>
                        </CardBody>
                    </Card>

                    {/* Total Doctors */}
                    <Card className="group hover:shadow-large transition-all duration-300 hover:-translate-y-1 border-0 bg-gradient-to-br from-white to-success-50/30">
                        <CardBody className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-14 h-14 bg-gradient-to-br from-success-500 to-success-600 rounded-2xl flex items-center justify-center shadow-medium group-hover:scale-110 transition-transform duration-300">
                                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center space-x-1 text-success-600 text-sm font-medium">
                                        <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
                                        <span>Hoạt động</span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-neutral-900 mb-1">{stats?.totalDoctors}</p>
                                <p className="text-neutral-600 font-medium">Bác sĩ</p>
                                <p className="text-xs text-neutral-500 mt-1">Đang phục vụ bệnh nhân</p>
                            </div>
                        </CardBody>
                    </Card>

                    {/* Today's Appointments */}
                    <Card className="group hover:shadow-large transition-all duration-300 hover:-translate-y-1 border-0 bg-gradient-to-br from-white to-accent-50/30">
                        <CardBody className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-14 h-14 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl flex items-center justify-center shadow-medium group-hover:scale-110 transition-transform duration-300">
                                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div className="text-right">
                                    <div className="text-accent-600 text-sm font-medium">
                                        Hôm nay
                                    </div>
                                </div>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-neutral-900 mb-1">{stats?.todayAppointments}</p>
                                <p className="text-neutral-600 font-medium">Lịch khám hôm nay</p>
                                <p className="text-xs text-neutral-500 mt-1">Từ tổng {stats?.totalAppointments.toLocaleString()} lịch</p>
                            </div>
                        </CardBody>
                    </Card>

                    {/* Pending Appointments */}
                    <Card className="group hover:shadow-large transition-all duration-300 hover:-translate-y-1 border-0 bg-gradient-to-br from-white to-warning-50/30">
                        <CardBody className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-14 h-14 bg-gradient-to-br from-warning-500 to-warning-600 rounded-2xl flex items-center justify-center shadow-medium group-hover:scale-110 transition-transform duration-300">
                                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center space-x-1 text-warning-600 text-sm font-medium">
                                        <div className="w-2 h-2 bg-warning-500 rounded-full animate-bounce"></div>
                                        <span>Cần xử lý</span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-neutral-900 mb-1">{stats?.pendingAppointments}</p>
                                <p className="text-neutral-600 font-medium">Chờ xác nhận</p>
                                <p className="text-xs text-neutral-500 mt-1">Cần được xử lý sớm</p>
                            </div>
                        </CardBody>
                    </Card>
                </div>

                {/* Enhanced Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Interactive Quick Actions */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card className="border-0 shadow-large bg-gradient-to-br from-white to-neutral-50/50">
                            <CardHeader className="pb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-primary-100 rounded-xl flex items-center justify-center">
                                        <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                    <CardTitle className="text-xl">Thao Tác Nhanh</CardTitle>
                                </div>
                            </CardHeader>
                            <CardBody className="space-y-3">
                                {quickActions.map((action) => (
                                    <Link key={action.id} href={action.href}>
                                        <div className="group p-4 m-2 rounded-xl border border-neutral-200 hover:border-primary-300 hover:bg-primary-50/50 transition-all duration-200 cursor-pointer">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <div className={`w-10 h-10 bg-${action.color}-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                                                        {action.icon === 'user-plus' && (
                                                            <svg className={`w-5 h-5 text-${action.color}-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                            </svg>
                                                        )}
                                                        {action.icon === 'calendar' && (
                                                            <svg className={`w-5 h-5 text-${action.color}-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                        )}
                                                        {action.icon === 'clipboard' && (
                                                            <svg className={`w-5 h-5 text-${action.color}-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                            </svg>
                                                        )}
                                                        {action.icon === 'doctor' && (
                                                            <svg className={`w-5 h-5 text-${action.color}-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                            </svg>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-neutral-900 group-hover:text-primary-700 transition-colors">
                                                            {action.title}
                                                        </h4>
                                                        <p className="text-sm text-neutral-600">{action.description}</p>
                                                    </div>
                                                </div>
                                                {action.count && (
                                                    <div className={`px-3 py-1 bg-${action.color}-100 text-${action.color}-700 rounded-full text-sm font-medium`}>
                                                        {action.count}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </CardBody>
                        </Card>

                        {/* Enhanced System Stats */}
                        <Card className="border-0 shadow-large bg-gradient-to-br from-white to-secondary-50/30">
                            <CardHeader className="pb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-secondary-100 rounded-xl flex items-center justify-center">
                                        <svg className="w-4 h-4 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                    </div>
                                    <CardTitle className="text-xl">Thống Kê Hệ Thống</CardTitle>
                                </div>
                            </CardHeader>
                            <CardBody className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white rounded-xl p-4 border border-neutral-100">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <div className="w-6 h-6 bg-primary-100 rounded-lg flex items-center justify-center">
                                                <svg className="w-3 h-3 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7l2 2-2 2m2-2H9m10 7l2 2-2 2" />
                                                </svg>
                                            </div>
                                            <span className="text-sm text-neutral-600">Chuyên khoa</span>
                                        </div>
                                        <p className="text-2xl font-bold text-neutral-900">{stats?.totalSpecialties}</p>
                                    </div>

                                    <div className="bg-white rounded-xl p-4 border border-neutral-100">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <div className="w-6 h-6 bg-success-100 rounded-lg flex items-center justify-center">
                                                <svg className="w-3 h-3 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <span className="text-sm text-neutral-600">Lịch làm việc</span>
                                        </div>
                                        <p className="text-2xl font-bold text-neutral-900">{stats?.activeSchedules}</p>
                                    </div>
                                </div>

                                <div className="space-y-3 pt-2">
                                    <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-neutral-100">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 bg-accent-100 rounded-lg flex items-center justify-center">
                                                <svg className="w-4 h-4 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            </div>
                                            <span className="text-sm font-medium text-neutral-700">Bệnh nhân</span>
                                        </div>
                                        <span className="text-lg font-bold text-neutral-900">{stats?.totalPatients.toLocaleString()}</span>
                                    </div>

                                    <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-neutral-100">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 bg-success-100 rounded-lg flex items-center justify-center">
                                                <svg className="w-4 h-4 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <span className="text-sm font-medium text-neutral-700">Khám hoàn thành</span>
                                        </div>
                                        <span className="text-lg font-bold text-success-600">{stats?.completedAppointments.toLocaleString()}</span>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </div>

                    {/* Enhanced Recent Activities */}
                    <div className="lg:col-span-2">
                        <Card className="border-0 shadow-large bg-white">
                            <CardHeader className="border-b border-neutral-100 bg-gradient-to-r from-neutral-50 to-primary-50/20">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-primary-100 rounded-xl flex items-center justify-center">
                                            <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <CardTitle className="text-xl">Hoạt Động Gần Đây</CardTitle>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="flex bg-neutral-100 rounded-lg p-1">
                                            <button
                                                onClick={() => setSelectedTimeRange('today')}
                                                className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
                                                    selectedTimeRange === 'today'
                                                        ? 'bg-white text-primary-600 shadow-sm'
                                                        : 'text-neutral-600 hover:text-neutral-900'
                                                }`}
                                            >
                                                Hôm nay
                                            </button>
                                            <button
                                                onClick={() => setSelectedTimeRange('week')}
                                                className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
                                                    selectedTimeRange === 'week'
                                                        ? 'bg-white text-primary-600 shadow-sm'
                                                        : 'text-neutral-600 hover:text-neutral-900'
                                                }`}
                                            >
                                                Tuần
                                            </button>
                                            <button
                                                onClick={() => setSelectedTimeRange('month')}
                                                className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
                                                    selectedTimeRange === 'month'
                                                        ? 'bg-white text-primary-600 shadow-sm'
                                                        : 'text-neutral-600 hover:text-neutral-900'
                                                }`}
                                            >
                                                Tháng
                                            </button>
                                        </div>
                                        <Button variant="ghost" size="sm" className="text-primary-600 hover:text-primary-700">
                                            Xem tất cả
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardBody className="p-6">
                                {recentActivities.length > 0 ? (
                                    <div className="space-y-4">
                                        {recentActivities.map((activity, index) => (
                                            <div
                                                key={activity.id}
                                                className="group relative flex items-start space-x-4 p-4 rounded-2xl border border-neutral-100 hover:border-primary-200 hover:bg-primary-50/30 transition-all duration-300 cursor-pointer"
                                                style={{ animationDelay: `${index * 100}ms` }}
                                            >
                                                {/* Priority Indicator */}
                                                <div className={`absolute left-0 top-4 w-1 h-12 rounded-r-full ${
                                                    activity.priority === 'high' ? 'bg-red-500' :
                                                    activity.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                                                }`}></div>

                                                {/* Enhanced Activity Icon */}
                                                <div className="relative">
                                                    {getActivityIcon(activity.type)}
                                                    {activity.priority === 'high' && (
                                                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                                                    )}
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between mb-2">
                                                        <div>
                                                            <h4 className="text-base font-semibold text-neutral-900 group-hover:text-primary-700 transition-colors">
                                                                {activity.title}
                                                            </h4>
                                                            <p className="text-sm text-neutral-600 mt-1 leading-relaxed">
                                                                {activity.description}
                                                            </p>
                                                        </div>
                                                        <div className="flex flex-col items-end space-y-2">
                                                            {getStatusBadge(activity.status)}
                                                            {activity.priority && (
                                                                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                                    activity.priority === 'high' ? 'bg-red-100 text-red-700' :
                                                                    activity.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                                                    'bg-green-100 text-green-700'
                                                                }`}>
                                                                    {activity.priority === 'high' ? 'Cao' :
                                                                     activity.priority === 'medium' ? 'Trung bình' : 'Thấp'}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <p className="text-xs text-neutral-500 font-medium">
                                                            {activity.time}
                                                        </p>
                                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                            <svg className="w-4 h-4 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <div className="w-20 h-20 bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-medium">
                                            <svg className="w-10 h-10 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-semibold text-neutral-900 mb-2">Chưa có hoạt động nào</h3>
                                        <p className="text-neutral-600 mb-4">Các hoạt động gần đây sẽ được hiển thị tại đây</p>
                                        <Button variant="outline" size="sm" className="text-primary-600 border-primary-200 hover:bg-primary-50">
                                            Làm mới
                                        </Button>
                                    </div>
                                )}
                            </CardBody>
                        </Card>
                    </div>
                </div>

                {/* Additional Dashboard Widgets */}
                <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Performance Chart Placeholder */}
                    <Card className="border-0 shadow-large bg-gradient-to-br from-white to-accent-50/30">
                        <CardHeader>
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-accent-100 rounded-xl flex items-center justify-center">
                                    <svg className="w-4 h-4 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <CardTitle className="text-xl">Biểu Đồ Hiệu Suất</CardTitle>
                            </div>
                        </CardHeader>
                        <CardBody className="flex items-center justify-center h-64">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-accent-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-neutral-900 mb-2">Biểu đồ sẽ được cập nhật</h3>
                                <p className="text-neutral-600">Dữ liệu hiệu suất hệ thống theo thời gian</p>
                            </div>
                        </CardBody>
                    </Card>

                    {/* System Health Monitor */}
                    <Card className="border-0 shadow-large bg-gradient-to-br from-white to-success-50/30">
                        <CardHeader>
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-success-100 rounded-xl flex items-center justify-center">
                                    <svg className="w-4 h-4 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <CardTitle className="text-xl">Tình Trạng Hệ Thống</CardTitle>
                            </div>
                        </CardHeader>
                        <CardBody>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-neutral-100">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                        <span className="font-medium text-neutral-900">Database</span>
                                    </div>
                                    <span className="text-green-600 font-semibold">Hoạt động tốt</span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-neutral-100">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                        <span className="font-medium text-neutral-900">API Server</span>
                                    </div>
                                    <span className="text-green-600 font-semibold">Hoạt động tốt</span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-neutral-100">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                                        <span className="font-medium text-neutral-900">Email Service</span>
                                    </div>
                                    <span className="text-yellow-600 font-semibold">Chậm</span>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    );
}