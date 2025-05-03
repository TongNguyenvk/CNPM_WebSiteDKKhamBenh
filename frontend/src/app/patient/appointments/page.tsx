"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getPatientAppointments, cancelBooking } from "@/lib/api";

interface Appointment {
    id: number;
    date: string;
    timeType: string;
    statusId: string;
    patientId: number;
    doctorId: number;
    doctorData?: {
        firstName: string;
        lastName: string;
        email: string;
        image: string;
        specialtyData?: {
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
        valueEn?: string;
    };
}

export default function AppointmentsPage() {
    const router = useRouter();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const userStr = localStorage.getItem('user');
                if (!userStr) {
                    router.push('/auth/login');
                    return;
                }

                const user = JSON.parse(userStr);
                const patientId = user.userId;

                const data = await getPatientAppointments(patientId);
                setAppointments(data);
            } catch (err: any) {
                setError(err.message || "Có lỗi xảy ra khi tải danh sách lịch khám");
            } finally {
                setIsLoading(false);
            }
        };

        fetchAppointments();
    }, [router]);

    const handleCancelAppointment = async (appointmentId: number) => {
        if (!window.confirm("Bạn có chắc chắn muốn hủy lịch khám này?")) {
            return;
        }

        try {
            setError(null);
            setSuccess(null);
            await cancelBooking(appointmentId);
            setSuccess("Hủy lịch khám thành công!");

            // Cập nhật lại danh sách
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                const patientId = user.userId;
                const data = await getPatientAppointments(patientId);
                setAppointments(data);
            }
        } catch (err: any) {
            setError(err.message || "Có lỗi xảy ra khi hủy lịch khám");
        }
    };

    const getStatusColor = (statusId: string) => {
        switch (statusId) {
            case 'S1': // Chờ xác nhận
                return 'bg-yellow-100 text-yellow-800';
            case 'S2': // Đã xác nhận
                return 'bg-green-100 text-green-800';
            case 'S3': // Đã hủy
                return 'bg-red-100 text-red-800';
            case 'S4': // Đã hoàn thành
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Đang tải danh sách lịch khám...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-16 flex flex-col items-center">
            <div className="max-w-4xl w-full mx-auto p-4 md:p-6">
                <h1 className="text-2xl font-bold text-center text-blue-600 mb-8">Danh sách lịch khám</h1>
    
                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                        {error}
                    </div>
                )}
    
                {success && (
                    <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                        {success}
                    </div>
                )}
    
                {appointments.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500">Bạn chưa có lịch khám nào</p>
                        <button
                            onClick={() => router.push('/patient/specialties')}
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            Đặt lịch khám
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {appointments.map((appointment) => (
                            <div
                                key={appointment.id}
                                className="bg-white rounded-lg shadow-lg p-6"
                            >
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                    <div className="flex items-start space-x-4">
                                        <img
                                            src={appointment.doctorData?.image ? `http://localhost:8080/images/${appointment.doctorData.image}` : "/images/default-doctor.jpg"}
                                            alt={`${appointment.doctorData?.firstName} ${appointment.doctorData?.lastName}`}
                                            className="w-16 h-16 rounded-full object-cover"
                                        />
                                        <div>
                                            <h3 className="font-semibold text-lg">
                                                {appointment.doctorData?.firstName} {appointment.doctorData?.lastName}
                                            </h3>
                                            <p className="text-gray-600">
                                                {appointment.doctorData?.specialtyData?.name}
                                            </p>
                                            <div className="mt-2 space-y-1">
                                                <p>
                                                    <span className="font-medium">Ngày khám:</span>{' '}
                                                    {new Date(appointment.date).toLocaleDateString('vi-VN')}
                                                </p>
                                                <p>
                                                    <span className="font-medium">Giờ khám:</span>{' '}
                                                    {appointment.timeTypeData?.valueVi}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4 md:mt-0 flex flex-col items-end space-y-2">
                                        <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(appointment.statusId)}`}>
                                            {appointment.statusData?.valueVi}
                                        </span>
                                        {appointment.statusId === 'S1' && (
                                            <button
                                                onClick={() => handleCancelAppointment(appointment.id)}
                                                className="px-4 py-2 text-red-600 border border-red-600 rounded-md hover:bg-red-50"
                                            >
                                                Hủy lịch
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
} 