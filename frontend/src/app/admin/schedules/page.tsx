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

interface Doctor {
    id: number;
    userId: number;
    specialtyId: number;
    user: {
        firstName: string;
        lastName: string;
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

export default function AdminSchedulePage() {
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedDoctor, setSelectedDoctor] = useState<number | ''>('');
    const [selectedTime, setSelectedTime] = useState('');
    const [maxNumber, setMaxNumber] = useState(1);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        fetchDoctors();
    }, []);

    useEffect(() => {
        if (selectedDoctor) {
            fetchSchedules(selectedDoctor);
        }
    }, [selectedDate, selectedDoctor]);

    const fetchDoctors = async () => {
        try {
            const response = await fetch('/api/doctor');
            const data = await response.json();
            setDoctors(data);
        } catch (error) {
            console.error('Error fetching doctors:', error);
            toast.error('Không thể tải danh sách bác sĩ');
        }
    };

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
        if (!selectedDoctor || !selectedTime) {
            toast.error('Vui lòng chọn bác sĩ và thời gian');
            return;
        }

        try {
            const formattedDate = format(selectedDate, 'yyyy-MM-dd');
            await createSchedule({
                doctorId: selectedDoctor,
                date: formattedDate,
                timeType: selectedTime,
                maxNumber
            });
            toast.success('Tạo lịch phân công thành công');
            fetchSchedules(selectedDoctor);
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

            await updateDoctorSchedule(scheduleId, { maxNumber });
            setSuccess("Cập nhật lịch phân công thành công!");

            if (selectedDoctor) {
                fetchSchedules(selectedDoctor);
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

            await deleteDoctorSchedule(scheduleId);
            setSuccess("Xóa lịch phân công thành công!");

            if (selectedDoctor) {
                fetchSchedules(selectedDoctor);
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
            <h1 className="text-2xl font-bold mb-8 text-blue-600 text-center">Quản lý lịch phân công</h1>

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
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Bác sĩ
                        </label>
                        <select
                            value={selectedDoctor}
                            onChange={(e) => setSelectedDoctor(Number(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Chọn bác sĩ</option>
                            {doctors.map((doctor) => (
                                <option key={doctor.id} value={doctor.id}>
                                    {doctor.user.firstName} {doctor.user.lastName}
                                </option>
                            ))}
                        </select>
                    </div>
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
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Thao tác
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
                                            <input
                                                type="number"
                                                min="1"
                                                value={schedule.maxNumber}
                                                onChange={(e) => handleUpdateSchedule(schedule.id, parseInt(e.target.value))}
                                                className="w-20 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {schedule.currentNumber || 0}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <button
                                                onClick={() => handleDeleteSchedule(schedule.id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Xóa
                                            </button>
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