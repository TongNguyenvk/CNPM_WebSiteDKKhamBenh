"use client";

import { useState, useEffect } from 'react';
import { updateDoctorSchedule, deleteDoctorSchedule, createSchedule, getAllDoctors, getAllSchedules } from '@/lib/api';
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
        specialtyData?: {
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
    const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
    const [selectedDoctor, setSelectedDoctor] = useState<number | ''>('');
    const [formData, setFormData] = useState({
        doctorId: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        timeType: '',
        maxNumber: 1,
    });
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const doctorsData = await getAllDoctors();
                setDoctors(doctorsData);
                const allSchedulesData = await getAllSchedules();
                setSchedules(allSchedulesData);
                setLoading(false);
            } catch (error: unknown) {
                toast.error(error instanceof Error ? error.message : 'Lỗi khi tải dữ liệu ban đầu');
                setLoading(false);
            }
        };
        loadData();
    }, []);

    useEffect(() => {
        let currentFilteredSchedules = schedules;
        if (selectedDoctor) {
            currentFilteredSchedules = currentFilteredSchedules.filter(schedule => schedule.doctorId === Number(selectedDoctor));
        }
        if (selectedDate) {
            currentFilteredSchedules = currentFilteredSchedules.filter(schedule => format(new Date(schedule.date), 'yyyy-MM-dd') === selectedDate);
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
            } catch (error: unknown) {
                toast.error(error instanceof Error ? error.message : 'Lỗi khi tải lại danh sách lịch phân công');
            } finally {
                setLoading(false);
            }
            setIsCreateModalOpen(false);
            setFormData({
                doctorId: '',
                date: selectedDate,
                timeType: '',
                maxNumber: 1
            });
        } catch (error: unknown) {
            toast.error(error instanceof Error ? error.message : 'Lỗi khi tạo lịch phân công');
        }
    };

    const getTimeLabel = (timeType: string) => {
        const timeSlot = timeSlots.find(slot => slot.key === timeType);
        return timeSlot ? timeSlot.label : timeType;
    };

    const handleDeleteSchedule = async (scheduleId: number) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa lịch phân công này?')) {
            return;
        }
        try {
            await deleteDoctorSchedule(scheduleId);
            toast.success('Xóa lịch phân công thành công!');
            setLoading(true);
            try {
                const allSchedulesData = await getAllSchedules();
                setSchedules(allSchedulesData);
            } catch (error: unknown) {
                toast.error(error instanceof Error ? error.message : 'Lỗi khi tải lại danh sách lịch phân công');
            } finally {
                setLoading(false);
            }
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : 'Có lỗi xảy ra khi xóa lịch phân công');
        }
    };

    const handleEditSchedule = (schedule: Schedule) => {
        setSelectedSchedule(schedule);
        setFormData({
            doctorId: schedule.doctorId.toString(),
            date: format(new Date(schedule.date), 'yyyy-MM-dd'),
            timeType: schedule.timeType,
            maxNumber: schedule.maxNumber
        });
        setIsEditModalOpen(true);
    };

    const handleUpdateScheduleModal = async () => {
        if (!selectedSchedule) return;
        try {
            await updateDoctorSchedule(selectedSchedule.id, {
                date: formData.date,
                timeType: formData.timeType,
                maxNumber: Number(formData.maxNumber)
            });
            toast.success('Cập nhật lịch phân công thành công!');
            setIsEditModalOpen(false);
            setSelectedSchedule(null);
            setLoading(true);
            try {
                const allSchedulesData = await getAllSchedules();
                setSchedules(allSchedulesData);
            } catch (error: unknown) {
                toast.error(error instanceof Error ? error.message : 'Lỗi khi tải lại danh sách lịch phân công');
            } finally {
                setLoading(false);
            }
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : 'Có lỗi xảy ra khi cập nhật lịch phân công');
        }
    };

    useEffect(() => {
        if (isCreateModalOpen) {
            console.log('Render modal tạo lịch, isCreateModalOpen:', isCreateModalOpen);
        }
    }, [isCreateModalOpen]);

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
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                <div className="flex gap-4 items-center">
                    <label className="font-medium">Lọc theo ngày:</label>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={e => setSelectedDate(e.target.value)}
                        className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <label className="font-medium ml-4">Bác sĩ:</label>
                    <select
                        value={selectedDoctor}
                        onChange={e => {
                            const value = e.target.value;
                            setSelectedDoctor(value === '' ? '' : Number(value));
                        }}
                        className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Tất cả</option>
                        {doctors.map((doctor) => (
                            <option key={doctor.id} value={doctor.id}>
                                {doctor.firstName} {doctor.lastName}
                            </option>
                        ))}
                    </select>
                </div>
                <button
                    onClick={() => {
                        console.log('Bấm nút Thêm phân công');
                        setFormData({
                            doctorId: '',
                            date: selectedDate,
                            timeType: '',
                            maxNumber: 1
                        });
                        setIsCreateModalOpen(true);
                        setTimeout(() => {
                            console.log('isCreateModalOpen:', true);
                        }, 100);
                    }}
                    className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-2 rounded-lg shadow-lg hover:from-blue-700 hover:to-blue-600 font-semibold text-lg"
                >
                    + Thêm phân công
                </button>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Danh sách lịch phân công</h2>
                {filteredSchedules.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">
                        Không có lịch phân công nào cho ngày này
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bác sĩ</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chuyên khoa</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thời gian</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số lượng tối đa</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số lượng đã đặt</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredSchedules.map((schedule) => (
                                    <tr key={schedule.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{format(new Date(schedule.date), 'dd/MM/yyyy', { locale: vi })}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{schedule.doctorData ? `${schedule.doctorData.firstName} ${schedule.doctorData.lastName}` : 'N/A'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{schedule.doctorData?.specialtyData?.name || 'N/A'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getTimeLabel(schedule.timeType)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{schedule.maxNumber}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{schedule.currentNumber || 0}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEditSchedule(schedule)}
                                                    className="text-blue-600 hover:text-blue-900 font-semibold"
                                                >
                                                    Sửa
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteSchedule(schedule.id)}
                                                    className="text-red-600 hover:text-red-900 font-semibold"
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
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 w-full max-w-lg shadow-2xl">
                        <h2 className="text-xl font-bold mb-4 text-blue-700">Tạo lịch phân công mới</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Bác sĩ</label>
                                <select
                                    value={formData.doctorId}
                                    onChange={e => setFormData({ ...formData, doctorId: e.target.value })}
                                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Chọn bác sĩ</option>
                                    {doctors.map((doctor) => (
                                        <option key={doctor.id} value={doctor.id}>{doctor.firstName} {doctor.lastName}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Ngày</label>
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Thời gian</label>
                                <select
                                    value={formData.timeType}
                                    onChange={e => setFormData({ ...formData, timeType: e.target.value })}
                                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Chọn thời gian</option>
                                    {timeSlots.map((slot) => (
                                        <option key={slot.key} value={slot.key}>{slot.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Số lượng bệnh nhân tối đa</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={formData.maxNumber}
                                    onChange={e => {
                                        const value = parseInt(e.target.value);
                                        setFormData({ ...formData, maxNumber: isNaN(value) ? 1 : value });
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-6">
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
            {/* Edit Schedule Modal */}
            {isEditModalOpen && selectedSchedule && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 w-full max-w-lg shadow-2xl">
                        <h2 className="text-xl font-bold mb-4 text-blue-700">Cập nhật lịch phân công</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Bác sĩ</label>
                                <select
                                    value={formData.doctorId}
                                    onChange={e => setFormData({ ...formData, doctorId: e.target.value })}
                                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Chọn bác sĩ</option>
                                    {doctors.map((doctor) => (
                                        <option key={doctor.id} value={doctor.id}>{doctor.firstName} {doctor.lastName}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Ngày</label>
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Thời gian</label>
                                <select
                                    value={formData.timeType}
                                    onChange={e => setFormData({ ...formData, timeType: e.target.value })}
                                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Chọn thời gian</option>
                                    {timeSlots.map((slot) => (
                                        <option key={slot.key} value={slot.key}>{slot.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Số lượng bệnh nhân tối đa</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={formData.maxNumber}
                                    onChange={e => {
                                        const value = parseInt(e.target.value);
                                        setFormData({ ...formData, maxNumber: isNaN(value) ? 1 : value });
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-6">
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="px-4 py-2 border rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleUpdateScheduleModal}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Cập nhật
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
} 