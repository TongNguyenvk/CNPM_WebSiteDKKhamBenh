'use client';

import { useState, useEffect } from 'react';
import { getTodayAppointments, getDoctorSchedules, getDoctorAppointments } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { format, parseISO, isToday, isTomorrow } from 'date-fns';
import { vi } from 'date-fns/locale';

interface Appointment {
    id: number;
    date: string;
    timeType: string;
    statusId: string;
    patientData?: { firstName: string; lastName: string; email: string };
    statusData?: { valueVi: string };
    timeTypeData?: { valueVi: string };
}

interface Schedule {
    id: number;
    date: string;
    timeType: string;
    maxNumber: number;
    currentNumber: number;
    timeTypeData?: { valueVi: string };
}

const statusConfig: Record<string, { label: string; bg: string; color: string }> = {
    S1: { label: 'Chờ xác nhận', bg: 'bg-yellow-100', color: 'text-yellow-700' },
    S2: { label: 'Đã xác nhận', bg: 'bg-blue-100', color: 'text-blue-700' },
    S3: { label: 'Hoàn thành', bg: 'bg-green-100', color: 'text-green-700' },
    S4: { label: 'Đã hủy', bg: 'bg-red-100', color: 'text-red-700' },
};

export default function DoctorDashboard() {
    const { user } = useAuth();
    const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([]);
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [allAppointments, setAllAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        todayCount: 0, pendingCount: 0, completedCount: 0, totalPatients: 0
    });

    useEffect(() => {
        if (!user) return;
        const fetchData = async () => {
            try {
                setLoading(true);
                const [today, scheds, all] = await Promise.all([
                    getTodayAppointments(user.userId),
                    getDoctorSchedules(user.userId, format(new Date(), 'yyyy-MM-dd')),
                    getDoctorAppointments(user.userId),
                ]);
                setTodayAppointments(today);
                setSchedules(scheds);
                setAllAppointments(all);

                const uniquePatients = new Set(all.map((a: Appointment) => a.patientData?.email)).size;
                setStats({
                    todayCount: today.length,
                    pendingCount: all.filter((a: Appointment) => a.statusId === 'S1').length,
                    completedCount: all.filter((a: Appointment) => a.statusId === 'S3').length,
                    totalPatients: uniquePatients,
                });
            } catch (error) {
                console.error('Error:', error);
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
        return format(date, 'dd/MM', { locale: vi });
    };

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b bg-white flex-shrink-0">
                <h1 className="text-xl font-bold text-gray-900">Xin chào, Dr. {user?.firstName} {user?.lastName}</h1>
                <p className="text-sm text-gray-500">{format(new Date(), 'EEEE, dd/MM/yyyy', { locale: vi })}</p>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-6">
                {/* Stats */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-xl p-4 border">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stats.todayCount}</p>
                                <p className="text-sm text-gray-500">Lịch hôm nay</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 border">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stats.pendingCount}</p>
                                <p className="text-sm text-gray-500">Chờ xác nhận</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 border">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stats.completedCount}</p>
                                <p className="text-sm text-gray-500">Đã hoàn thành</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 border">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stats.totalPatients}</p>
                                <p className="text-sm text-gray-500">Tổng bệnh nhân</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                    {/* Today's Appointments */}
                    <div className="col-span-2 bg-white rounded-xl border">
                        <div className="flex items-center justify-between px-5 py-4 border-b">
                            <h2 className="font-semibold text-gray-900">Lịch khám hôm nay</h2>
                            <Link href="/doctor/appointments" className="text-sm text-blue-600 hover:text-blue-700 font-medium">Xem tất cả</Link>
                        </div>
                        <div className="p-5">
                            {todayAppointments.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <p>Không có lịch khám hôm nay</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {todayAppointments.slice(0, 5).map((apt) => (
                                        <div key={apt.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-medium">
                                                    {apt.patientData?.firstName?.charAt(0)}{apt.patientData?.lastName?.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{apt.patientData?.firstName} {apt.patientData?.lastName}</p>
                                                    <p className="text-sm text-gray-500">{apt.timeTypeData?.valueVi || apt.timeType}</p>
                                                </div>
                                            </div>
                                            <span className={`px-2.5 py-1 rounded-full text-sm font-medium ${statusConfig[apt.statusId]?.bg} ${statusConfig[apt.statusId]?.color}`}>
                                                {statusConfig[apt.statusId]?.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Upcoming Schedules */}
                    <div className="bg-white rounded-xl border">
                        <div className="flex items-center justify-between px-5 py-4 border-b">
                            <h2 className="font-semibold text-gray-900">Lịch làm việc</h2>
                            <Link href="/doctor/schedule" className="text-sm text-blue-600 hover:text-blue-700 font-medium">Xem tất cả</Link>
                        </div>
                        <div className="p-5">
                            {schedules.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <p>Chưa có lịch làm việc</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {schedules.slice(0, 5).map((sch) => (
                                        <div key={sch.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div>
                                                <p className="font-medium text-gray-900">{getDateLabel(sch.date)}</p>
                                                <p className="text-sm text-gray-500">{sch.timeTypeData?.valueVi || sch.timeType}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium text-gray-900">{sch.currentNumber}/{sch.maxNumber}</p>
                                                <div className="w-16 bg-gray-200 rounded-full h-1.5 mt-1">
                                                    <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${Math.min((sch.currentNumber / sch.maxNumber) * 100, 100)}%` }}></div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-6 bg-white rounded-xl border p-5">
                    <h2 className="font-semibold text-gray-900 mb-4">Thao tác nhanh</h2>
                    <div className="grid grid-cols-4 gap-4">
                        {[
                            { label: 'Xem lịch khám', href: '/doctor/appointments', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
                            { label: 'Đăng ký lịch', href: '/doctor/schedule', icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6' },
                            { label: 'Bệnh nhân', href: '/doctor/patients', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
                            { label: 'Hồ sơ cá nhân', href: '/doctor/profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
                        ].map((action, i) => (
                            <Link key={i} href={action.href} className="flex items-center gap-3 p-4 border rounded-xl hover:bg-gray-50 transition">
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={action.icon} />
                                </svg>
                                <span className="font-medium text-gray-700">{action.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
