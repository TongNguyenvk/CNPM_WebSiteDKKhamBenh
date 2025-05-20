"use client";

import Image from 'next/image';
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createBooking, getDoctorById, getScheduleById } from "@/lib/api";

interface Schedule {
    id: number;
    date: string;
    doctorId: number;
    timeType: string;
    maxNumber: number;
    currentNumber?: number;
    timeTypeData?: {
        valueVi: string;
        valueEn?: string;
    };
}

interface Doctor {
    id: number;
    firstName: string;
    lastName: string;
    image?: string;
    Specialty?: {
        name: string;
    };
}

export default function BookAppointmentPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [doctor, setDoctor] = useState<Doctor | null>(null);
    const [schedule, setSchedule] = useState<Schedule | null>(null);

    const doctorId = searchParams.get('doctorId');
    const scheduleId = searchParams.get('scheduleId');
    const date = searchParams.get('date');
    const timeType = searchParams.get('timeType');

    useEffect(() => {
        const fetchData = async () => {
            if (!doctorId || !scheduleId) {
                setError("Thiếu thông tin cần thiết để đặt lịch");
                setIsLoading(false);
                return;
            }

            try {
                const [doctorData, scheduleData] = await Promise.all([
                    getDoctorById(Number(doctorId)),
                    getScheduleById(Number(scheduleId))
                ]);

                setDoctor(doctorData);
                setSchedule(scheduleData);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (err: any) {
                setError(err.message || "Có lỗi xảy ra khi tải thông tin");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [doctorId, scheduleId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!doctorId || !scheduleId || !date || !timeType) {
            setError("Thiếu thông tin cần thiết để đặt lịch");
            return;
        }

        try {
            // Lấy thông tin người dùng từ localStorage
            const userStr = localStorage.getItem('user');
            if (!userStr) {
                setError("Vui lòng đăng nhập để đặt lịch");
                router.push('/auth/login');
                return;
            }

            const user = JSON.parse(userStr);
            const patientId = user.userId;

            // Tạo booking mới
            const bookingData = {
                statusId: "S1", // Trạng thái mặc định: Chờ xác nhận
                doctorId: Number(doctorId),
                patientId: patientId,
                date: date,
                timeType: timeType
            };

            await createBooking(bookingData);
            setSuccess("Đặt lịch thành công!");

            // Chuyển hướng sau 2 giây
            setTimeout(() => {
                router.push('/patient/appointments');
            }, 2000);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setError(err.message || "Có lỗi xảy ra khi đặt lịch");
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Đang tải thông tin...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-4 md:p-6">
            <h1 className="text-2xl font-bold text-center mb-8">Đặt lịch khám bệnh</h1>

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

            {doctor && schedule && (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold mb-4">Thông tin bác sĩ</h2>
                        <div className="flex items-center space-x-4">
                            <Image
                            src={
                                doctor.image
                                ? `http://localhost:8080/images/${doctor.image}`
                                : '/images/default-doctor.jpg'
                            }
                            alt={`${doctor.firstName || ''} ${doctor.lastName || ''}`}
                            width={64}
                            height={64}
                            className="rounded-full object-cover"
                            unoptimized
                            />
                            <div>
                                <p className="font-medium">{doctor.firstName} {doctor.lastName}</p>
                                <p className="text-gray-600">{doctor.Specialty?.name}</p>
                            </div>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h2 className="text-xl font-semibold mb-4">Thông tin lịch khám</h2>
                        <div className="space-y-2">
                            <p><span className="font-medium">Ngày khám:</span> {new Date(date!).toLocaleDateString('vi-VN')}</p>
                            <p><span className="font-medium">Giờ khám:</span> {schedule.timeTypeData?.valueVi}</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex justify-end space-x-4">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                Xác nhận đặt lịch
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
} 