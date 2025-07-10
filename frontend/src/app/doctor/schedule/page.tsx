"use client";

import { useState, useEffect } from 'react';
import { getDoctorSchedules } from '@/lib/api';
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

    const getTimeLabel = (timeType: string) => {
        const timeSlot = timeSlots.find(slot => slot.key === timeType);
        return timeSlot ? timeSlot.label : timeType;
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
        <div className="container mx-auto px-4 py-4">
            <h1 className="text-3xl font-bold mb-8 text-blue-600">Lịch phân công</h1>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Chọn ngày
                    </label>
                    <input
                        type="date"
                        value={format(selectedDate, 'yyyy-MM-dd')}
                        onChange={(e) => setSelectedDate(new Date(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Danh sách lịch phân công</h2>
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
                                        Số lượng bệnh nhân tối đa
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Số lượng đã đặt
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {schedules.map((schedule) => (
                                    <tr key={schedule.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {format(new Date(schedule.date), 'dd/MM/yyyy', { locale: vi })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {getTimeLabel(schedule.timeType)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {schedule.maxNumber}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
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