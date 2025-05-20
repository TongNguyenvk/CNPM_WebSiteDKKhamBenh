"use client";

import { useState, useEffect } from 'react';
import { getDoctorSchedules, updateDoctorSchedule, deleteDoctorSchedule, createSchedule, getAllDoctors, getAllSchedules } from '@/lib/api';
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
    doctorData?: {
        id: number;
        firstName: string;
        lastName: string;
        Specialty?: {
            id: number;
            name: string;
        };
        email?: string;
        image?: string;
    };
}

interface Doctor {
    id: number;
    email?: string;
    firstName: string;
    lastName: string;
    specialtyId?: number;
    positionId?: string;
    phoneNumber?: string;
    address?: string;
    gender?: boolean;
    image?: string;
    Specialty?: {
        id: number;
        name: string;
    };
    positionData?: {
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

export default function AdminSchedulePage() {
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [filteredSchedules, setFilteredSchedules] = useState<Schedule[]>([]);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedDoctor, setSelectedDoctor] = useState<number | ''>('');
    const [selectedTime, setSelectedTime] = useState('');
    const [maxNumber, setMaxNumber] = useState(1);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        doctorId: '',
        date: '',
        timeType: '',
        maxNumber: 1,
    });
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const doctorsData = await getAllDoctors();
                setDoctors(doctorsData);

                const allSchedulesData = await getAllSchedules();
                setSchedules(allSchedulesData);

                setLoading(false);

            } catch (error: any) {
                console.error('Error loading initial data:', error);
                toast.error(error.message || 'Lỗi khi tải dữ liệu ban đầu');
                setLoading(false);
            }
        };

        loadData();
    }, []);

    useEffect(() => {
        let currentFilteredSchedules = schedules;

        if (selectedDoctor) {
            currentFilteredSchedules = schedules.filter(schedule => schedule.doctorId === Number(selectedDoctor));
        }

        setFilteredSchedules(currentFilteredSchedules);
    }, [schedules, selectedDoctor, selectedDate]);

    const handleCreateSchedule = async () => {
        if (!formData.doctorId || !formData.timeType || !formData.date) {
            toast.error('Vui lòng chọn bác sĩ, ngày và thời gian');
            return;
        }

        try {
            await createSchedule({
                doctorId: Number(formData.doctorId),
                date: formData.date,
                timeType: formData.timeType,
                maxNumber: Number(formData.maxNumber)
            });
            toast.success('Tạo lịch phân công thành công');
            setLoading(true);
            try {
                const allSchedulesData = await getAllSchedules();
                setSchedules(allSchedulesData);
            } catch (error: any) {
                console.error('Error re-fetching schedules after creation:', error);
                toast.error('Lỗi khi tải lại danh sách lịch phân công');
            } finally {
                setLoading(false);
            }

            setIsCreateModalOpen(false);
            setFormData({
                doctorId: '',
                date: '',
                timeType: '',
                maxNumber: 1
            });

        } catch (error: any) {
            console.error('Error creating schedule:', error);
            toast.error(error.message || 'Lỗi khi tạo lịch phân công');
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

            setLoading(true);
            try {
                const allSchedulesData = await getAllSchedules();
                setSchedules(allSchedulesData);
            } catch (error: any) {
                console.error('Error re-fetching schedules after update:', error);
                toast.error('Lỗi khi tải lại danh sách lịch phân công');
            } finally {
                setLoading(false);
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

            await deleteDoctorSchedule(scheduleId);
            setSuccess("Xóa lịch phân công thành công!");

            setLoading(true);
            try {
                const allSchedulesData = await getAllSchedules();
                setSchedules(allSchedulesData);
            } catch (error: any) {
                console.error('Error re-fetching schedules after deletion:', error);
                toast.error('Lỗi khi tải lại danh sách lịch phân công');
            } finally {
                setLoading(false);
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
                            value={formData.doctorId}
                            onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Chọn bác sĩ</option>
                            {doctors.map((doctor) => (
                                <option key={doctor.id} value={doctor.id}>
                                    {doctor.firstName} {doctor.lastName}
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
                            value={formData.timeType}
                            onChange={(e) => setFormData({ ...formData, timeType: e.target.value })}
                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                            value={formData.maxNumber}
                            onChange={(e) => {
                                const value = parseInt(e.target.value);
                                if (!isNaN(value)) {
                                    setFormData({ ...formData, maxNumber: value });
                                } else if (e.target.value === '') {
                                    setFormData({ ...formData, maxNumber: 1 });
                                }
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
                <button
                    onClick={() => {
                        setFormData({
                            doctorId: doctors.length > 0 ? doctors[0].id.toString() : '',
                            date: format(selectedDate, 'yyyy-MM-dd'),
                            timeType: timeSlots.length > 0 ? timeSlots[0].key : '',
                            maxNumber: 1
                        });
                        setIsCreateModalOpen(true);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Tạo lịch phân công
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Danh sách lịch phân công</h2>
                {loading ? (
                    <div className="text-center py-4">Đang tải...</div>
                ) : filteredSchedules.length === 0 ? (
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
                                        Bác sĩ
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Chuyên khoa
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Thời gian
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Số lượng tối đa
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
                                {filteredSchedules.map((schedule) => (
                                    <tr key={schedule.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {format(new Date(schedule.date), 'dd/MM/yyyy', { locale: vi })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {schedule.doctorData ? `${schedule.doctorData.firstName} ${schedule.doctorData.lastName}` : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {schedule.doctorData?.Specialty?.name || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {getTimeLabel(schedule.timeType)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <input
                                                type="number"
                                                min="1"
                                                value={schedule.maxNumber}
                                                onChange={(e) => {
                                                    const value = parseInt(e.target.value);
                                                    if (!isNaN(value) && value >= 1) {
                                                        setSchedules(prevSchedules =>
                                                            prevSchedules.map(s => s.id === schedule.id ? { ...s, maxNumber: value } : s)
                                                        );
                                                        handleUpdateSchedule(schedule.id, value);
                                                    } else if (e.target.value === '') {
                                                        setSchedules(prevSchedules =>
                                                            prevSchedules.map(s => s.id === schedule.id ? { ...s, maxNumber: 1 } : s)
                                                        );
                                                        handleUpdateSchedule(schedule.id, 1);
                                                    }
                                                }}
                                                className="w-20 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {schedule.currentNumber || 0}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleDeleteSchedule(schedule.id)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Xóa
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Create Schedule Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-8">
                        <h2 className="text-xl font-semibold mb-4">Tạo lịch phân công mới</h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Bác sĩ
                                </label>
                                <select
                                    value={formData.doctorId}
                                    onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
                                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Chọn bác sĩ</option>
                                    {doctors.map((doctor) => (
                                        <option key={doctor.id} value={doctor.id}>
                                            {doctor.firstName} {doctor.lastName}
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
                                    value={formData.timeType}
                                    onChange={(e) => setFormData({ ...formData, timeType: e.target.value })}
                                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                    value={formData.maxNumber}
                                    onChange={(e) => {
                                        const value = parseInt(e.target.value);
                                        if (!isNaN(value)) {
                                            setFormData({ ...formData, maxNumber: value });
                                        } else if (e.target.value === '') {
                                            setFormData({ ...formData, maxNumber: 1 });
                                        }
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                onClick={() => setIsCreateModalOpen(false)}
                                className="px-4 py-2 border rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleCreateSchedule}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Tạo
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
} 