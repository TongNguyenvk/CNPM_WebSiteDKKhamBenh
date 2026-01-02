'use client';

import { useState, useEffect, useMemo } from 'react';
import { getAllSchedules, getPendingSchedules, approveSchedule, rejectSchedule, createSchedule, updateDoctorSchedule, deleteDoctorSchedule, getAllDoctors } from '@/lib/api';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { SlidePanel, DataTable } from '@/components/ui';
import { toast } from 'react-hot-toast';

interface Schedule {
    id: number;
    date: string;
    doctorId: number;
    timeType: string;
    maxNumber: number;
    currentNumber?: number;
    status?: 'pending' | 'approved' | 'rejected';
    timeTypeData?: { valueVi: string; valueEn: string };
    doctorData?: { id: number; firstName: string; lastName: string; specialtyData?: { id: number; name: string } };
}

interface Doctor { id: number; firstName: string; lastName: string; specialtyData?: { id: number; name: string }; }

const timeSlots = [
    { key: 'T1', label: '08:00 - 09:00' }, { key: 'T2', label: '09:00 - 10:00' },
    { key: 'T3', label: '10:00 - 11:00' }, { key: 'T4', label: '11:00 - 12:00' },
    { key: 'T5', label: '13:00 - 14:00' }, { key: 'T6', label: '14:00 - 15:00' },
    { key: 'T7', label: '15:00 - 16:00' }, { key: 'T8', label: '16:00 - 17:00' },
];

const statusConfig: Record<string, { text: string; bg: string; color: string }> = {
    pending: { text: 'Chờ duyệt', bg: 'bg-yellow-100', color: 'text-yellow-700' },
    approved: { text: 'Đã duyệt', bg: 'bg-green-100', color: 'text-green-700' },
    rejected: { text: 'Từ chối', bg: 'bg-red-100', color: 'text-red-700' },
};

export default function AdminSchedulePage() {
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [pendingSchedules, setPendingSchedules] = useState<Schedule[]>([]);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'all' | 'pending'>('all');
    const [filterDate, setFilterDate] = useState('');
    const [filterDoctor, setFilterDoctor] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
    const [formData, setFormData] = useState({ doctorId: '', date: format(new Date(), 'yyyy-MM-dd'), timeType: '', maxNumber: 1 });
    const [submitting, setSubmitting] = useState(false);

    const loadData = async () => {
        setLoading(true);
        try {
            const [all, pending, docs] = await Promise.all([getAllSchedules(), getPendingSchedules(), getAllDoctors()]);
            setSchedules(all);
            setPendingSchedules(pending);
            setDoctors(docs);
        } catch (error: unknown) {
            toast.error(error instanceof Error ? error.message : 'Lỗi khi tải dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, []);

    const getTimeLabel = (key: string) => timeSlots.find(s => s.key === key)?.label || key;

    const filteredSchedules = useMemo(() => {
        return schedules.filter(s => {
            if (filterDate && format(new Date(s.date), 'yyyy-MM-dd') !== filterDate) return false;
            if (filterDoctor && s.doctorId !== Number(filterDoctor)) return false;
            if (filterStatus && s.status !== filterStatus) return false;
            return true;
        });
    }, [schedules, filterDate, filterDoctor, filterStatus]);

    const displaySchedules = activeTab === 'pending' ? pendingSchedules : filteredSchedules;
    const hasFilters = filterDate || filterDoctor || filterStatus;

    const openCreatePanel = () => {
        setEditingSchedule(null);
        setFormData({ doctorId: '', date: format(new Date(), 'yyyy-MM-dd'), timeType: '', maxNumber: 1 });
        setIsPanelOpen(true);
    };

    const openEditPanel = (schedule: Schedule) => {
        setEditingSchedule(schedule);
        setFormData({ doctorId: schedule.doctorId.toString(), date: format(new Date(schedule.date), 'yyyy-MM-dd'), timeType: schedule.timeType, maxNumber: schedule.maxNumber });
        setIsPanelOpen(true);
    };

    const handleSave = async () => {
        if (!formData.doctorId || !formData.timeType || !formData.date) {
            toast.error('Vui lòng điền đầy đủ thông tin');
            return;
        }
        setSubmitting(true);
        try {
            if (editingSchedule) {
                await updateDoctorSchedule(editingSchedule.id, { date: formData.date, timeType: formData.timeType, maxNumber: formData.maxNumber });
                toast.success('Cập nhật thành công');
            } else {
                await createSchedule({ doctorId: Number(formData.doctorId), date: formData.date, timeType: formData.timeType, maxNumber: formData.maxNumber });
                toast.success('Tạo lịch thành công');
            }
            loadData();
            setIsPanelOpen(false);
        } catch (error: unknown) {
            toast.error(error instanceof Error ? error.message : 'Lỗi');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm('Xác nhận xóa lịch này?')) return;
        try { await deleteDoctorSchedule(id); toast.success('Đã xóa'); loadData(); }
        catch (error: unknown) { toast.error(error instanceof Error ? error.message : 'Lỗi'); }
    };

    const handleApprove = async (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        try { await approveSchedule(id); toast.success('Đã duyệt'); loadData(); }
        catch (error: unknown) { toast.error(error instanceof Error ? error.message : 'Lỗi'); }
    };

    const handleReject = async (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm('Từ chối lịch này?')) return;
        try { await rejectSchedule(id); toast.success('Đã từ chối'); loadData(); }
        catch (error: unknown) { toast.error(error instanceof Error ? error.message : 'Lỗi'); }
    };

    const clearFilters = () => {
        setFilterDate('');
        setFilterDoctor('');
        setFilterStatus('');
    };

    const columns = useMemo(() => [
        {
            key: 'date', header: 'Ngày', width: 'w-28',
            render: (s: Schedule) => (
                <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="font-medium">{format(new Date(s.date), 'dd/MM/yyyy', { locale: vi })}</span>
                </div>
            )
        },
        {
            key: 'doctor', header: 'Bác sĩ',
            render: (s: Schedule) => (
                <div>
                    <div className="font-medium text-gray-900">{s.doctorData?.firstName} {s.doctorData?.lastName}</div>
                    <div className="text-xs text-gray-500">{s.doctorData?.specialtyData?.name || ''}</div>
                </div>
            )
        },
        {
            key: 'timeType', header: 'Khung giờ',
            render: (s: Schedule) => (
                <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                    {getTimeLabel(s.timeType)}
                </span>
            )
        },
        {
            key: 'capacity', header: 'Số lượng', width: 'w-24',
            render: (s: Schedule) => (
                <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${((s.currentNumber || 0) / s.maxNumber) * 100}%` }} />
                    </div>
                    <span className="text-xs text-gray-600 w-10">{s.currentNumber || 0}/{s.maxNumber}</span>
                </div>
            )
        },
        {
            key: 'status', header: 'Trạng thái', width: 'w-28',
            render: (s: Schedule) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig[s.status || 'approved'].bg} ${statusConfig[s.status || 'approved'].color}`}>
                    {statusConfig[s.status || 'approved'].text}
                </span>
            )
        },
        {
            key: 'actions', header: '', width: 'w-28',
            render: (s: Schedule) => (
                <div className="flex justify-end gap-1">
                    {s.status === 'pending' ? (
                        <>
                            <button onClick={(e) => handleApprove(s.id, e)} className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg" title="Duyệt">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            </button>
                            <button onClick={(e) => handleReject(s.id, e)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg" title="Từ chối">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </>
                    ) : (
                        <>
                            <button onClick={() => openEditPanel(s)} className="p-1.5 hover:bg-gray-100 rounded-lg" title="Sửa">
                                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                            </button>
                            <button onClick={(e) => handleDelete(s.id, e)} className="p-1.5 hover:bg-red-50 rounded-lg" title="Xóa">
                                <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                        </>
                    )}
                </div>
            )
        },
    ], []);

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
                    <h1 className="text-xl font-bold text-gray-900">Quản lý lịch phân công</h1>
                    <p className="text-sm text-gray-500">{displaySchedules.length} lịch {activeTab === 'pending' ? 'chờ duyệt' : ''}</p>
                </div>
                <button onClick={openCreatePanel} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Thêm lịch
                </button>
            </div>

            {/* Toolbar */}
            <div className="flex items-center gap-3 px-6 py-3 border-b bg-white flex-shrink-0">
                {/* Tabs */}
                <div className="flex bg-gray-100 p-1 rounded-lg">
                    <button
                        onClick={() => setActiveTab('all')}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${activeTab === 'all' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'}`}
                    >
                        Tất cả
                    </button>
                    <button
                        onClick={() => setActiveTab('pending')}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition flex items-center gap-2 ${activeTab === 'pending' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'}`}
                    >
                        Chờ duyệt
                        {pendingSchedules.length > 0 && (
                            <span className="px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full">{pendingSchedules.length}</span>
                        )}
                    </button>
                </div>

                {activeTab === 'all' && (
                    <>
                        <div className="h-6 w-px bg-gray-200" />
                        <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)}
                            className="px-3 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500" />
                        <select value={filterDoctor} onChange={(e) => setFilterDoctor(e.target.value)}
                            className="px-3 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500">
                            <option value="">Tất cả bác sĩ</option>
                            {doctors.map(d => <option key={d.id} value={d.id}>{d.firstName} {d.lastName}</option>)}
                        </select>
                        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-3 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500">
                            <option value="">Tất cả trạng thái</option>
                            <option value="pending">Chờ duyệt</option>
                            <option value="approved">Đã duyệt</option>
                            <option value="rejected">Từ chối</option>
                        </select>
                        {hasFilters && (
                            <button onClick={clearFilters} className="flex items-center gap-1 px-2 py-1 text-sm text-gray-600 hover:text-gray-900">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Xóa bộ lọc
                            </button>
                        )}
                    </>
                )}
            </div>

            {/* Table */}
            <div className="flex-1 overflow-hidden bg-white">
                <DataTable
                    columns={columns}
                    data={displaySchedules}
                    keyField="id"
                    compact
                    pageSize={15}
                    emptyMessage={activeTab === 'pending' ? 'Không có lịch chờ duyệt' : 'Không có lịch nào'}
                />
            </div>

            {/* Slide Panel */}
            <SlidePanel
                isOpen={isPanelOpen}
                onClose={() => setIsPanelOpen(false)}
                title={editingSchedule ? 'Chỉnh sửa lịch' : 'Thêm lịch phân công'}
                width="md"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Bác sĩ <span className="text-red-500">*</span></label>
                        <select value={formData.doctorId} onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
                            disabled={!!editingSchedule}
                            className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100">
                            <option value="">Chọn bác sĩ</option>
                            {doctors.map(d => <option key={d.id} value={d.id}>{d.firstName} {d.lastName} - {d.specialtyData?.name || 'N/A'}</option>)}
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
                                {timeSlots.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
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
