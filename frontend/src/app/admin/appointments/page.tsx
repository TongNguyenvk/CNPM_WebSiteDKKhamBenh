'use client';

import { useState, useEffect, useMemo } from 'react';
import { getAllSchedules, getAllDoctors, getTimeStates, createDoctorSchedule, updateDoctorSchedule, deleteDoctorSchedule } from '@/lib/api';
import { SlidePanel, DataTable } from '@/components/ui';
import { format, parseISO, isPast } from 'date-fns';
import { vi } from 'date-fns/locale';
import { toast } from 'react-hot-toast';

interface Doctor {
    id: number;
    firstName: string;
    lastName: string;
    Specialty?: { name: string };
}

interface TimeState {
    keyMap: string;
    valueVi: string;
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
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [timeStates, setTimeStates] = useState<TimeState[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterDoctor, setFilterDoctor] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
    const [formData, setFormData] = useState({ doctorId: '', date: '', timeType: '', maxNumber: 10 });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [schedulesData, doctorsData, timeData] = await Promise.all([
                getAllSchedules(),
                getAllDoctors(),
                getTimeStates()
            ]);
            setSchedules(schedulesData);
            setDoctors(doctorsData);
            setTimeStates(timeData);
        } catch (error) {
            toast.error('Lỗi khi tải dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    const filteredSchedules = useMemo(() => {
        return schedules.filter(s => {
            if (filterDoctor && s.doctorId !== Number(filterDoctor)) return false;
            if (filterDate && format(new Date(s.date), 'yyyy-MM-dd') !== filterDate) return false;
            if (filterStatus) {
                const date = parseISO(s.date);
                const current = s.currentNumber || 0;
                if (filterStatus === 'available' && (isPast(date) || current >= s.maxNumber)) return false;
                if (filterStatus === 'full' && (isPast(date) || current < s.maxNumber)) return false;
                if (filterStatus === 'past' && !isPast(date)) return false;
            }
            return true;
        });
    }, [schedules, filterDoctor, filterDate, filterStatus]);

    const hasFilters = filterDoctor || filterDate || filterStatus;

    const getStatusBadge = (schedule: Schedule) => {
        const date = parseISO(schedule.date);
        const current = schedule.currentNumber || 0;
        if (isPast(date)) return { text: 'Đã qua', bg: 'bg-gray-100', color: 'text-gray-600' };
        if (current >= schedule.maxNumber) return { text: 'Đã đầy', bg: 'bg-red-100', color: 'text-red-700' };
        if (current > schedule.maxNumber * 0.8) return { text: 'Sắp đầy', bg: 'bg-yellow-100', color: 'text-yellow-700' };
        return { text: 'Còn chỗ', bg: 'bg-green-100', color: 'text-green-700' };
    };

    const openCreatePanel = () => {
        setEditingSchedule(null);
        setFormData({ doctorId: '', date: format(new Date(), 'yyyy-MM-dd'), timeType: timeStates[0]?.keyMap || '', maxNumber: 10 });
        setIsPanelOpen(true);
    };

    const openEditPanel = (schedule: Schedule) => {
        setEditingSchedule(schedule);
        setFormData({
            doctorId: schedule.doctorId.toString(),
            date: format(new Date(schedule.date), 'yyyy-MM-dd'),
            timeType: schedule.timeType,
            maxNumber: schedule.maxNumber
        });
        setIsPanelOpen(true);
    };

    const handleSave = async () => {
        if (!formData.doctorId || !formData.date || !formData.timeType) {
            toast.error('Vui lòng điền đầy đủ thông tin');
            return;
        }
        setSubmitting(true);
        try {
            if (editingSchedule) {
                await updateDoctorSchedule(editingSchedule.id, {
                    date: formData.date,
                    timeType: formData.timeType,
                    maxNumber: formData.maxNumber
                });
                toast.success('Cập nhật thành công');
            } else {
                await createDoctorSchedule({ ...formData, doctorId: Number(formData.doctorId) });
                toast.success('Tạo lịch khám thành công');
            }
            loadData();
            setIsPanelOpen(false);
        } catch (error) {
            toast.error('Có lỗi xảy ra');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm('Xác nhận xóa lịch khám này?')) return;
        try {
            await deleteDoctorSchedule(id);
            toast.success('Đã xóa');
            loadData();
        } catch (error) {
            toast.error('Lỗi khi xóa');
        }
    };

    const clearFilters = () => {
        setFilterDoctor('');
        setFilterDate('');
        setFilterStatus('');
    };

    const columns = useMemo(() => [
        {
            key: 'date', header: 'Ngày', width: 'w-28',
            render: (s: Schedule) => (
                <div>
                    <div className="font-medium">{format(parseISO(s.date), 'dd/MM/yyyy')}</div>
                    <div className="text-xs text-gray-500">{format(parseISO(s.date), 'EEEE', { locale: vi })}</div>
                </div>
            )
        },
        {
            key: 'doctor', header: 'Bác sĩ',
            render: (s: Schedule) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs font-medium">
                        {s.doctorData?.firstName?.charAt(0)}{s.doctorData?.lastName?.charAt(0)}
                    </div>
                    <div>
                        <div className="font-medium text-gray-900">{s.doctorData?.firstName} {s.doctorData?.lastName}</div>
                        <div className="text-xs text-gray-500">{s.doctorData?.Specialty?.name || '-'}</div>
                    </div>
                </div>
            )
        },
        {
            key: 'timeType', header: 'Khung giờ',
            render: (s: Schedule) => (
                <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                    {s.timeTypeData?.valueVi || s.timeType}
                </span>
            )
        },
        {
            key: 'capacity', header: 'Đặt chỗ', width: 'w-28',
            render: (s: Schedule) => {
                const current = s.currentNumber || 0;
                const percent = (current / s.maxNumber) * 100;
                return (
                    <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full ${percent >= 100 ? 'bg-red-500' : percent >= 80 ? 'bg-yellow-500' : 'bg-green-500'}`}
                                style={{ width: `${Math.min(percent, 100)}%` }}
                            />
                        </div>
                        <span className="text-xs text-gray-600 w-12">{current}/{s.maxNumber}</span>
                    </div>
                );
            }
        },
        {
            key: 'status', header: 'Trạng thái', width: 'w-24',
            render: (s: Schedule) => {
                const status = getStatusBadge(s);
                return (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                        {status.text}
                    </span>
                );
            }
        },
        {
            key: 'actions', header: '', width: 'w-20',
            render: (s: Schedule) => (
                <div className="flex justify-end gap-1">
                    <button onClick={() => openEditPanel(s)} className="p-1.5 hover:bg-gray-100 rounded-lg" title="Sửa">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </button>
                    <button onClick={(e) => handleDelete(s.id, e)} className="p-1.5 hover:bg-red-50 rounded-lg" title="Xóa">
                        <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            )
        },
    ], []);

    // Stats
    const stats = useMemo(() => {
        const upcoming = schedules.filter(s => !isPast(parseISO(s.date))).length;
        const full = schedules.filter(s => (s.currentNumber || 0) >= s.maxNumber).length;
        const available = schedules.filter(s => !isPast(parseISO(s.date)) && (s.currentNumber || 0) < s.maxNumber).length;
        return { total: schedules.length, upcoming, full, available };
    }, [schedules]);

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b bg-white flex-shrink-0">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Quản lý lịch khám</h1>
                    <p className="text-sm text-gray-500">{filteredSchedules.length} lịch khám</p>
                </div>
                <button onClick={openCreatePanel} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Thêm lịch khám
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 px-6 py-4 bg-gray-50 border-b flex-shrink-0">
                <div className="bg-white rounded-lg p-3 border">
                    <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                    <div className="text-xs text-gray-500">Tổng lịch</div>
                </div>
                <div className="bg-white rounded-lg p-3 border">
                    <div className="text-2xl font-bold text-blue-600">{stats.upcoming}</div>
                    <div className="text-xs text-gray-500">Sắp tới</div>
                </div>
                <div className="bg-white rounded-lg p-3 border">
                    <div className="text-2xl font-bold text-green-600">{stats.available}</div>
                    <div className="text-xs text-gray-500">Còn chỗ</div>
                </div>
                <div className="bg-white rounded-lg p-3 border">
                    <div className="text-2xl font-bold text-red-600">{stats.full}</div>
                    <div className="text-xs text-gray-500">Đã đầy</div>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex items-center gap-3 px-6 py-3 border-b bg-white flex-shrink-0">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                
                <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)}
                    className="px-3 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500" />
                
                <select value={filterDoctor} onChange={(e) => setFilterDoctor(e.target.value)}
                    className="px-3 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option value="">Tất cả bác sĩ</option>
                    {doctors.map(d => (
                        <option key={d.id} value={d.id}>{d.firstName} {d.lastName}</option>
                    ))}
                </select>
                
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option value="">Tất cả trạng thái</option>
                    <option value="available">Còn chỗ</option>
                    <option value="full">Đã đầy</option>
                    <option value="past">Đã qua</option>
                </select>

                {hasFilters && (
                    <button onClick={clearFilters} className="flex items-center gap-1 px-2 py-1 text-sm text-gray-600 hover:text-gray-900">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Xóa bộ lọc
                    </button>
                )}
            </div>

            {/* Table */}
            <div className="flex-1 overflow-hidden bg-white">
                <DataTable
                    columns={columns}
                    data={filteredSchedules}
                    keyField="id"
                    compact
                    pageSize={12}
                    emptyMessage="Không có lịch khám nào"
                />
            </div>

            {/* Slide Panel */}
            <SlidePanel
                isOpen={isPanelOpen}
                onClose={() => setIsPanelOpen(false)}
                title={editingSchedule ? 'Chỉnh sửa lịch khám' : 'Thêm lịch khám mới'}
                width="md"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Bác sĩ <span className="text-red-500">*</span></label>
                        <select value={formData.doctorId} onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
                            disabled={!!editingSchedule}
                            className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100">
                            <option value="">Chọn bác sĩ</option>
                            {doctors.map(d => (
                                <option key={d.id} value={d.id}>{d.firstName} {d.lastName} - {d.Specialty?.name || 'N/A'}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ngày <span className="text-red-500">*</span></label>
                            <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Khung giờ <span className="text-red-500">*</span></label>
                            <select value={formData.timeType} onChange={(e) => setFormData({ ...formData, timeType: e.target.value })}
                                className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500">
                                <option value="">Chọn khung giờ</option>
                                {timeStates.map(t => (
                                    <option key={t.keyMap} value={t.keyMap}>{t.valueVi}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Số bệnh nhân tối đa</label>
                        <input type="number" min="1" value={formData.maxNumber}
                            onChange={(e) => setFormData({ ...formData, maxNumber: parseInt(e.target.value) || 1 })}
                            className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500" />
                    </div>

                    <div className="flex gap-3 pt-4 border-t">
                        <button onClick={() => setIsPanelOpen(false)}
                            className="flex-1 px-4 py-2 text-sm font-medium border rounded-lg hover:bg-gray-50 transition">
                            Hủy
                        </button>
                        <button onClick={handleSave} disabled={submitting}
                            className="flex-1 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50">
                            {submitting ? 'Đang lưu...' : (editingSchedule ? 'Cập nhật' : 'Tạo mới')}
                        </button>
                    </div>
                </div>
            </SlidePanel>
        </div>
    );
}
