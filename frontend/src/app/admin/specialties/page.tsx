'use client';

import { useState, useEffect } from 'react';
import { getAllSpecialties, createSpecialty, updateSpecialty, deleteSpecialty } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoadingPage } from '@/components/ui/loading';
import { Modal, ModalBody, ModalFooter } from '@/components/ui/modal';
import { cn } from '@/lib/utils';

interface Specialty {
    id?: number;
    name: string;
    description?: string;
    image?: string;
    createdAt?: string;
    updatedAt?: string;
}

export default function SpecialtiesPage() {
    const [specialties, setSpecialties] = useState<Specialty[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [sortBy, setSortBy] = useState<string>('name');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage] = useState<number>(8);
    const [loading, setLoading] = useState<boolean>(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        image: ''
    });

    useEffect(() => {
        loadSpecialties();
    }, []);

    const loadSpecialties = async () => {
        try {
            setLoading(true);
            const data = await getAllSpecialties();
            setSpecialties(data);
        } catch (error: any) {
            toast.error(error.message || 'Lỗi khi tải danh sách chuyên khoa');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateSpecialty = async () => {
        try {
            if (!formData.name.trim()) {
                toast.error('Vui lòng nhập tên chuyên khoa');
                return;
            }

            await createSpecialty(formData);
            toast.success('Tạo chuyên khoa thành công');
            setIsCreateModalOpen(false);
            setFormData({ name: '', description: '', image: '' });
            loadSpecialties();
        } catch (error: any) {
            toast.error(error.message || 'Lỗi khi tạo chuyên khoa');
        }
    };

    const handleEditSpecialty = async () => {
        try {
            if (!selectedSpecialty?.id) return;
            
            if (!formData.name.trim()) {
                toast.error('Vui lòng nhập tên chuyên khoa');
                return;
            }

            await updateSpecialty(selectedSpecialty.id, formData);
            toast.success('Cập nhật chuyên khoa thành công');
            setIsEditModalOpen(false);
            setSelectedSpecialty(null);
            setFormData({ name: '', description: '', image: '' });
            loadSpecialties();
        } catch (error: any) {
            toast.error(error.message || 'Lỗi khi cập nhật chuyên khoa');
        }
    };

    const handleDeleteSpecialty = async (id: number) => {
        if (!confirm('Bạn có chắc chắn muốn xóa chuyên khoa này?')) return;

        try {
            await deleteSpecialty(id);
            toast.success('Xóa chuyên khoa thành công');
            loadSpecialties();
        } catch (error: any) {
            toast.error(error.message || 'Lỗi khi xóa chuyên khoa');
        }
    };

    const openEditModal = (specialty: Specialty) => {
        setSelectedSpecialty(specialty);
        setFormData({
            name: specialty.name,
            description: specialty.description || '',
            image: specialty.image || ''
        });
        setIsEditModalOpen(true);
    };

    // Helper functions for filtering, sorting, and pagination
    const getFilteredSpecialties = () => {
        let filtered = specialties;

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(specialty =>
                specialty.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (specialty.description || '').toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Sort specialties
        filtered.sort((a, b) => {
            let aValue: string = '';
            let bValue: string = '';

            switch (sortBy) {
                case 'name':
                    aValue = a.name || '';
                    bValue = b.name || '';
                    break;
                case 'createdAt':
                    aValue = a.createdAt || '';
                    bValue = b.createdAt || '';
                    break;
                default:
                    aValue = a.name || '';
                    bValue = b.name || '';
            }

            return sortOrder === 'asc' 
                ? aValue.localeCompare(bValue)
                : bValue.localeCompare(aValue);
        });

        return filtered;
    };

    const getPaginatedSpecialties = () => {
        const filtered = getFilteredSpecialties();
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filtered.slice(startIndex, endIndex);
    };

    const getTotalPages = () => {
        const filtered = getFilteredSpecialties();
        return Math.ceil(filtered.length / itemsPerPage);
    };

    if (loading) {
        return <LoadingPage text="Đang tải danh sách chuyên khoa..." />;
    }

    const specialtiesToDisplay = getPaginatedSpecialties();
    const totalSpecialties = getFilteredSpecialties().length;
    const totalPages = getTotalPages();

    return (
        <div className="min-h-screen bg-neutral-50">
            <div className="container py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-neutral-900 mb-2">
                        Quản Lý Chuyên Khoa
                    </h1>
                    <p className="text-neutral-600">
                        Quản lý các chuyên khoa y tế trong hệ thống
                    </p>
                </div>

                {/* Search and Filter Controls */}
                <Card className="mb-6">
                    <CardBody className="p-6">
                        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                            <div className="flex flex-col sm:flex-row gap-4 flex-1">
                                {/* Search */}
                                <div className="relative flex-1 max-w-md">
                                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    <input
                                        type="text"
                                        placeholder="Tìm kiếm theo tên, mô tả..."
                                        className="form-input pl-10"
                                        value={searchTerm}
                                        onChange={(e) => {
                                            setSearchTerm(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                    />
                                </div>

                                {/* Sort By */}
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="form-select min-w-[150px]"
                                >
                                    <option value="name">Sắp xếp theo tên</option>
                                    <option value="createdAt">Sắp xếp theo ngày tạo</option>
                                </select>

                                {/* Sort Order */}
                                <button
                                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                    className="btn-secondary px-3 py-2 min-w-[100px]"
                                >
                                    {sortOrder === 'asc' ? '↑ Tăng dần' : '↓ Giảm dần'}
                                </button>
                            </div>

                            {/* Add Specialty Button */}
                            <Button onClick={() => setIsCreateModalOpen(true)}>
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Thêm chuyên khoa
                            </Button>
                        </div>

                        {/* Stats */}
                        <div className="mt-4 text-sm text-neutral-600">
                            Hiển thị {specialtiesToDisplay.length} trong tổng số {totalSpecialties} chuyên khoa
                        </div>
                    </CardBody>
                </Card>

                {/* Specialties Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
                    {specialtiesToDisplay.map((specialty) => (
                        <Card key={specialty.id} className="group hover:shadow-large transition-all duration-300 hover:-translate-y-1">
                            <CardBody className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                        </svg>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => openEditModal(specialty)}
                                            className="p-2 text-neutral-400 hover:text-primary-600 transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => specialty.id && handleDeleteSpecialty(specialty.id)}
                                            className="p-2 text-neutral-400 hover:text-error-600 transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                <h3 className="text-lg font-semibold text-neutral-900 mb-2 group-hover:text-primary-600 transition-colors">
                                    {specialty.name}
                                </h3>
                                
                                {specialty.description && (
                                    <p className="text-sm text-neutral-600 line-clamp-3 mb-4">
                                        {specialty.description}
                                    </p>
                                )}

                                <div className="flex items-center justify-between text-xs text-neutral-500">
                                    <span>ID: {specialty.id}</span>
                                    {specialty.createdAt && (
                                        <span>{new Date(specialty.createdAt).toLocaleDateString('vi-VN')}</span>
                                    )}
                                </div>
                            </CardBody>
                        </Card>
                    ))}
                </div>

                {/* Empty State */}
                {specialtiesToDisplay.length === 0 && (
                    <Card>
                        <CardBody className="text-center py-12">
                            <svg className="w-16 h-16 text-neutral-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                            </svg>
                            <h3 className="text-lg font-medium text-neutral-900 mb-2">Không có chuyên khoa nào</h3>
                            <p className="text-neutral-600 mb-4">
                                {searchTerm ? 'Không tìm thấy chuyên khoa phù hợp với từ khóa tìm kiếm.' : 'Chưa có chuyên khoa nào được tạo.'}
                            </p>
                            {!searchTerm && (
                                <Button onClick={() => setIsCreateModalOpen(true)}>
                                    Thêm chuyên khoa đầu tiên
                                </Button>
                            )}
                        </CardBody>
                    </Card>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-6">
                        <div className="text-sm text-neutral-600">
                            Hiển thị {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, totalSpecialties)} trong tổng số {totalSpecialties} chuyên khoa
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

                {/* Create Specialty Modal */}
                <Modal
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    title="Thêm chuyên khoa mới"
                    size="lg"
                >
                    <ModalBody>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">
                                    Tên chuyên khoa <span className="text-error-500">*</span>
                                </label>
                                <Input
                                    type="text"
                                    placeholder="Nhập tên chuyên khoa"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">
                                    Mô tả
                                </label>
                                <textarea
                                    placeholder="Nhập mô tả chuyên khoa"
                                    className="form-input"
                                    rows={4}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">
                                    Hình ảnh (URL)
                                </label>
                                <Input
                                    type="url"
                                    placeholder="Nhập URL hình ảnh"
                                    value={formData.image}
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                />
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsCreateModalOpen(false)}
                        >
                            Hủy
                        </Button>
                        <Button onClick={handleCreateSpecialty}>
                            Tạo chuyên khoa
                        </Button>
                    </ModalFooter>
                </Modal>

                {/* Edit Specialty Modal */}
                <Modal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    title="Chỉnh sửa chuyên khoa"
                    size="lg"
                >
                    <ModalBody>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">
                                    Tên chuyên khoa <span className="text-error-500">*</span>
                                </label>
                                <Input
                                    type="text"
                                    placeholder="Nhập tên chuyên khoa"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">
                                    Mô tả
                                </label>
                                <textarea
                                    placeholder="Nhập mô tả chuyên khoa"
                                    className="form-input"
                                    rows={4}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">
                                    Hình ảnh (URL)
                                </label>
                                <Input
                                    type="url"
                                    placeholder="Nhập URL hình ảnh"
                                    value={formData.image}
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                />
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsEditModalOpen(false)}
                        >
                            Hủy
                        </Button>
                        <Button onClick={handleEditSpecialty}>
                            Cập nhật
                        </Button>
                    </ModalFooter>
                </Modal>
            </div>
        </div>
    );
}