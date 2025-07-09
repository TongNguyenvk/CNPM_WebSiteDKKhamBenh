'use client';

import { useState, useEffect } from 'react';
import { getAllDoctors, getAllSpecialties, createDoctor, updateDoctor, deleteDoctor } from '@/lib/api';
import { toast } from 'react-hot-toast';

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
    specialtyData?: {
        id: number;
        name: string;
        description?: string;
        image?: string;
    };
}

interface Specialty {
    id: number;
    name: string;
}

export default function DoctorsPage() {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [specialties, setSpecialties] = useState<Specialty[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
    const [sortBy, setSortBy] = useState<string>('firstName');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage] = useState<number>(8);
    const [loading, setLoading] = useState<boolean>(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        specialtyId: '',
        positionId: '',
        phoneNumber: '',
        address: '',
        gender: true
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [doctorsData, specialtiesData] = await Promise.all([
                getAllDoctors(),
                getAllSpecialties()
            ]);
            setDoctors(doctorsData);
            setSpecialties(specialtiesData);
        } catch (error) {
            toast.error('Lỗi khi tải dữ liệu');
        } finally {
            setLoading(false);
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

    const handleCreateDoctor = async () => {
        try {
            await createDoctor({
                ...formData,
                specialtyId: Number(formData.specialtyId)
            });
            toast.success('Tạo bác sĩ thành công');
            setIsCreateModalOpen(false);
            setFormData({
                email: '',
                password: '',
                firstName: '',
                lastName: '',
                specialtyId: '',
                positionId: '',
                phoneNumber: '',
                address: '',
                gender: true
            });
            loadDoctors();
        } catch (error) {
            toast.error('Lỗi khi tạo bác sĩ');
        }
    };

    const handleUpdateDoctor = async () => {
        if (!selectedDoctor) return;
        try {
            await updateDoctor(selectedDoctor.id, {
                ...formData,
                specialtyId: Number(formData.specialtyId)
            });
            toast.success('Cập nhật bác sĩ thành công');
            setIsEditModalOpen(false);
            loadDoctors();
        } catch (error) {
            toast.error('Lỗi khi cập nhật bác sĩ');
        }
    };

    const handleDeleteDoctor = async (doctorId: number) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa bác sĩ này?')) {
            try {
                await deleteDoctor(doctorId);
                toast.success('Xóa bác sĩ thành công');
                loadDoctors();
            } catch (error) {
                toast.error('Lỗi khi xóa bác sĩ');
            }
        }
    };

    // Helper functions for filtering, sorting, and pagination
    const getFilteredDoctors = () => {
        let filtered = doctors;

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(doctor =>
                `${doctor.firstName} ${doctor.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (doctor.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (doctor.phoneNumber || '').includes(searchTerm) ||
                (doctor.specialtyData?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by specialty
        if (selectedSpecialty !== 'all') {
            filtered = filtered.filter(doctor =>
                doctor.specialtyId?.toString() === selectedSpecialty
            );
        }

        // Sort doctors
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
                case 'specialty':
                    aValue = a.specialtyData?.name || '';
                    bValue = b.specialtyData?.name || '';
                    break;
                default:
                    aValue = a.firstName || '';
                    bValue = b.firstName || '';
            }

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return sortOrder === 'asc'
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            }
            return 0;
        });

        return filtered;
    };

    const getPaginatedDoctors = () => {
        const filtered = getFilteredDoctors();
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filtered.slice(startIndex, endIndex);
    };

    const getTotalPages = () => {
        const filtered = getFilteredDoctors();
        return Math.ceil(filtered.length / itemsPerPage);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                    <p className="text-neutral-600">Đang tải danh sách bác sĩ...</p>
                </div>
            </div>
        );
    }

    const doctorsToDisplay = getPaginatedDoctors();
    const totalDoctors = getFilteredDoctors().length;
    const totalPages = getTotalPages();

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-6 pt-28">
            <div className="bg-white rounded-xl shadow-2xl p-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-blue-600 text-center border-b pb-3">Quản lý bác sĩ</h1>
                    <p className="text-neutral-600 text-center mt-2">
                        Quản lý thông tin và lịch làm việc của các bác sĩ
                    </p>
                </div>

                {/* Search and Filter Controls */}
                <div className="mb-6 bg-neutral-50 p-6 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
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
                                    placeholder="Tìm theo tên, email, chuyên khoa..."
                                    className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                />
                            </div>
                        </div>

                        {/* Specialty Filter */}
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                                Chuyên khoa
                            </label>
                            <select
                                value={selectedSpecialty}
                                onChange={(e) => {
                                    setSelectedSpecialty(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">Tất cả chuyên khoa</option>
                                {specialties.map(specialty => (
                                    <option key={specialty.id} value={specialty.id.toString()}>
                                        {specialty.name}
                                    </option>
                                ))}
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
                                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="firstName">Tên</option>
                                <option value="lastName">Họ</option>
                                <option value="email">Email</option>
                                <option value="specialty">Chuyên khoa</option>
                            </select>
                        </div>

                        {/* Sort Order & Add Button */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                className="px-3 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-100 transition-colors"
                                title={sortOrder === 'asc' ? 'Tăng dần' : 'Giảm dần'}
                            >
                                {sortOrder === 'asc' ? '↑' : '↓'}
                            </button>
                            <button
                                onClick={() => setIsCreateModalOpen(true)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 ease-in-out flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Thêm bác sĩ
                            </button>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="mt-4 text-sm text-neutral-600">
                        Hiển thị {doctorsToDisplay.length} trong tổng số {totalDoctors} bác sĩ
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border rounded-lg">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="px-4 py-2 border text-left">ID</th>
                                <th className="px-4 py-2 border text-left">Email</th>
                                <th className="px-4 py-2 border text-left">Họ</th>
                                <th className="px-4 py-2 border text-left">Tên</th>
                                <th className="px-4 py-2 border text-left">Chuyên khoa</th>
                                <th className="px-4 py-2 border text-left">Số điện thoại</th>
                                <th className="px-4 py-2 border text-left">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {doctorsToDisplay.map((doctor) => (
                                <tr key={doctor.id} className="hover:bg-gray-50 transition duration-150">
                                    <td className="px-4 py-2 border">{doctor.id}</td>
                                    <td className="px-4 py-2 border">{doctor.email || 'Chưa cập nhật'}</td>
                                    <td className="px-4 py-2 border">{doctor.firstName}</td>
                                    <td className="px-4 py-2 border">{doctor.lastName}</td>
                                    <td className="px-4 py-2 border">{doctor.specialtyData?.name || 'Chưa cập nhật'}</td>
                                    <td className="px-4 py-2 border">{doctor.phoneNumber || 'Chưa cập nhật'}</td>
                                    <td className="px-4 py-2 border">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => {
                                                    setSelectedDoctor(doctor);
                                                    setFormData({
                                                        email: doctor.email || '',
                                                        password: '',
                                                        firstName: doctor.firstName,
                                                        lastName: doctor.lastName,
                                                        specialtyId: doctor.specialtyId?.toString() || '',
                                                        positionId: doctor.positionId || '',
                                                        phoneNumber: doctor.phoneNumber || '',
                                                        address: doctor.address || '',
                                                        gender: doctor.gender || true
                                                    });
                                                    setIsEditModalOpen(true);
                                                }}
                                                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition duration-200"
                                            >
                                                Sửa
                                            </button>
                                            <button
                                                onClick={() => handleDeleteDoctor(doctor.id)}
                                                className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
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

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-6 flex items-center justify-between">
                        <div className="text-sm text-neutral-600">
                            Trang {currentPage} / {totalPages}
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Trước
                            </button>

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
                                            className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                                                currentPage === pageNum
                                                    ? "bg-blue-600 text-white"
                                                    : "text-neutral-600 hover:bg-neutral-100"
                                            }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                            </div>

                            <button
                                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Sau
                            </button>
                        </div>
                    </div>
                )}

                {/* Create Doctor Modal */}
                {isCreateModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-xl w-96 shadow-2xl">
                            <h2 className="text-xl font-bold text-gray-800 mb-6">Thêm bác sĩ mới</h2>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
                                    <input
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Họ</label>
                                    <input
                                        type="text"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Tên</label>
                                    <input
                                        type="text"
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Chuyên khoa</label>
                                    <select
                                        value={formData.specialtyId}
                                        onChange={(e) => setFormData({ ...formData, specialtyId: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    >
                                        <option value="">Chọn chuyên khoa</option>
                                        {specialties.map((specialty) => (
                                            <option key={specialty.id} value={specialty.id}>
                                                {specialty.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Vị trí</label>
                                    <select
                                        value={formData.positionId}
                                        onChange={(e) => setFormData({ ...formData, positionId: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    >
                                        <option value="">Chọn vị trí</option>
                                        <option value="P0">Bác sĩ</option>
                                        <option value="P1">Thạc sĩ</option>
                                        <option value="P2">Tiến sĩ</option>
                                        <option value="P3">Phó giáo sư</option>
                                        <option value="P4">Giáo sư</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                                    <input
                                        type="text"
                                        value={formData.phoneNumber}
                                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Địa chỉ</label>
                                    <input
                                        type="text"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="flex justify-end gap-4 mt-6">
                                    <button
                                        onClick={() => setIsCreateModalOpen(false)}
                                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-200"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        onClick={handleCreateDoctor}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                                    >
                                        Tạo
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Edit Doctor Modal */}
                {isEditModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-8 rounded-xl w-full max-w-md shadow-2xl transform transition-all duration-300 ease-in-out hover:shadow-3xl">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b-2 border-blue-500 pb-2">Cập nhật thông tin bác sĩ</h2>
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        disabled
                                        className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200 text-lg py-3"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Họ</label>
                                    <input
                                        type="text"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200 text-lg py-3"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Tên</label>
                                    <input
                                        type="text"
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200 text-lg py-3"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Chuyên khoa</label>
                                    <select
                                        value={formData.specialtyId}
                                        onChange={(e) => setFormData({ ...formData, specialtyId: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200 text-lg py-3"
                                    >
                                        <option value="">Chọn chuyên khoa</option>
                                        {specialties.map((specialty) => (
                                            <option key={specialty.id} value={specialty.id}>
                                                {specialty.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Vị trí</label>
                                    <select
                                        value={formData.positionId}
                                        onChange={(e) => setFormData({ ...formData, positionId: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200 text-lg py-3"
                                    >
                                        <option value="">Chọn vị trí</option>
                                        <option value="P0">Bác sĩ</option>
                                        <option value="P1">Thạc sĩ</option>
                                        <option value="P2">Tiến sĩ</option>
                                        <option value="P3">Phó giáo sư</option>
                                        <option value="P4">Giáo sư</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                                    <input
                                        type="text"
                                        value={formData.phoneNumber}
                                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200 text-lg py-3"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Địa chỉ</label>
                                    <input
                                        type="text"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200 text-lg py-3"
                                    />
                                </div>
                                <div className="flex justify-end gap-4 mt-6">
                                    <button
                                        onClick={() => setIsEditModalOpen(false)}
                                        className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition duration-200 shadow-md hover:shadow-lg"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        onClick={handleUpdateDoctor}
                                        className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition duration-200 shadow-md hover:shadow-lg"
                                    >
                                        Cập nhật
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}