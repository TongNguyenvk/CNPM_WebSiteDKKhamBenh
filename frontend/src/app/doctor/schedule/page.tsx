"use client";

import { useState, useEffect } from 'react';
import { getDoctorSchedules, updateDoctorSchedule, deleteDoctorSchedule, createSchedule } from '@/lib/api';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { toast } from 'react-hot-toast';

interface Schedule {
    id: number;
    date: string;
    doctorId: number;
    timeType: string;
    maxNumber: number;
    currentNumber?: number;
    timeTypeData?: {
        keyMap: string;
        valueVi: string;
        valueEn: string;
    };
}

const timeSlots = [
    { key: 'T1', label: '08:00 - 09:00' },
    { key: 'T2', label: '09:00 - 10:00' },
    { key: 'T3', label: '10:00 - 11:00' },
    { key: 'T4', label: '11:00 - 12:00' },
    { key: 'T5', label: '13:00 - 14:00' },
    { key: 'T6', label: '14:00 - 15:00' },
    { key: 'T7', label: '15:00 - 16:00' },
    { key: 'T8', label: '16:00 - 17:00' },
];

export default function SchedulePage() {
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState('');
    const [maxNumber, setMaxNumber] = useState(1);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            fetchSchedules(user.userId);
        }
    }, [selectedDate]);

    const fetchSchedules = async (doctorId: number) => {
        try {
            setLoading(true);
            const formattedDate = format(selectedDate, 'yyyy-MM-dd');
            const data = await getDoctorSchedules(doctorId, formattedDate);
            setSchedules(data);
        } catch (error) {
            console.error('Error fetching schedules:', error);
            toast.error('Không thể tải lịch phân công');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateSchedule = async () => {
        if (!selectedTime) {
            toast.error('Vui lòng chọn thời gian');
            return;
        }

        const userStr = localStorage.getItem('user');
        if (!userStr) {
            toast.error('Vui lòng đăng nhập để tạo lịch phân công');
            return;
        }

        try {
            const user = JSON.parse(userStr);
            const formattedDate = format(selectedDate, 'yyyy-MM-dd');
            await createSchedule({
                doctorId: user.userId,
                date: formattedDate,
                timeType: selectedTime,
                maxNumber
            });
            toast.success('Tạo lịch phân công thành công');
            fetchSchedules(user.userId);
            setSelectedTime('');
            setMaxNumber(1);
        } catch (error) {
            console.error('Error creating schedule:', error);
            toast.error('Không thể tạo lịch phân công');
        }
    };

    const getTimeLabel = (timeType: string) => {
        const timeSlot = timeSlots.find(slot => slot.key === timeType);
        return timeSlot ? timeSlot.label : timeType;
    };

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
                const updatedSchedules = await getDoctorSchedules(doctorId, format(selectedDate, 'yyyy-MM-dd'));
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
                const updatedSchedules = await getDoctorSchedules(doctorId, format(selectedDate, 'yyyy-MM-dd'));
                setSchedules(updatedSchedules);
            }
        } catch (err: any) {
            console.error('Error in handleDeleteSchedule:', err);
            setError(err.message || "Có lỗi xảy ra khi xóa lịch phân công");
        }
    };

    if (loading) {
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
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Quản lý lịch phân công</h1>

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

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Tạo lịch phân công mới</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Ngày
                        </label>
                        <input
                            type="date"
                            value={format(selectedDate, 'yyyy-MM-dd')}
                            onChange={(e) => setSelectedDate(new Date(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Thời gian
                        </label>
                        <select
                            value={selectedTime}
                            onChange={(e) => setSelectedTime(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Chọn thời gian</option>
                            {timeSlots.map((slot) => (
                                <option key={slot.key} value={slot.key}>
                                    {slot.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Số lượng bệnh nhân tối đa
                        </label>
                        <input
                            type="number"
                            min="1"
                            value={maxNumber}
                            onChange={(e) => setMaxNumber(parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
                <button
                    onClick={handleCreateSchedule}
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Tạo lịch phân công
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Lịch phân công</h2>
                {loading ? (
                    <div className="text-center py-4">Đang tải...</div>
                ) : schedules.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">
                        Không có lịch phân công nào cho ngày này
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Ngày
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Thời gian
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Số lượng tối đa
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Số lượng hiện tại
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {schedules.map((schedule) => (
                                    <tr key={schedule.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {format(new Date(schedule.date), 'dd/MM/yyyy', { locale: vi })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {schedule.timeTypeData?.valueVi || getTimeLabel(schedule.timeType)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {schedule.maxNumber}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {schedule.currentNumber || 0}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
} 