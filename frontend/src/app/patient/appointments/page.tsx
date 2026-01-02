'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getPatientAppointments, cancelBooking } from '@/lib/api';
import { SlidePanel } from '@/components/ui/slide-panel';
import { DataTable } from '@/components/ui/data-table';
import { cn, formatDate, getAvatarUrl } from '@/lib/utils';

interface Appointment {
    id: number;
    date: string;
    timeType: string;
    statusId: string;
    patientId: number;
    doctorId: number;
    doctorData?: {
        firstName: string;
        lastName: string;
        email: string;
        image: string;
        specialtyData?: {
            name: string;
        };
    };
    statusData?: {
        keyMap: string;
        valueVi: string;
        valueEn: string;
    };
    timeTypeData?: {
        valueVi: string;
        valueEn?: string;
    };
}

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
    S1: { label: 'Chờ xác nhận', color: 'text-yellow-700', bg: 'bg-yellow-100' },
    S2: { label: 'Đã xác nhận', color: 'text-blue-700', bg: 'bg-blue-100' },
    S3: { label: 'Hoàn thành', color: 'text-green-700', bg: 'bg-green-100' },
    S4: { label: 'Đã hủy', color: 'text-red-700', bg: 'bg-red-100' },
};

export default function AppointmentsPage() {
    const router = useRouter();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        confirmed: 0,
        completed: 0,
        cancelled: 0,
    });

    useEffect(() => {
        fetchAppointments();
    }, [router]);

    useEffect(() => {
        filterAppointments();
    }, [appointments, searchTerm, filterStatus]);

    const fetchAppointments = async () => {
        try {
            const userStr = localStorage.getItem('user');
            if (!userStr) {
                router.push('/auth/login');
                return;
            }

            const user = JSON.parse(userStr);
            const data = await getPatientAppointments(user.userId);
            setAppointments(data);

            // Calculate stats
            setStats({
                total: data.length,
                pending: data.filter((a: Appointment) => a.statusId === 'S1').length,
                confirmed: data.filter((a: Appointment) => a.statusId === 'S2').length,
                completed: data.filter((a: Appointment) => a.statusId === 'S3').length,
                cancelled: data.filter((a: Appointment) => a.statusId === 'S4').length,
            });
        } catch (err: any) {
            setError(err.message || 'Có lỗi xảy ra khi tải danh sách lịch khám');
        } finally {
            setIsLoading(false);
        }
    };

    const filterAppointments = () => {
        let filtered = appointments;

        if (filterStatus !== 'all') {
            filtered = filtered.filter(a => a.statusId === filterStatus);
        }

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(a =>
                `${a.doctorData?.firstName} ${a.doctorData?.lastName}`.toLowerCase().includes(term) ||
                a.doctorData?.specialtyData?.name?.toLowerCase().includes(term) ||
                a.date.includes(term)
            );
        }

        // Sort by date descending
        filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setFilteredAppointments(filtered);
    };

    const handleCancelAppointment = async (appointmentId: number) => {
        if (!window.confirm('Bạn có chắc chắn muốn hủy lịch khám này?')) return;

        try {
            setError(null);
            setSuccess(null);
            await cancelBooking(appointmentId);
            setSuccess('Hủy lịch khám thành công!');
            setSelectedAppointment(null);
            fetchAppointments();
        } catch (err: any) {
            setError(err.message || 'Có lỗi xảy ra khi hủy lịch khám');
        }
    };

    const columns = [
        {
            key: 'doctor',
            header: 'Bác sĩ',
            render: (item: Appointment) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        {item.doctorData?.image ? (
                            <Image
                                src={getAvatarUrl(item.doctorData?.image)}
                                alt=""
                                width={40}
                                height={40}
                                className="w-10 h-10 rounded-full object-cover"
                                unoptimized
                            />
                        ) : (
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        )}
                    </div>
                    <div>
                        <p className="font-medium text-gray-900">
                            BS. {item.doctorData?.firstName} {item.doctorData?.lastName}
                        </p>
                        <p className="text-sm text-gray-500">{item.doctorData?.specialtyData?.name || 'Chưa có'}</p>
                    </div>
                </div>
            ),
        },
        {
            key: 'date',
            header: 'Ngày khám',
            render: (item: Appointment) => (
                <div>
                    <p className="font-medium text-gray-900">{formatDate(item.date)}</p>
                    <p className="text-sm text-gray-500">{item.timeTypeData?.valueVi || item.timeType}</p>
                </div>
            ),
        },
        {
            key: 'status',
            header: 'Trạng thái',
            render: (item: Appointment) => {
                const status = statusConfig[item.statusId] || statusConfig.S1;
                return (
                    <span className={cn('px-2.5 py-1 rounded-full text-xs font-medium', status.bg, status.color)}>
                        {status.label}
                    </span>
                );
            },
        },
    ];

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b px-6 py-4 flex-shrink-0">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Lịch khám của tôi</h1>
                        <p className="text-sm text-gray-500 mt-1">Quản lý và theo dõi các lịch khám</p>
                    </div>
                    <button
                        onClick={() => router.push('/patient/book_appointment')}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Đặt lịch mới
                    </button>
                </div>
            </div>

            {/* Alerts */}
            {error && (
                <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                    {error}
                </div>
            )}
            {success && (
                <div className="mx-6 mt-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
                    {success}
                </div>
            )}

            {/* Stats */}
            <div className="px-6 py-4 flex-shrink-0">
                <div className="grid grid-cols-5 gap-4">
                    <div className="bg-white rounded-lg p-4 border">
                        <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                        <p className="text-sm text-gray-500">Tổng cộng</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border">
                        <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                        <p className="text-sm text-gray-500">Chờ xác nhận</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border">
                        <p className="text-2xl font-bold text-blue-600">{stats.confirmed}</p>
                        <p className="text-sm text-gray-500">Đã xác nhận</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border">
                        <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                        <p className="text-sm text-gray-500">Hoàn thành</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border">
                        <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
                        <p className="text-sm text-gray-500">Đã hủy</p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="px-6 pb-4 flex-shrink-0">
                <div className="bg-white rounded-lg border p-4">
                    <div className="flex items-center gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Tìm theo bác sĩ, chuyên khoa..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">Tất cả trạng thái</option>
                            <option value="S1">Chờ xác nhận</option>
                            <option value="S2">Đã xác nhận</option>
                            <option value="S3">Hoàn thành</option>
                            <option value="S4">Đã hủy</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="flex-1 px-6 pb-6 min-h-0">
                <div className="bg-white rounded-lg border h-full">
                    <DataTable
                        columns={columns}
                        data={filteredAppointments}
                        keyField="id"
                        onRowClick={(item) => setSelectedAppointment(item)}
                        selectedId={selectedAppointment?.id}
                        emptyMessage="Chưa có lịch khám nào"
                        pageSize={10}
                    />
                </div>
            </div>

            {/* Detail Panel */}
            <SlidePanel
                isOpen={!!selectedAppointment}
                onClose={() => setSelectedAppointment(null)}
                title="Chi tiết lịch khám"
                width="md"
            >
                {selectedAppointment && (
                    <div className="space-y-6">
                        {/* Doctor Info */}
                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                                {selectedAppointment.doctorData?.image ? (
                                    <Image
                                        src={getAvatarUrl(selectedAppointment.doctorData?.image)}
                                        alt=""
                                        width={64}
                                        height={64}
                                        className="w-16 h-16 rounded-full object-cover"
                                        unoptimized
                                    />
                                ) : (
                                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                )}
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 text-lg">
                                    BS. {selectedAppointment.doctorData?.firstName} {selectedAppointment.doctorData?.lastName}
                                </h3>
                                <p className="text-gray-600">{selectedAppointment.doctorData?.specialtyData?.name || 'Chưa có thông tin'}</p>
                                <p className="text-sm text-gray-500">{selectedAppointment.doctorData?.email}</p>
                            </div>
                        </div>

                        {/* Appointment Details */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between py-3 border-b">
                                <span className="text-gray-600">Ngày khám</span>
                                <span className="font-medium text-gray-900">{formatDate(selectedAppointment.date)}</span>
                            </div>
                            <div className="flex items-center justify-between py-3 border-b">
                                <span className="text-gray-600">Giờ khám</span>
                                <span className="font-medium text-gray-900">{selectedAppointment.timeTypeData?.valueVi || selectedAppointment.timeType}</span>
                            </div>
                            <div className="flex items-center justify-between py-3 border-b">
                                <span className="text-gray-600">Trạng thái</span>
                                {(() => {
                                    const status = statusConfig[selectedAppointment.statusId] || statusConfig.S1;
                                    return (
                                        <span className={cn('px-3 py-1 rounded-full text-sm font-medium', status.bg, status.color)}>
                                            {status.label}
                                        </span>
                                    );
                                })()}
                            </div>
                        </div>

                        {/* Actions */}
                        {selectedAppointment.statusId === 'S1' && (
                            <div className="pt-4">
                                <button
                                    onClick={() => handleCancelAppointment(selectedAppointment.id)}
                                    className="w-full py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    Hủy lịch khám
                                </button>
                            </div>
                        )}

                        {selectedAppointment.statusId === 'S2' && (
                            <div className="p-4 bg-blue-50 rounded-lg">
                                <p className="text-blue-700 text-sm">
                                    <strong>Lưu ý:</strong> Lịch khám đã được xác nhận. Vui lòng đến đúng giờ.
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </SlidePanel>
        </div>
    );
}
