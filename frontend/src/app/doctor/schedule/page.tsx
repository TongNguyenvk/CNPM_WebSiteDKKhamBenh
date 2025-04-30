"use client";

import { useEffect, useState } from "react";
import { getDoctorSchedules, updateDoctorSchedule, deleteDoctorSchedule } from "@/lib/api";

interface Schedule {
    id: number;
    date: string;
    timeType: string;
    maxNumber: number;
    currentNumber?: number;
    timeTypeData?: {
        valueVi: string;
        valueEn?: string;
    };
}

export default function DoctorSchedulePage() {
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

    // Lấy danh sách ngày trong tuần
    const getWeekDates = () => {
        const dates = [];
        const today = new Date();
        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            dates.push(date.toISOString().split('T')[0]);
        }
        return dates;
    };

    useEffect(() => {
        const fetchSchedules = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const userStr = localStorage.getItem('user');
                if (!userStr) {
                    setError("Vui lòng đăng nhập để xem lịch phân công");
                    return;
                }

                const user = JSON.parse(userStr);
                if (user.role !== 'R2') {
                    setError("Bạn không có quyền truy cập trang này");
                    return;
                }

                const doctorId = user.userId;
                console.log('Fetching schedules for doctor:', doctorId, 'on date:', selectedDate);

                const data = await getDoctorSchedules(doctorId, selectedDate);
                console.log('Received schedules:', data);
                setSchedules(data);
            } catch (err: any) {
                console.error('Error in fetchSchedules:', err);
                setError(err.message || "Có lỗi xảy ra khi tải lịch phân công");
            } finally {
                setIsLoading(false);
            }
        };

        fetchSchedules();
    }, [selectedDate]);

    const handleUpdateSchedule = async (scheduleId: number, maxNumber: number) => {
        try {
            setError(null);
            setSuccess(null);

            if (maxNumber < 1) {
                setError("Số lượng bệnh nhân tối đa phải lớn hơn 0");
                return;
            }

            console.log('Updating schedule:', scheduleId, 'with maxNumber:', maxNumber);
            await updateDoctorSchedule(scheduleId, { maxNumber });
            setSuccess("Cập nhật lịch phân công thành công!");

            // Cập nhật lại danh sách
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                const doctorId = user.userId;
                const updatedSchedules = await getDoctorSchedules(doctorId, selectedDate);
                setSchedules(updatedSchedules);
            }
        } catch (err: any) {
            console.error('Error in handleUpdateSchedule:', err);
            setError(err.message || "Có lỗi xảy ra khi cập nhật lịch phân công");
        }
    };

    const handleDeleteSchedule = async (scheduleId: number) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa lịch phân công này?")) {
            return;
        }

        try {
            setError(null);
            setSuccess(null);

            console.log('Deleting schedule:', scheduleId);
            await deleteDoctorSchedule(scheduleId);
            setSuccess("Xóa lịch phân công thành công!");

            // Cập nhật lại danh sách
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                const doctorId = user.userId;
                const updatedSchedules = await getDoctorSchedules(doctorId, selectedDate);
                setSchedules(updatedSchedules);
            }
        } catch (err: any) {
            console.error('Error in handleDeleteSchedule:', err);
            setError(err.message || "Có lỗi xảy ra khi xóa lịch phân công");
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Đang tải lịch phân công...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-6">
            <h1 className="text-2xl font-bold mb-8">Lịch phân công</h1>

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

            {/* Chọn ngày */}
            <div className="mb-6">
                <label htmlFor="date-select" className="block text-sm font-medium text-gray-700 mb-2">
                    Chọn ngày:
                </label>
                <select
                    id="date-select"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full sm:w-auto border px-3 py-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                    {getWeekDates().map((date) => (
                        <option key={date} value={date}>
                            {new Date(date).toLocaleDateString("vi-VN", {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </option>
                    ))}
                </select>
            </div>

            {/* Danh sách lịch phân công */}
            <div className="space-y-4">
                {schedules.length === 0 ? (
                    <p className="text-center text-gray-500">Không có lịch phân công nào cho ngày này</p>
                ) : (
                    schedules.map((schedule) => (
                        <div
                            key={schedule.id}
                            className="bg-white rounded-lg shadow-md p-6"
                        >
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                <div>
                                    <h3 className="font-semibold text-lg">
                                        {schedule.timeTypeData?.valueVi}
                                    </h3>
                                    <p className="text-gray-600">
                                        Số lượng: {schedule.currentNumber || 0}/{schedule.maxNumber}
                                    </p>
                                </div>
                                <div className="mt-4 md:mt-0 flex space-x-4">
                                    <div className="flex items-center space-x-2">
                                        <label className="text-sm text-gray-600">Số lượng mới:</label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={schedule.maxNumber}
                                            onChange={(e) => handleUpdateSchedule(schedule.id, parseInt(e.target.value))}
                                            className="w-20 border px-2 py-1 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <button
                                        onClick={() => handleDeleteSchedule(schedule.id)}
                                        className="px-4 py-2 text-red-600 border border-red-600 rounded-md hover:bg-red-50"
                                    >
                                        Xóa
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
} 