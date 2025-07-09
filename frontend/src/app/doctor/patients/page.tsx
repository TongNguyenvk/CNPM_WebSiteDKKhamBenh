'use client';

import { useEffect, useState } from 'react';
import { getDoctorPatients, DoctorPatient } from '@/lib/api';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LoadingPage } from '@/components/ui/loading';
import { Modal, ModalBody, ModalFooter } from '@/components/ui/modal';
import { format, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';
import { toast } from 'react-hot-toast';
import { cn } from '@/lib/utils';

export default function PatientsPage() {
    const [patients, setPatients] = useState<DoctorPatient[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedPatient, setSelectedPatient] = useState<DoctorPatient | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [sortBy, setSortBy] = useState<string>('lastName');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage] = useState<number>(12);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                setLoading(true);
                setError(null);

                const userStr = localStorage.getItem('user');
                if (!userStr) {
                    setError("Vui lòng đăng nhập để xem danh sách bệnh nhân");
                    return;
                }

                const user = JSON.parse(userStr);
                if (user.role !== 'R2') {
                    setError("Bạn không có quyền truy cập trang này");
                    return;
                }

                const doctorId = user.userId;
                const data = await getDoctorPatients(doctorId);
                setPatients(data);
            } catch (error: unknown) {
                const err = error as Error;
                setError(err.message || 'Lỗi khi tải danh sách bệnh nhân');
                toast.error('Lỗi khi tải danh sách bệnh nhân');
            } finally {
                setLoading(false);
            }
        };

        fetchPatients();
    }, []);

    // Helper functions for filtering, sorting, and pagination
    const getFilteredPatients = () => {
        let filtered = patients;

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(patient =>
                `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (patient.phoneNumber || '').includes(searchTerm)
            );
        }

        // Sort patients
        filtered.sort((a, b) => {
            let aValue: string | number = '';
            let bValue: string | number = '';

            switch (sortBy) {
                case 'firstName':
                    aValue = a.firstName || '';
                    bValue = b.firstName || '';
                    break;
                case 'lastName':
                    aValue = a.lastName || '';
                    bValue = b.lastName || '';
                    break;
                case 'email':
                    aValue = a.email || '';
                    bValue = b.email || '';
                    break;
                case 'totalAppointments':
                    aValue = a.totalAppointments || 0;
                    bValue = b.totalAppointments || 0;
                    break;
                case 'lastAppointment':
                    aValue = new Date(a.lastAppointment || '').getTime();
                    bValue = new Date(b.lastAppointment || '').getTime();
                    break;
                default:
                    aValue = a.lastName || '';
                    bValue = b.lastName || '';
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

    const getPaginatedPatients = () => {
        const filtered = getFilteredPatients();
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filtered.slice(startIndex, endIndex);
    };

    const getTotalPages = () => {
        const filtered = getFilteredPatients();
        return Math.ceil(filtered.length / itemsPerPage);
    };

    if (loading) {
        return <LoadingPage text="Đang tải danh sách bệnh nhân..." />;
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 text-xl mb-4">{error}</div>
                    <Button onClick={() => window.location.reload()}>
                        Thử lại
                    </Button>
                </div>
            </div>
        );
    }

    const patientsToDisplay = getPaginatedPatients();
    const totalPatients = getFilteredPatients().length;
    const totalPages = getTotalPages();

    return (
        <div className="min-h-screen bg-neutral-50">
            <div className="container py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-neutral-900 mb-2">
                        Danh Sách Bệnh Nhân
                    </h1>
                    <p className="text-neutral-600">
                        Quản lý và theo dõi thông tin bệnh nhân của bạn
                    </p>
                </div>

                {/* Search and Filter Controls */}
                <Card className="mb-6">
                    <CardBody className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
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
                                    <option value="lastName">Họ tên</option>
                                    <option value="email">Email</option>
                                    <option value="totalAppointments">Số lần khám</option>
                                    <option value="lastAppointment">Lần khám cuối</option>
                                </select>
                            </div>

                            {/* Sort Order */}
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">
                                    Thứ tự
                                </label>
                                <button
                                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                    className="btn-secondary px-3 py-2 w-full"
                                >
                                    {sortOrder === 'asc' ? '↑ Tăng dần' : '↓ Giảm dần'}
                                </button>
                            </div>

                            {/* Stats */}
                            <div className="text-sm text-neutral-600">
                                <div className="font-medium">Tổng cộng</div>
                                <div>{totalPatients} bệnh nhân</div>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                {/* Patients Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
                    {patientsToDisplay.map((patient) => (
                        <Card key={patient.id} className="group hover:shadow-large transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                              onClick={() => setSelectedPatient(patient)}>
                            <CardBody className="p-6">
                                <div className="flex items-center space-x-4 mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                                        <span className="text-white font-medium text-lg">
                                            {patient.firstName?.charAt(0)}{patient.lastName?.charAt(0)}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg font-semibold text-neutral-900 truncate group-hover:text-primary-600 transition-colors">
                                            {patient.firstName} {patient.lastName}
                                        </h3>
                                        <p className="text-sm text-neutral-600 truncate">
                                            {patient.email}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-neutral-600">Giới tính:</span>
                                        <Badge variant={patient.gender ? 'default' : 'secondary'}>
                                            {patient.gender ? 'Nam' : 'Nữ'}
                                        </Badge>
                                    </div>

                                    {patient.phoneNumber && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-neutral-600">SĐT:</span>
                                            <span className="text-sm font-medium text-neutral-900">
                                                {patient.phoneNumber}
                                            </span>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-neutral-600">Tổng lần khám:</span>
                                        <Badge variant="outline">
                                            {patient.totalAppointments || 0}
                                        </Badge>
                                    </div>

                                    {patient.upcomingAppointments && patient.upcomingAppointments > 0 && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-neutral-600">Lịch sắp tới:</span>
                                            <Badge variant="warning">
                                                {patient.upcomingAppointments}
                                            </Badge>
                                        </div>
                                    )}

                                    {patient.lastAppointment && (
                                        <div className="pt-2 border-t border-neutral-200">
                                            <div className="text-xs text-neutral-500">Lần khám cuối:</div>
                                            <div className="text-sm font-medium text-neutral-900">
                                                {format(parseISO(patient.lastAppointment), 'dd/MM/yyyy', { locale: vi })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardBody>
                        </Card>
                    ))}
                </div>

                {/* Empty State */}
                {patientsToDisplay.length === 0 && (
                    <Card>
                        <CardBody className="text-center py-12">
                            <svg className="w-16 h-16 text-neutral-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <h3 className="text-lg font-medium text-neutral-900 mb-2">Không có bệnh nhân nào</h3>
                            <p className="text-neutral-600 mb-4">
                                {searchTerm ? 'Không tìm thấy bệnh nhân phù hợp với từ khóa tìm kiếm.' : 'Chưa có bệnh nhân nào đặt lịch khám với bạn.'}
                            </p>
                        </CardBody>
                    </Card>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-6">
                        <div className="text-sm text-neutral-600">
                            Hiển thị {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, totalPatients)} trong tổng số {totalPatients} bệnh nhân
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

                {/* Patient Detail Modal */}
                <Modal
                    isOpen={!!selectedPatient}
                    onClose={() => setSelectedPatient(null)}
                    title="Thông Tin Bệnh Nhân"
                    size="lg"
                >
                    {selectedPatient && (
                        <>
                            <ModalBody>
                                <div className="space-y-6">
                                    {/* Patient Basic Info */}
                                    <div className="bg-primary-50 p-6 rounded-xl">
                                        <div className="flex items-center space-x-4 mb-4">
                                            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                                                <span className="text-white font-medium text-xl">
                                                    {selectedPatient.firstName?.charAt(0)}{selectedPatient.lastName?.charAt(0)}
                                                </span>
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-semibold text-neutral-900">
                                                    {selectedPatient.firstName} {selectedPatient.lastName}
                                                </h3>
                                                <p className="text-neutral-600">{selectedPatient.email}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Contact Information */}
                                    <div>
                                        <h4 className="font-semibold text-lg text-neutral-900 mb-4">Thông Tin Liên Hệ</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-sm font-medium text-neutral-500">Email</label>
                                                <p className="text-neutral-900">{selectedPatient.email}</p>
                                            </div>
                                            {selectedPatient.phoneNumber && (
                                                <div>
                                                    <label className="text-sm font-medium text-neutral-500">Số điện thoại</label>
                                                    <p className="text-neutral-900">{selectedPatient.phoneNumber}</p>
                                                </div>
                                            )}
                                            <div>
                                                <label className="text-sm font-medium text-neutral-500">Giới tính</label>
                                                <p className="text-neutral-900">
                                                    {selectedPatient.gender ? 'Nam' : 'Nữ'}
                                                </p>
                                            </div>
                                            {selectedPatient.address && (
                                                <div>
                                                    <label className="text-sm font-medium text-neutral-500">Địa chỉ</label>
                                                    <p className="text-neutral-900">{selectedPatient.address}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Medical Statistics */}
                                    <div>
                                        <h4 className="font-semibold text-lg text-neutral-900 mb-4">Thống Kê Khám Bệnh</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="bg-neutral-50 p-4 rounded-lg text-center">
                                                <div className="text-2xl font-bold text-primary-600">
                                                    {selectedPatient.totalAppointments || 0}
                                                </div>
                                                <div className="text-sm text-neutral-600">Tổng lần khám</div>
                                            </div>
                                            <div className="bg-neutral-50 p-4 rounded-lg text-center">
                                                <div className="text-2xl font-bold text-warning-600">
                                                    {selectedPatient.upcomingAppointments || 0}
                                                </div>
                                                <div className="text-sm text-neutral-600">Lịch sắp tới</div>
                                            </div>
                                            <div className="bg-neutral-50 p-4 rounded-lg text-center">
                                                <div className="text-lg font-bold text-neutral-900">
                                                    {selectedPatient.lastAppointment
                                                        ? format(parseISO(selectedPatient.lastAppointment), 'dd/MM/yyyy', { locale: vi })
                                                        : 'Chưa có'
                                                    }
                                                </div>
                                                <div className="text-sm text-neutral-600">Lần khám cuối</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    variant="outline"
                                    onClick={() => setSelectedPatient(null)}
                                >
                                    Đóng
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </Modal>
            </div>
        </div>
    );
}
