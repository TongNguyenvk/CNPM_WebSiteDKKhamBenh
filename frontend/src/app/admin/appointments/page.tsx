'use client';

import { useState, useEffect } from 'react';
import { getAllDoctors, getAllSchedules, createDoctorSchedule, updateDoctorSchedule, deleteDoctorSchedule, getTimeStates } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input, Select } from '@/components/ui/input';
import { LoadingPage } from '@/components/ui/loading';
import { Modal, ModalBody, ModalFooter } from '@/components/ui/modal';
import { format, parseISO, isToday, isTomorrow, isPast } from 'date-fns';
import { vi } from 'date-fns/locale';
import { cn } from '@/lib/utils';

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
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [dateFilter, setDateFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [sortBy, setSortBy] = useState<string>('date');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage] = useState<number>(10);
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

    // Removed old filteredSchedules - now using getFilteredSchedules() function

    const getDateLabel = (dateString: string) => {
        const date = parseISO(dateString);
        if (isToday(date)) return 'Hôm nay';
        if (isTomorrow(date)) return 'Ngày mai';
        return format(date, 'dd/MM/yyyy', { locale: vi });
    };

    const getStatusBadge = (schedule: Schedule) => {
        const date = parseISO(schedule.date);
        const currentNumber = schedule.currentNumber || 0;
        const maxNumber = schedule.maxNumber;

        if (isPast(date)) {
            return <Badge variant="neutral" size="sm">Đã qua</Badge>;
        }

        if (currentNumber >= maxNumber) {
            return <Badge variant="error" size="sm">Đã đầy</Badge>;
        }

        if (currentNumber > maxNumber * 0.8) {
            return <Badge variant="warning" size="sm">Sắp đầy</Badge>;
        }

        return <Badge variant="success" size="sm">Còn chỗ</Badge>;
    };

    // Helper functions for filtering, sorting, and pagination
    const getFilteredSchedules = () => {
        let filtered = schedules;

        // Filter by search term (doctor name)
        if (searchTerm) {
            filtered = filtered.filter(schedule =>
                `${schedule.doctorData?.firstName} ${schedule.doctorData?.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                schedule.doctorData?.Specialty?.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by doctor
        if (selectedDoctor) {
            filtered = filtered.filter(schedule =>
                schedule.doctorId.toString() === selectedDoctor
            );
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
                    filtered = filtered.filter(schedule => schedule.date === todayStr);
                    break;
                case 'tomorrow':
                    filtered = filtered.filter(schedule => schedule.date === tomorrowStr);
                    break;
                case 'upcoming':
                    filtered = filtered.filter(schedule => schedule.date >= todayStr);
                    break;
                case 'past':
                    filtered = filtered.filter(schedule => schedule.date < todayStr);
                    break;
            }
        }

        // Filter by status
        if (statusFilter !== 'all') {
            filtered = filtered.filter(schedule => {
                const date = parseISO(schedule.date);
                const currentNumber = schedule.currentNumber || 0;

                switch (statusFilter) {
                    case 'available':
                        return !isPast(date) && currentNumber < schedule.maxNumber;
                    case 'full':
                        return !isPast(date) && currentNumber >= schedule.maxNumber;
                    case 'past':
                        return isPast(date);
                    default:
                        return true;
                }
            });
        }

        // Sort schedules
        filtered.sort((a, b) => {
            let aValue: string | number = '';
            let bValue: string | number = '';

            switch (sortBy) {
                case 'date':
                    aValue = new Date(a.date).getTime();
                    bValue = new Date(b.date).getTime();
                    break;
                case 'doctor':
                    aValue = `${a.doctorData?.firstName} ${a.doctorData?.lastName}` || '';
                    bValue = `${b.doctorData?.firstName} ${b.doctorData?.lastName}` || '';
                    break;
                case 'timeType':
                    aValue = a.timeTypeData?.valueVi || '';
                    bValue = b.timeTypeData?.valueVi || '';
                    break;
                case 'maxNumber':
                    aValue = a.maxNumber;
                    bValue = b.maxNumber;
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

    const getPaginatedSchedules = () => {
        const filtered = getFilteredSchedules();
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filtered.slice(startIndex, endIndex);
    };

    const getTotalPages = () => {
        const filtered = getFilteredSchedules();
        return Math.ceil(filtered.length / itemsPerPage);
    };

    if (loading) {
        return <LoadingPage text="Đang tải danh sách lịch khám..." />;
    }

    const schedulesToDisplay = getPaginatedSchedules();
    const totalSchedules = getFilteredSchedules().length;
    const totalPages = getTotalPages();

    return (
        <div className="min-h-screen bg-neutral-50">
            <div className="container py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-neutral-900 mb-2">
                        Quản Lý Lịch Khám
                    </h1>
                    <p className="text-neutral-600">
                        Quản lý lịch làm việc của bác sĩ và theo dõi tình trạng đặt lịch
                    </p>
                </div>

                {/* Filters and Actions */}
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
                                        placeholder="Tìm theo tên bác sĩ, chuyên khoa..."
                                        className="form-input pl-10"
                                        value={searchTerm}
                                        onChange={(e) => {
                                            setSearchTerm(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Doctor Filter */}
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">
                                    Bác sĩ
                                </label>
                                <select
                                    value={selectedDoctor}
                                    onChange={(e) => {
                                        setSelectedDoctor(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="form-select"
                                >
                                    <option value="">Tất cả bác sĩ</option>
                                    {doctors.map(doctor => (
                                        <option key={doctor.id} value={doctor.id.toString()}>
                                            {doctor.firstName} {doctor.lastName} - {doctor.Specialty?.name}
                                        </option>
                                    ))}
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

                            {/* Status Filter */}
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">
                                    Trạng thái
                                </label>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => {
                                        setStatusFilter(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="form-select"
                                >
                                    <option value="all">Tất cả</option>
                                    <option value="available">Còn chỗ</option>
                                    <option value="full">Đã đầy</option>
                                    <option value="past">Đã qua</option>
                                </select>
                            </div>

                            {/* Sort & Add Button */}
                            <div className="flex gap-2">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="form-select"
                                >
                                    <option value="date">Sắp xếp theo ngày</option>
                                    <option value="doctor">Sắp xếp theo bác sĩ</option>
                                    <option value="timeType">Sắp xếp theo giờ</option>
                                    <option value="maxNumber">Sắp xếp theo số lượng</option>
                                </select>
                                <button
                                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                    className="btn-secondary px-3 py-2"
                                    title={sortOrder === 'asc' ? 'Tăng dần' : 'Giảm dần'}
                                >
                                    {sortOrder === 'asc' ? '↑' : '↓'}
                                </button>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="mt-4 text-sm text-neutral-600">
                            Hiển thị {schedulesToDisplay.length} trong tổng số {totalSchedules} lịch khám
                        </div>

                        {/* Add Button */}
                        <div className="mt-4 flex justify-end">

                            {/* Add Schedule Button */}
                            <Button onClick={() => {
                                setFormData({
                                    doctorId: '',
                                    date: '',
                                    timeType: timeStates[0]?.keyMap || '',
                                    maxNumber: 20
                                });
                                setIsCreateModalOpen(true);
                            }}>
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Thêm lịch khám
                            </Button>
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
                                <p className="text-2xl font-bold text-neutral-900">{totalSchedules}</p>
                                <p className="text-sm text-neutral-600">Tổng lịch khám</p>
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
                                    {getFilteredSchedules().filter(s => !isPast(parseISO(s.date))).length}
                                </p>
                                <p className="text-sm text-neutral-600">Lịch sắp tới</p>
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
                                    {getFilteredSchedules().filter(s => (s.currentNumber || 0) >= s.maxNumber).length}
                                </p>
                                <p className="text-sm text-neutral-600">Lịch đã đầy</p>
                            </div>
                        </CardBody>
                    </Card>

                    <Card>
                        <CardBody className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-neutral-900">{doctors.length}</p>
                                <p className="text-sm text-neutral-600">Bác sĩ</p>
                            </div>
                        </CardBody>
                    </Card>
                </div>

                {/* Schedules Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Danh sách lịch khám ({totalSchedules})
                        </CardTitle>
                    </CardHeader>
                    <CardBody className="p-0">
                        {schedulesToDisplay.length === 0 ? (
                            <div className="text-center py-16">
                                <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-12 h-12 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                                    Chưa có lịch khám nào
                                </h3>
                                <p className="text-neutral-600 mb-6">
                                    {selectedDoctor ? 'Bác sĩ này chưa có lịch khám nào.' : 'Chưa có lịch khám nào trong hệ thống.'}
                                </p>
                                <Button onClick={() => {
                                    setFormData({
                                        doctorId: selectedDoctor,
                                        date: '',
                                        timeType: timeStates[0]?.keyMap || '',
                                        maxNumber: 20
                                    });
                                    setIsCreateModalOpen(true);
                                }}>
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Tạo lịch khám đầu tiên
                                </Button>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead className="bg-neutral-50 border-b border-neutral-200">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">ID</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Bác sĩ</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Ngày</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Thời gian</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Số lượng</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Trạng thái</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-neutral-200">
                                        {schedulesToDisplay.map((schedule) => (
                                            <tr key={schedule.id} className="hover:bg-neutral-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                                                    #{schedule.id}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                                                            <span className="text-primary-600 font-medium text-sm">
                                                                {schedule.doctorData?.firstName?.charAt(0)}{schedule.doctorData?.lastName?.charAt(0)}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-neutral-900">
                                                                {schedule.doctorData ? `${schedule.doctorData.firstName} ${schedule.doctorData.lastName}` : 'N/A'}
                                                            </p>
                                                            <p className="text-xs text-neutral-500">
                                                                {schedule.doctorData?.Specialty?.name || 'N/A'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div>
                                                        <p className="text-sm font-medium text-neutral-900">
                                                            {getDateLabel(schedule.date)}
                                                        </p>
                                                        <p className="text-xs text-neutral-500">
                                                            {format(parseISO(schedule.date), 'EEEE', { locale: vi })}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                                                    <Badge variant="outline" size="sm">
                                                        {schedule.timeTypeData?.valueVi || 'N/A'}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm">
                                                        <span className="font-medium text-neutral-900">
                                                            {schedule.currentNumber || 0}
                                                        </span>
                                                        <span className="text-neutral-500">
                                                            /{schedule.maxNumber}
                                                        </span>
                                                    </div>
                                                    <div className="w-full bg-neutral-200 rounded-full h-1.5 mt-1">
                                                        <div
                                                            className="bg-primary-600 h-1.5 rounded-full"
                                                            style={{
                                                                width: `${Math.min(((schedule.currentNumber || 0) / schedule.maxNumber) * 100, 100)}%`
                                                            }}
                                                        ></div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {getStatusBadge(schedule)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center space-x-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
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
                                                        >
                                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                            </svg>
                                                            Sửa
                                                        </Button>
                                                        <Button
                                                            variant="error"
                                                            size="sm"
                                                            onClick={() => handleDeleteSchedule(schedule.id)}
                                                        >
                                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                            Xóa
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardBody>
                </Card>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-6">
                        <div className="text-sm text-neutral-600">
                            Hiển thị {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, totalSchedules)} trong tổng số {totalSchedules} lịch khám
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
                                            className={cn(
                                                "px-3 py-1 text-sm rounded-md transition-colors",
                                                currentPage === pageNum
                                                    ? "bg-primary-600 text-white"
                                                    : "text-neutral-600 hover:bg-neutral-100"
                                            )}
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
            </div>

            {/* Create Schedule Modal */}
            <Modal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title="Thêm lịch khám mới"
                size="md"
            >
                <ModalBody>
                    <div className="space-y-6">
                        <Select
                            label="Bác sĩ"
                            value={formData.doctorId}
                            onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
                            options={[
                                { value: '', label: 'Chọn bác sĩ' },
                                ...doctors.map(doctor => ({
                                    value: doctor.id.toString(),
                                    label: `${doctor.firstName} ${doctor.lastName} - ${doctor.Specialty?.name}`
                                }))
                            ]}
                            required
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Ngày khám"
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                required
                                min={new Date().toISOString().split('T')[0]}
                            />

                            <Select
                                label="Thời gian"
                                value={formData.timeType}
                                onChange={(e) => setFormData({ ...formData, timeType: e.target.value })}
                                options={timeStates.map(time => ({
                                    value: time.keyMap,
                                    label: time.valueVi
                                }))}
                                required
                            />
                        </div>

                        <Input
                            label="Số lượng bệnh nhân tối đa"
                            type="number"
                            value={formData.maxNumber.toString()}
                            onChange={(e) => setFormData({ ...formData, maxNumber: parseInt(e.target.value) || 1 })}
                            min="1"
                            max="50"
                            required
                            helperText="Số lượng bệnh nhân có thể đặt lịch trong khung giờ này"
                        />
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button
                        variant="outline"
                        onClick={() => setIsCreateModalOpen(false)}
                    >
                        Hủy
                    </Button>
                    <Button onClick={handleCreateSchedule}>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Tạo lịch khám
                    </Button>
                </ModalFooter>
            </Modal>

            {/* Edit Schedule Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="Cập nhật lịch khám"
                size="md"
            >
                <ModalBody>
                    <div className="space-y-6">
                        {selectedSchedule && (
                            <div className="bg-neutral-50 p-4 rounded-lg">
                                <h4 className="font-medium text-neutral-900 mb-2">Thông tin bác sĩ</h4>
                                <p className="text-sm text-neutral-600">
                                    {selectedSchedule.doctorData ?
                                        `${selectedSchedule.doctorData.firstName} ${selectedSchedule.doctorData.lastName} - ${selectedSchedule.doctorData.Specialty?.name}`
                                        : 'N/A'
                                    }
                                </p>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Ngày khám"
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                required
                                min={new Date().toISOString().split('T')[0]}
                            />

                            <Select
                                label="Thời gian"
                                value={formData.timeType}
                                onChange={(e) => setFormData({ ...formData, timeType: e.target.value })}
                                options={timeStates.map(time => ({
                                    value: time.keyMap,
                                    label: time.valueVi
                                }))}
                                required
                            />
                        </div>

                        <Input
                            label="Số lượng bệnh nhân tối đa"
                            type="number"
                            value={formData.maxNumber.toString()}
                            onChange={(e) => setFormData({ ...formData, maxNumber: parseInt(e.target.value) || 1 })}
                            min={selectedSchedule?.currentNumber?.toString() || "1"}
                            max="50"
                            required
                            helperText={`Hiện tại có ${selectedSchedule?.currentNumber || 0} bệnh nhân đã đặt lịch`}
                        />
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button
                        variant="outline"
                        onClick={() => setIsEditModalOpen(false)}
                    >
                        Hủy
                    </Button>
                    <Button onClick={handleUpdateSchedule}>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Cập nhật
                    </Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}