'use client';

import { useState, useEffect } from 'react';
import { getAllDoctors, getAllSchedules, createDoctorSchedule, updateDoctorSchedule, deleteDoctorSchedule, getTimeStates } from '@/lib/api';
import { toast } from 'react-hot-toast';

interface Doctor {
    id: number;
    firstName: string;
    lastName: string;
    Specialty?: {
        name: string;
    };
}

interface TimeState {
    keyMap: string;
    type: string;
    valueVi: string;
    valueEn: string;
}

interface Schedule {
    id: number;
    doctorId: number;
    date: string;
    timeType: string;
    maxNumber: number;
    currentNumber?: number;
    timeTypeData?: TimeState;
    doctorData?: Doctor;
}

export default function AppointmentsPage() {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [timeStates, setTimeStates] = useState<TimeState[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDoctor, setSelectedDoctor] = useState<string>('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
    const [formData, setFormData] = useState({
        doctorId: '',
        date: '',
        timeType: '',
        maxNumber: 20
    });

    useEffect(() => {
        loadDoctors();
        loadSchedules();
        loadTimeStates();
    }, []);

    const loadTimeStates = async () => {
        try {
            const data = await getTimeStates();
            setTimeStates(data);
            if (data.length > 0) {
                setFormData(prev => ({ ...prev, timeType: data[0].keyMap }));
            }
        } catch (error) {
            toast.error('Lỗi khi tải danh sách thời gian');
        }
    };

    const loadDoctors = async () => {
        try {
            const data = await getAllDoctors();
            setDoctors(data);
        } catch (error) {
            toast.error('Lỗi khi tải danh sách bác sĩ');
        }
    };

    const loadSchedules = async () => {
        try {
            const data = await getAllSchedules();
            setSchedules(data);
        } catch (error) {
            toast.error('Lỗi khi tải danh sách lịch khám');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateSchedule = async () => {
        try {
            await createDoctorSchedule({
                ...formData,
                doctorId: Number(formData.doctorId)
            });
            toast.success('Tạo lịch khám thành công');
            setIsCreateModalOpen(false);
            loadSchedules();
        } catch (error) {
            toast.error('Lỗi khi tạo lịch khám');
        }
    };

    const handleUpdateSchedule = async () => {
        if (!selectedSchedule) return;
        try {
            await updateDoctorSchedule(selectedSchedule.id, {
                date: formData.date,
                timeType: formData.timeType,
                maxNumber: Number(formData.maxNumber)
            });
            toast.success('Cập nhật lịch khám thành công');
            setIsEditModalOpen(false);
            loadSchedules();
        } catch (error) {
            toast.error('Lỗi khi cập nhật lịch khám');
        }
    };

    const handleDeleteSchedule = async (scheduleId: number) => {
        if (!confirm('Bạn có chắc chắn muốn xóa lịch khám này?')) return;
        try {
            await deleteDoctorSchedule(scheduleId);
            toast.success('Xóa lịch khám thành công');
            loadSchedules();
        } catch (error) {
            toast.error('Lỗi khi xóa lịch khám');
        }
    };

    const filteredSchedules = schedules.filter(schedule =>
        !selectedDoctor || schedule.doctorId.toString() === selectedDoctor
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Quản lý lịch khám</h1>
                    <div className="flex gap-4">
                        <select
                            value={selectedDoctor}
                            onChange={(e) => setSelectedDoctor(e.target.value)}
                            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Tất cả bác sĩ</option>
                            {doctors.map((doctor) => (
                                <option key={doctor.id} value={doctor.id}>
                                    {doctor.firstName} {doctor.lastName} - {doctor.Specialty?.name}
                                </option>
                            ))}
                        </select>
                        <button
                            onClick={() => {
                                setFormData({
                                    doctorId: '',
                                    date: '',
                                    timeType: '',
                                    maxNumber: 20
                                });
                                setIsCreateModalOpen(true);
                            }}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Thêm lịch khám
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bác sĩ</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chuyên khoa</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thời gian</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số lượng tối đa</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số lượng hiện tại</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredSchedules.map((schedule) => (
                                <tr key={schedule.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{schedule.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {schedule.doctorData ? `${schedule.doctorData.firstName} ${schedule.doctorData.lastName}` : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {schedule.doctorData?.Specialty?.name || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {new Date(schedule.date).toLocaleDateString('vi-VN')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {schedule.timeTypeData?.valueVi || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {schedule.maxNumber}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {schedule.currentNumber || 0}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => {
                                                    setSelectedSchedule(schedule);
                                                    setFormData({
                                                        doctorId: schedule.doctorId.toString(),
                                                        date: schedule.date,
                                                        timeType: schedule.timeType,
                                                        maxNumber: schedule.maxNumber
                                                    });
                                                    setIsEditModalOpen(true);
                                                }}
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                Sửa
                                            </button>
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

                {filteredSchedules.length === 0 && (
                    <div className="text-center py-8">
                        <p className="text-gray-500">Không có lịch khám nào</p>
                    </div>
                )}
            </div>

            {/* Create Schedule Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h2 className="text-xl font-bold mb-4">Thêm lịch khám mới</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block mb-1">Bác sĩ</label>
                                <select
                                    value={formData.doctorId}
                                    onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
                                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Chọn bác sĩ</option>
                                    {doctors.map((doctor) => (
                                        <option key={doctor.id} value={doctor.id}>
                                            {doctor.firstName} {doctor.lastName} - {doctor.Specialty?.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block mb-1">Ngày</label>
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block mb-1">Thời gian</label>
                                <select
                                    value={formData.timeType}
                                    onChange={(e) => setFormData({ ...formData, timeType: e.target.value })}
                                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {timeStates.map((time) => (
                                        <option key={time.keyMap} value={time.keyMap}>
                                            {time.valueVi}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block mb-1">Số lượng tối đa</label>
                                <input
                                    type="number"
                                    value={formData.maxNumber}
                                    onChange={(e) => setFormData({ ...formData, maxNumber: parseInt(e.target.value) })}
                                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    min="1"
                                />
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
                </div>
            )}

            {/* Edit Schedule Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h2 className="text-xl font-bold mb-4">Cập nhật lịch khám</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block mb-1">Ngày</label>
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block mb-1">Thời gian</label>
                                <select
                                    value={formData.timeType}
                                    onChange={(e) => setFormData({ ...formData, timeType: e.target.value })}
                                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {timeStates.map((time) => (
                                        <option key={time.keyMap} value={time.keyMap}>
                                            {time.valueVi}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block mb-1">Số lượng tối đa</label>
                                <input
                                    type="number"
                                    value={formData.maxNumber}
                                    onChange={(e) => setFormData({ ...formData, maxNumber: parseInt(e.target.value) })}
                                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    min="1"
                                />
                            </div>
                            <div className="flex justify-end gap-2 mt-4">
                                <button
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="px-4 py-2 border rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={handleUpdateSchedule}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    Cập nhật
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
} 