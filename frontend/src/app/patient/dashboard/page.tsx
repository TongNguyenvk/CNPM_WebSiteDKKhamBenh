'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { getPatientAppointments } from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';

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
    const router = useRouter();
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
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Đang tải...</p>
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
        <div className="min-h-screen bg-gray-50 pt-16 flex flex-col items-center">
            <div className="max-w-4xl w-full mx-auto p-4 md:p-6">
                <h1 className="text-2xl font-bold text-center text-blue-600 mb-8">Dashboard Bệnh Nhân</h1>

                {/* Các chức năng chính */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <Link href="/patient/specialties" className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                        <h2 className="text-lg font-semibold mb-2 text-gray-800">Chuyên Khoa</h2>
                        <p className="text-gray-600">Xem danh sách các chuyên khoa</p>
                    </Link>
                    <Link href="/patient/appointments" className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                        <h2 className="text-lg font-semibold mb-2 text-gray-800">Lịch Đã Đặt</h2>
                        <p className="text-gray-600">Xem danh sách các lịch đã đặt</p>
                    </Link>
                </div>

                {/* Lịch khám gần đây */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-lg font-semibold mb-4 text-gray-800">Lịch Khám Gần Đây</h2>
                    {appointments.length > 0 ? (
                        <div className="space-y-4">
                            {appointments.map((appointment) => (
                                <div key={appointment.id} className="border-b pb-4">
                                    <div className="flex items-center gap-4">
                                        {appointment.doctorData?.image && (
                                            <Image
                                                src={appointment.doctorData.image}
                                                alt={`${appointment.doctorData?.firstName} ${appointment.doctorData?.lastName}`}
                                                width={48}
                                                height={48}
                                                className="w-12 h-12 rounded-full object-cover"
                                            />
                                        )}
                                        <div>
                                            <p className="font-medium text-gray-800">
                                                Bác sĩ: {appointment.doctorData?.firstName} {appointment.doctorData?.lastName}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                Chuyên khoa: {appointment.doctorData?.Specialty?.name || 'Chưa có thông tin'}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                Ngày: {new Date(appointment.date).toLocaleDateString('vi-VN')}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                Giờ: {appointment.timeType}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                Trạng thái: {appointment.statusData?.valueVi || appointment.statusId}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-600">Chưa có lịch khám nào</p>
                    )}
                </div>
            </div>
        </div>
    );
} 