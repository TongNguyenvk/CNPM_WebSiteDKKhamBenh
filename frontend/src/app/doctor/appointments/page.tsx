"use client";

import { useEffect, useState } from "react";
import { getDoctorAppointments, updateBookingStatus } from "@/lib/api";
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input, Select } from '@/components/ui/input';
import { LoadingPage } from '@/components/ui/loading';
import { Modal, ModalBody, ModalFooter } from '@/components/ui/modal';
import { format, parseISO, isToday, isTomorrow, isPast } from 'date-fns';
import { vi } from 'date-fns/locale';
import { toast } from 'react-hot-toast';

interface Appointment {
    id: number;
    date: string;
    timeType: string;
    statusId: string;
    patientId: number;
    doctorId: number;
    patientData?: {
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber?: string;
        address?: string;
        gender?: boolean;
    };
    statusData?: {
        keyMap: string;
        valueVi: string;
        valueEn: string;
    };
    timeTypeData?: {
        valueVi: string;
        valueEn: string;
    };
}

export default function DoctorAppointmentsPage() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [dateFilter, setDateFilter] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<string>('date');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage] = useState<number>(10);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const userStr = localStorage.getItem('user');
                if (!userStr) {
                    setError("Vui lòng đăng nhập để xem lịch khám");
                    return;
                }

                const user = JSON.parse(userStr);
                if (user.role !== 'R2') {
                    setError("Bạn không có quyền truy cập trang này");
                    return;
                }

                const doctorId = user.userId;
                const data = await getDoctorAppointments(doctorId);
                setAppointments(data);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (err: any) {
                console.error('Error fetching appointments:', err);
                setError(err.message || "Có lỗi xảy ra khi tải lịch khám");
            } finally {
                setIsLoading(false);
            }
        };

        fetchAppointments();
    }, []);

    const handleStatusUpdate = async (appointmentId: number, newStatus: string) => {
        try {
            await updateBookingStatus(appointmentId, newStatus);

            const successMessage = newStatus === 'S2' ? "Xác nhận lịch khám thành công!" : "Hủy lịch khám thành công!";
            toast.success(successMessage);

            // Cập nhật lại danh sách
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                const doctorId = user.userId;
                const updatedAppointments = await getDoctorAppointments(doctorId);
                setAppointments(updatedAppointments);
                setSelectedAppointment(null);
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            console.error('Error updating appointment status:', err);
            toast.error(err.message || "Có lỗi xảy ra khi cập nhật trạng thái lịch khám");
        }
    };

    const getStatusBadge = (statusId: string, statusData?: any) => {
        const statusMap: Record<string, { variant: any; text: string }> = {
            S1: { variant: 'warning', text: 'Chờ xác nhận' },
            S2: { variant: 'primary', text: 'Đã xác nhận' },
            S3: { variant: 'success', text: 'Hoàn thành' },
            S4: { variant: 'error', text: 'Đã hủy' }
        };

        const status = statusMap[statusId] || { variant: 'neutral', text: statusData?.valueVi || statusId };
        return (
            <Badge variant={status.variant} size="sm">
                {status.text}
            </Badge>
        );
    };

    const getDateLabel = (dateString: string) => {
        const date = parseISO(dateString);
        if (isToday(date)) return 'Hôm nay';
        if (isTomorrow(date)) return 'Ngày mai';
        return format(date, 'dd/MM/yyyy', { locale: vi });
    };

    const getFilteredAppointments = () => {
        let filtered = appointments;

        // Filter by status
        if (filterStatus !== 'all') {
            filtered = filtered.filter(appointment => appointment.statusId === filterStatus);
        }

        // Filter by date
        if (dateFilter !== 'all') {
            const today = new Date();
            const todayStr = today.toISOString().split('T')[0];
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            const tomorrowStr = tomorrow.toISOString().split('T')[0];

            switch (dateFilter) {
                case 'today':
                    filtered = filtered.filter(appointment => appointment.date === todayStr);
                    break;
                case 'tomorrow':
                    filtered = filtered.filter(appointment => appointment.date === tomorrowStr);
                    break;
                case 'upcoming':
                    filtered = filtered.filter(appointment => appointment.date >= todayStr);
                    break;
                case 'past':
                    filtered = filtered.filter(appointment => appointment.date < todayStr);
                    break;
            }
        }

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(appointment =>
                `${appointment.patientData?.firstName} ${appointment.patientData?.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                appointment.patientData?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                appointment.patientData?.phoneNumber?.includes(searchTerm)
            );
        }

        // Sort appointments
        filtered.sort((a, b) => {
            let aValue: string | number = '';
            let bValue: string | number = '';

            switch (sortBy) {
                case 'date':
                    aValue = new Date(a.date).getTime();
                    bValue = new Date(b.date).getTime();
                    break;
                case 'patient':
                    aValue = `${a.patientData?.firstName} ${a.patientData?.lastName}` || '';
                    bValue = `${b.patientData?.firstName} ${b.patientData?.lastName}` || '';
                    break;
                case 'timeType':
                    aValue = a.timeTypeData?.valueVi || '';
                    bValue = b.timeTypeData?.valueVi || '';
                    break;
                case 'status':
                    aValue = a.statusData?.valueVi || '';
                    bValue = b.statusData?.valueVi || '';
                    break;
                default:
                    aValue = new Date(a.date).getTime();
                    bValue = new Date(b.date).getTime();
            }

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return sortOrder === 'asc'
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            } else {
                return sortOrder === 'asc'
                    ? (aValue as number) - (bValue as number)
                    : (bValue as number) - (aValue as number);
            }
        });

        return filtered;
    };

    const getPaginatedAppointments = () => {
        const filtered = getFilteredAppointments();
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filtered.slice(startIndex, endIndex);
    };

    const getTotalPages = () => {
        const filtered = getFilteredAppointments();
        return Math.ceil(filtered.length / itemsPerPage);
    };

    if (isLoading) {
        return <LoadingPage text="Đang tải lịch khám..." />;
    }

    if (error) {
        return (
            <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
                <Card className="max-w-md">
                    <CardBody className="text-center p-8">
                        <div className="w-16 h-16 bg-error-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-error-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-neutral-900 mb-2">Có lỗi xảy ra</h3>
                        <p className="text-neutral-600 mb-6">{error}</p>
                        <Button onClick={() => window.location.reload()}>
                            Thử lại
                        </Button>
                    </CardBody>
                </Card>
            </div>
        );
    }

    const appointmentsToDisplay = getPaginatedAppointments();
    const totalAppointments = getFilteredAppointments().length;
    const totalPages = getTotalPages();

    return (
        <div className="min-h-screen bg-neutral-50">
            <div className="container py-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-neutral-900 mb-2">
                        Lịch khám của tôi
                    </h1>
                    <p className="text-neutral-600">
                        Quản lý và theo dõi tất cả lịch khám của bệnh nhân
                    </p>
                </div>

                {/* Filters and Search */}
                <Card className="mb-6">
                    <CardBody className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                            {/* Search */}
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">
                                    Tìm kiếm
                                </label>
                                <div className="relative">
                                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    <input
                                        type="text"
                                        placeholder="Tìm theo tên, email, SĐT..."
                                        className="form-input pl-10"
                                        value={searchTerm}
                                        onChange={(e) => {
                                            setSearchTerm(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Status Filter */}
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">
                                    Trạng thái
                                </label>
                                <select
                                    value={filterStatus}
                                    onChange={(e) => {
                                        setFilterStatus(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="form-select"
                                >
                                    <option value="all">Tất cả trạng thái</option>
                                    <option value="S1">Chờ xác nhận</option>
                                    <option value="S2">Đã xác nhận</option>
                                    <option value="S3">Hoàn thành</option>
                                    <option value="S4">Đã hủy</option>
                                </select>
                            </div>

                            {/* Date Filter */}
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">
                                    Thời gian
                                </label>
                                <select
                                    value={dateFilter}
                                    onChange={(e) => {
                                        setDateFilter(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="form-select"
                                >
                                    <option value="all">Tất cả</option>
                                    <option value="today">Hôm nay</option>
                                    <option value="tomorrow">Ngày mai</option>
                                    <option value="upcoming">Sắp tới</option>
                                    <option value="past">Đã qua</option>
                                </select>
                            </div>

                            {/* Sort By */}
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">
                                    Sắp xếp theo
                                </label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="form-select"
                                >
                                    <option value="date">Ngày khám</option>
                                    <option value="patient">Tên bệnh nhân</option>
                                    <option value="timeType">Giờ khám</option>
                                    <option value="status">Trạng thái</option>
                                </select>
                            </div>

                            {/* Sort Order */}
                            <div className="flex items-end">
                                <button
                                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                    className="btn-secondary px-3 py-2 h-10"
                                    title={sortOrder === 'asc' ? 'Tăng dần' : 'Giảm dần'}
                                >
                                    {sortOrder === 'asc' ? '↑' : '↓'}
                                </button>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="mt-4 text-sm text-neutral-600">
                            Hiển thị {appointmentsToDisplay.length} trong tổng số {totalAppointments} lịch khám
                        </div>
                    </CardBody>
                </Card>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                    <Card>
                        <CardBody className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-neutral-900">{appointments.length}</p>
                                <p className="text-sm text-neutral-600">Tổng lịch khám</p>
                            </div>
                        </CardBody>
                    </Card>

                    <Card>
                        <CardBody className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-warning-100 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-neutral-900">
                                    {appointments.filter(a => a.statusId === 'S1').length}
                                </p>
                                <p className="text-sm text-neutral-600">Chờ xác nhận</p>
                            </div>
                        </CardBody>
                    </Card>

                    <Card>
                        <CardBody className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-success-100 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-neutral-900">
                                    {appointments.filter(a => a.statusId === 'S2').length}
                                </p>
                                <p className="text-sm text-neutral-600">Đã xác nhận</p>
                            </div>
                        </CardBody>
                    </Card>

                    <Card>
                        <CardBody className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-neutral-900">
                                    {appointments.filter(a => a.statusId === 'S3').length}
                                </p>
                                <p className="text-sm text-neutral-600">Hoàn thành</p>
                            </div>
                        </CardBody>
                    </Card>
                </div>

                {/* Appointments List */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Danh sách lịch khám ({totalAppointments})
                        </CardTitle>
                    </CardHeader>
                    <CardBody>
                        {appointmentsToDisplay.length === 0 ? (
                            <div className="text-center py-16">
                                <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-12 h-12 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                                    Không tìm thấy lịch khám nào
                                </h3>
                                <p className="text-neutral-600 mb-6">
                                    {searchTerm || filterStatus !== 'all' ? 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.' : 'Chưa có lịch khám nào.'}
                                </p>
                                {(searchTerm || filterStatus !== 'all') && (
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setSearchTerm('');
                                            setFilterStatus('all');
                                            setDateFilter('all');
                                            setCurrentPage(1);
                                        }}
                                    >
                                        Xóa bộ lọc
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {appointmentsToDisplay.map((appointment) => (
                                    <div
                                        key={appointment.id}
                                        className="flex items-center justify-between p-6 bg-white border border-neutral-200 rounded-xl hover:shadow-md transition-all cursor-pointer"
                                        onClick={() => setSelectedAppointment(appointment)}
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                                                <span className="text-primary-600 font-medium text-sm">
                                                    {appointment.patientData?.firstName?.charAt(0)}{appointment.patientData?.lastName?.charAt(0)}
                                                </span>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-neutral-900">
                                                    {appointment.patientData?.firstName} {appointment.patientData?.lastName}
                                                </h4>
                                                <p className="text-sm text-neutral-600">
                                                    {appointment.patientData?.email}
                                                </p>
                                                {appointment.patientData?.phoneNumber && (
                                                    <p className="text-xs text-neutral-500">
                                                        {appointment.patientData.phoneNumber}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <span className="text-sm font-medium text-neutral-900">
                                                    {getDateLabel(appointment.date)}
                                                </span>
                                                <Badge variant="outline" size="sm">
                                                    {appointment.timeTypeData?.valueVi}
                                                </Badge>
                                            </div>
                                            {getStatusBadge(appointment.statusId, appointment.statusData)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardBody>
                </Card>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-6">
                        <div className="text-sm text-neutral-600">
                            Hiển thị {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, totalAppointments)} trong tổng số {totalAppointments} lịch khám
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                            >
                                Trước
                            </Button>

                            {/* Page numbers */}
                            <div className="flex items-center space-x-1">
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    let pageNum;
                                    if (totalPages <= 5) {
                                        pageNum = i + 1;
                                    } else if (currentPage <= 3) {
                                        pageNum = i + 1;
                                    } else if (currentPage >= totalPages - 2) {
                                        pageNum = totalPages - 4 + i;
                                    } else {
                                        pageNum = currentPage - 2 + i;
                                    }

                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => setCurrentPage(pageNum)}
                                            className={`px-3 py-1 text-sm rounded-md transition-colors ${
                                                currentPage === pageNum
                                                    ? "bg-primary-600 text-white"
                                                    : "text-neutral-600 hover:bg-neutral-100"
                                            }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                            </div>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                            >
                                Sau
                            </Button>
                        </div>
                    </div>
                )}

                {/* Appointment Detail Modal */}
                <Modal
                    isOpen={!!selectedAppointment}
                    onClose={() => setSelectedAppointment(null)}
                    title="Chi Tiết Lịch Khám"
                    size="lg"
                >
                    {selectedAppointment && (
                        <>
                            <ModalBody>
                                <div className="space-y-6">
                                    {/* Patient Information */}
                                    <div className="bg-neutral-50 p-6 rounded-xl">
                                        <h3 className="font-semibold text-lg text-neutral-900 mb-4 flex items-center">
                                            <svg className="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            Thông Tin Bệnh Nhân
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-sm font-medium text-neutral-500">Họ tên</label>
                                                <p className="text-neutral-900 font-medium">
                                                    {selectedAppointment.patientData?.firstName} {selectedAppointment.patientData?.lastName}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-neutral-500">Email</label>
                                                <p className="text-neutral-900">{selectedAppointment.patientData?.email}</p>
                                            </div>
                                            {selectedAppointment.patientData?.phoneNumber && (
                                                <div>
                                                    <label className="text-sm font-medium text-neutral-500">Số điện thoại</label>
                                                    <p className="text-neutral-900">{selectedAppointment.patientData.phoneNumber}</p>
                                                </div>
                                            )}
                                            {selectedAppointment.patientData?.address && (
                                                <div>
                                                    <label className="text-sm font-medium text-neutral-500">Địa chỉ</label>
                                                    <p className="text-neutral-900">{selectedAppointment.patientData.address}</p>
                                                </div>
                                            )}
                                            <div>
                                                <label className="text-sm font-medium text-neutral-500">Giới tính</label>
                                                <p className="text-neutral-900">
                                                    {selectedAppointment.patientData?.gender ? 'Nam' : 'Nữ'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Appointment Information */}
                                    <div className="bg-neutral-50 p-6 rounded-xl">
                                        <h3 className="font-semibold text-lg text-neutral-900 mb-4 flex items-center">
                                            <svg className="w-5 h-5 mr-2 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            Thông Tin Lịch Khám
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-sm font-medium text-neutral-500">Ngày khám</label>
                                                <p className="text-neutral-900 font-medium">
                                                    {getDateLabel(selectedAppointment.date)}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-neutral-500">Ca khám</label>
                                                <p className="text-neutral-900">{selectedAppointment.timeTypeData?.valueVi}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-neutral-500">Trạng thái</label>
                                                <div className="mt-1">
                                                    {getStatusBadge(selectedAppointment.statusId, selectedAppointment.statusData)}
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-neutral-500">Mã lịch khám</label>
                                                <p className="text-neutral-900">#{selectedAppointment.id}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                {selectedAppointment.statusId === 'S1' ? (
                                    <>
                                        <Button
                                            variant="outline"
                                            onClick={() => setSelectedAppointment(null)}
                                        >
                                            Đóng
                                        </Button>
                                        <Button
                                            variant="error"
                                            onClick={() => handleStatusUpdate(selectedAppointment.id, 'S4')}
                                        >
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                            Hủy Lịch
                                        </Button>
                                        <Button
                                            onClick={() => handleStatusUpdate(selectedAppointment.id, 'S2')}
                                        >
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Xác Nhận
                                        </Button>
                                    </>
                                ) : selectedAppointment.statusId === 'S2' ? (
                                    <>
                                        <Button
                                            variant="outline"
                                            onClick={() => setSelectedAppointment(null)}
                                        >
                                            Đóng
                                        </Button>
                                        <Button
                                            onClick={() => handleStatusUpdate(selectedAppointment.id, 'S3')}
                                        >
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Hoàn Thành
                                        </Button>
                                    </>
                                ) : (
                                    <Button
                                        variant="outline"
                                        onClick={() => setSelectedAppointment(null)}
                                    >
                                        Đóng
                                    </Button>
                                )}
                            </ModalFooter>
                        </>
                    )}
                </Modal>
            </div>
        </div>
    );
}