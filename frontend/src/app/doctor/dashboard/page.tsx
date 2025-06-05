'use client';
import React, { useEffect, useState } from 'react';
import { getTodayAppointments, getDoctorSchedules, getDoctorAppointments } from '../../../lib/api';
import { useAuth } from '../../../hooks/useAuth';

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
            } catch (error: unknown) {
                const err = error as Error;
                setError(err.message || 'Lỗi khi tải lịch hẹn');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="text-red-600 text-xl mb-4">⚠️</div>
                    <p className="text-red-600">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center">
            <div className="max-w-4xl w-full mx-auto p-4 md:p-6">
                <h1 className="text-2xl font-bold text-center text-blue-600 mb-8">Dashboard Bác Sĩ</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Lịch Khám Hôm Nay */}
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-lg font-semibold mb-4 text-gray-800">Lịch Khám Hôm Nay</h2>
                        {todayAppointments.length > 0 ? (
                            <div className="space-y-4">
                                {todayAppointments.map((appointment) => (
                                    <div key={appointment.id} className="border-b pb-2">
                                        <p className="font-medium text-gray-800">
                                            {appointment.patientData?.firstName} {appointment.patientData?.lastName}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Thời gian: {appointment.timeType}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Trạng thái: {appointment.statusData?.valueVi || appointment.statusId}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-600">Chưa có lịch khám</p>
                        )}
                    </div>

                    {/* Lịch Phân Công */}
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-lg font-semibold mb-4 text-gray-800">Lịch Phân Công</h2>
                        {schedules.length > 0 ? (
                            <div className="space-y-4">
                                {schedules.map((schedule) => (
                                    <div key={schedule.id} className="border-b pb-2">
                                        <p className="font-medium text-gray-800">Ngày: {schedule.date}</p>
                                        <p className="text-sm text-gray-600">
                                            Khung giờ: {schedule.timeTypeData?.valueVi || schedule.timeType}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Số lượng: {schedule.currentNumber}/{schedule.maxNumber}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-600">Chưa có lịch phân công</p>
                        )}
                    </div>

                    {/* Thống Kê */}
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-lg font-semibold mb-4 text-gray-800">Thống Kê</h2>
                        <div className="space-y-4">
                            <div>
                                <p className="font-medium text-gray-700">Tổng số lịch khám</p>
                                <p className="text-2xl font-bold text-blue-600">{allAppointments.length}</p>
                            </div>
                            <div>
                                <p className="font-medium text-gray-700">Lịch khám hôm nay</p>
                                <p className="text-2xl font-bold text-green-600">{todayAppointments.length}</p>
                            </div>
                            <div>
                                <p className="font-medium text-gray-700">Lịch phân công</p>
                                <p className="text-2xl font-bold text-purple-600">{schedules.length}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 