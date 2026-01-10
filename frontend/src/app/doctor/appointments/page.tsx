'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { getDoctorAppointments, updateBookingStatus } from '@/lib/api';
import { SlidePanel, DataTable } from '@/components/ui';
import { format, parseISO, isToday, isTomorrow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { toast } from 'react-hot-toast';

interface Appointment {
    id: number;
    date: string;
    timeType: string;
    statusId: string;
    patientId: number;
    patientData?: { firstName: string; lastName: string; email: string; phoneNumber?: string; address?: string; gender?: boolean };
    statusData?: { valueVi: string };
    timeTypeData?: { valueVi: string };
}

const statusConfig: Record<string, { label: string; bg: string; color: string }> = {
    S1: { label: 'Chờ xác nhận', bg: 'bg-yellow-100', color: 'text-yellow-700' },
    S2: { label: 'Đã xác nhận', bg: 'bg-blue-100', color: 'text-blue-700' },
    S3: { label: 'Hoàn thành', bg: 'bg-green-100', color: 'text-green-700' },
    S4: { label: 'Đã hủy', bg: 'bg-red-100', color: 'text-red-700' },
};

function DoctorAppointmentsContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    // URL state
    const filterStatus = searchParams.get('status') || 'all';
    const filterDate = searchParams.get('date') || 'all';
    const searchTerm = searchParams.get('search') || '';

    const updateUrl = (updates: Record<string, string>) => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(updates).forEach(([key, value]) => {
            if (value && value !== 'all') params.set(key, value);
            else params.delete(key);
        });
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const [isPanelOpen, setIsPanelOpen] = useState(false);

    useEffect(() => { fetchAppointments(); }, []);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const userStr = localStorage.getItem('user');
            if (!userStr) return;
            const user = JSON.parse(userStr);
            const data = await getDoctorAppointments(user.userId);
            setAppointments(data);
        } catch (error) {
            console.error('Error:', error);
            toast.error('Không thể tải lịch khám');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (appointmentId: number, newStatus: string) => {
        try {
            await updateBookingStatus(appointmentId, newStatus);
            toast.success(newStatus === 'S2' ? 'Đã xác nhận lịch khám' : newStatus === 'S3' ? 'Đã hoàn thành khám' : 'Đã hủy lịch khám');
            fetchAppointments();
            setIsPanelOpen(false);
        } catch (error: unknown) {
            toast.error(error instanceof Error ? error.message : 'Lỗi cập nhật');
        }
    };

    const filteredAppointments = useMemo(() => {
        let filtered = appointments;
        if (filterStatus !== 'all') filtered = filtered.filter(a => a.statusId === filterStatus);
        if (filterDate !== 'all') {
            const today = new Date().toISOString().split('T')[0];
            const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
            switch (filterDate) {
                case 'today': filtered = filtered.filter(a => a.date === today); break;
                case 'tomorrow': filtered = filtered.filter(a => a.date === tomorrow); break;
                case 'upcoming': filtered = filtered.filter(a => a.date >= today); break;
                case 'past': filtered = filtered.filter(a => a.date < today); break;
            }
        }
        if (searchTerm) {
            const s = searchTerm.toLowerCase();
            filtered = filtered.filter(a => 
                `${a.patientData?.firstName} ${a.patientData?.lastName}`.toLowerCase().includes(s) || 
                a.patientData?.email?.toLowerCase().includes(s) ||
                a.patientData?.phoneNumber?.includes(s)
            );
        }
        return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [appointments, filterStatus, filterDate, searchTerm]);

    const stats = useMemo(() => ({
        total: appointments.length,
        pending: appointments.filter(a => a.statusId === 'S1').length,
        confirmed: appointments.filter(a => a.statusId === 'S2').length,
        completed: appointments.filter(a => a.statusId === 'S3').length,
    }), [appointments]);

    const getDateLabel = (d: string) => {
        const date = parseISO(d);
        if (isToday(date)) return 'Hôm nay';
        if (isTomorrow(date)) return 'Ngày mai';
        return format(date, 'dd/MM/yyyy', { locale: vi });
    };

    const columns = useMemo(() => [
        {
            key: 'patient', header: 'Bệnh nhân',
            render: (a: Appointment) => (
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-medium">
                        {a.patientData?.firstName?.charAt(0)}{a.patientData?.lastName?.charAt(0)}
                    </div>
                    <div>
                        <p className="font-medium text-gray-900">{a.patientData?.firstName} {a.patientData?.lastName}</p>
                        <p className="text-sm text-gray-500">{a.patientData?.phoneNumber || a.patientData?.email}</p>
                    </div>
                </div>
            )
        },
        {
            key: 'date', header: 'Ngày khám',
            render: (a: Appointment) => (
                <div>
                    <p className="font-medium text-gray-900">{getDateLabel(a.date)}</p>
                    <p className="text-sm text-gray-500">{a.timeTypeData?.valueVi || a.timeType}</p>
                </div>
            )
        },
        {
            key: 'status', header: 'Trạng thái',
            render: (a: Appointment) => (
                <span className={`px-2.5 py-1 rounded-full text-sm font-medium ${statusConfig[a.statusId]?.bg} ${statusConfig[a.statusId]?.color}`}>
                    {statusConfig[a.statusId]?.label}
                </span>
            )
        },
        {
            key: 'actions', header: '', width: 'w-32',
            render: (a: Appointment) => (
                <div className="flex items-center gap-2">
                    {a.statusId === 'S1' && (
                        <button onClick={(e) => { e.stopPropagation(); handleStatusUpdate(a.id, 'S2'); }}
                            className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                            Xác nhận
                        </button>
                    )}
                    <button onClick={() => { setSelectedAppointment(a); setIsPanelOpen(true); }}
                        className="p-1.5 hover:bg-gray-100 rounded-lg">
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                    </button>
                </div>
            )
        },
    ], []);

    if (loading) {
        return <div className="h-full flex items-center justify-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div>;
    }

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b bg-white flex-shrink-0">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Lịch khám của tôi</h1>
                    <p className="text-sm text-gray-500">{filteredAppointments.length} lịch khám</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 px-6 py-4 bg-gray-50 border-b flex-shrink-0">
                <div className="bg-white rounded-xl p-4 border">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div><p className="text-2xl font-bold text-gray-900">{stats.total}</p><p className="text-sm text-gray-500">Tổng lịch</p></div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 border">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div><p className="text-2xl font-bold text-gray-900">{stats.pending}</p><p className="text-sm text-gray-500">Chờ xác nhận</p></div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 border">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div><p className="text-2xl font-bold text-gray-900">{stats.confirmed}</p><p className="text-sm text-gray-500">Đã xác nhận</p></div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 border">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div><p className="text-2xl font-bold text-gray-900">{stats.completed}</p><p className="text-sm text-gray-500">Hoàn thành</p></div>
                    </div>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex items-center gap-4 px-6 py-3 border-b bg-white flex-shrink-0">
                <div className="relative flex-1 max-w-sm">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input type="text" placeholder="Tìm theo tên, email, SĐT..." value={searchTerm}
                        onChange={(e) => updateUrl({ search: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <select value={filterStatus} onChange={(e) => updateUrl({ status: e.target.value })}
                    className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option value="all">Tất cả trạng thái</option>
                    <option value="S1">Chờ xác nhận</option>
                    <option value="S2">Đã xác nhận</option>
                    <option value="S3">Hoàn thành</option>
                    <option value="S4">Đã hủy</option>
                </select>
                <select value={filterDate} onChange={(e) => updateUrl({ date: e.target.value })}
                    className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option value="all">Tất cả thời gian</option>
                    <option value="today">Hôm nay</option>
                    <option value="tomorrow">Ngày mai</option>
                    <option value="upcoming">Sắp tới</option>
                    <option value="past">Đã qua</option>
                </select>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-hidden bg-white">
                <DataTable columns={columns} data={filteredAppointments} keyField="id" pageSize={15} emptyMessage="Không có lịch khám nào" />
            </div>

            {/* Detail Panel */}
            <SlidePanel isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)} title="Chi tiết lịch khám" width="md">
                {selectedAppointment && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 text-xl font-bold">
                                {selectedAppointment.patientData?.firstName?.charAt(0)}{selectedAppointment.patientData?.lastName?.charAt(0)}
                            </div>
                            <div>
                                <p className="text-lg font-semibold text-gray-900">{selectedAppointment.patientData?.firstName} {selectedAppointment.patientData?.lastName}</p>
                                <p className="text-gray-500">{selectedAppointment.patientData?.email}</p>
                                {selectedAppointment.patientData?.phoneNumber && <p className="text-gray-500">{selectedAppointment.patientData.phoneNumber}</p>}
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h3 className="font-semibold text-gray-900">Thông tin lịch khám</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-500">Ngày khám</p>
                                    <p className="font-medium text-gray-900">{format(new Date(selectedAppointment.date), 'dd/MM/yyyy', { locale: vi })}</p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-500">Giờ khám</p>
                                    <p className="font-medium text-gray-900">{selectedAppointment.timeTypeData?.valueVi || selectedAppointment.timeType}</p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-500">Trạng thái</p>
                                    <span className={`inline-block mt-1 px-2.5 py-1 rounded-full text-sm font-medium ${statusConfig[selectedAppointment.statusId]?.bg} ${statusConfig[selectedAppointment.statusId]?.color}`}>
                                        {statusConfig[selectedAppointment.statusId]?.label}
                                    </span>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-500">Giới tính</p>
                                    <p className="font-medium text-gray-900">{selectedAppointment.patientData?.gender ? 'Nam' : 'Nữ'}</p>
                                </div>
                            </div>
                            {selectedAppointment.patientData?.address && (
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-500">Địa chỉ</p>
                                    <p className="font-medium text-gray-900">{selectedAppointment.patientData.address}</p>
                                </div>
                            )}
                        </div>
                        {selectedAppointment.statusId === 'S1' && (
                            <div className="flex gap-3 pt-4 border-t">
                                <button onClick={() => handleStatusUpdate(selectedAppointment.id, 'S4')}
                                    className="flex-1 px-4 py-2.5 font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition">Từ chối</button>
                                <button onClick={() => handleStatusUpdate(selectedAppointment.id, 'S2')}
                                    className="flex-1 px-4 py-2.5 font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Xác nhận</button>
                            </div>
                        )}
                        {selectedAppointment.statusId === 'S2' && (
                            <div className="flex gap-3 pt-4 border-t">
                                <button onClick={() => handleStatusUpdate(selectedAppointment.id, 'S4')}
                                    className="flex-1 px-4 py-2.5 font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition">Hủy lịch</button>
                                <button onClick={() => handleStatusUpdate(selectedAppointment.id, 'S3')}
                                    className="flex-1 px-4 py-2.5 font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Hoàn thành</button>
                            </div>
                        )}
                    </div>
                )}
            </SlidePanel>
        </div>
    );
}

export default function DoctorAppointmentsPage() {
    return (
        <Suspense fallback={<div className="h-full flex items-center justify-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div>}>
            <DoctorAppointmentsContent />
        </Suspense>
    );
}
