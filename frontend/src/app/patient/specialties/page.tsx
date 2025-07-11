'use client';
import React, { useEffect, useState } from 'react';
import { getAllSpecialties } from '../../../lib/api';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardBody, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingPage } from '@/components/ui/loading';
import { cn } from '@/lib/utils';

interface Specialty {
    id: number;
    name: string;
    description: string;
    image: string;
}

export default function SpecialtiesPage() {
    const [specialties, setSpecialties] = useState<Specialty[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<string>('name');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage] = useState<number>(9);

    useEffect(() => {
        const fetchSpecialties = async () => {
            try {
                setLoading(true);
                setError('');
                const data = await getAllSpecialties();
                setSpecialties(data as any);
            } catch (error: unknown) {
                const err = error as Error;
                setError(err.message || 'Lỗi khi tải danh sách chuyên khoa');
            } finally {
                setLoading(false);
            }
        };

        fetchSpecialties();
    }, []);

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
                case 'description':
                    aValue = a.description || '';
                    bValue = b.description || '';
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

    const specialtiesToDisplay = getPaginatedSpecialties();
    const totalSpecialties = getFilteredSpecialties().length;
    const totalPages = getTotalPages();

    if (loading) {
        return <LoadingPage text="Đang tải danh sách chuyên khoa..." />;
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-50">
                <Card className="max-w-md mx-4">
                    <CardBody className="text-center py-8">
                        <div className="w-16 h-16 bg-error-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-error-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
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

    return (
        <div className="min-h-screen bg-neutral-50">
            <div className="container py-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-neutral-900 mb-4">
                        Chuyên khoa y tế
                    </h1>
                    <p className="text-neutral-600 max-w-2xl mx-auto">
                        Chọn chuyên khoa phù hợp với nhu cầu khám chữa bệnh của bạn.
                        Đội ngũ bác sĩ chuyên môn cao sẵn sàng phục vụ.
                    </p>
                </div>

                {/* Search and Filter */}
                <Card className="mb-8">
                    <CardBody className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                            {/* Search */}
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">
                                    Tìm kiếm chuyên khoa
                                </label>
                                <div className="relative">
                                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    <input
                                        type="text"
                                        placeholder="Tìm theo tên, mô tả..."
                                        className="form-input pl-10"
                                        value={searchTerm}
                                        onChange={(e) => {
                                            setSearchTerm(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                    />
                                    {searchTerm && (
                                        <button
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                                            onClick={() => {
                                                setSearchTerm('');
                                                setCurrentPage(1);
                                            }}
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    )}
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
                                    <option value="name">Tên chuyên khoa</option>
                                    <option value="description">Mô tả</option>
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
                                    {sortOrder === 'asc' ? '↑ A-Z' : '↓ Z-A'}
                                </button>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="mt-4 text-sm text-neutral-600">
                            Hiển thị {specialtiesToDisplay.length} trong tổng số {totalSpecialties} chuyên khoa
                        </div>
                    </CardBody>
                </Card>

                {/* Kết quả tìm kiếm */}
                {searchTerm && (
                    <div className="mb-6">
                        <p className="text-neutral-600 text-center">
                            Tìm thấy <span className="font-semibold text-neutral-900">{filteredSpecialties.length}</span> chuyên khoa
                            {searchTerm && ` cho "${searchTerm}"`}
                        </p>
                    </div>
                )}

                {/* Specialties Grid */}
                {specialtiesToDisplay.length === 0 ? (
                    <Card className="text-center py-16">
                        <CardBody>
                            <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-12 h-12 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                                {searchTerm ? "Không tìm thấy chuyên khoa nào" : "Chưa có chuyên khoa nào"}
                            </h3>
                            <p className="text-neutral-600 mb-6">
                                {searchTerm ? "Thử tìm kiếm với từ khóa khác." : "Hiện tại chưa có chuyên khoa nào được cập nhật."}
                            </p>
                            {searchTerm && (
                                <Button
                                    variant="outline"
                                    onClick={() => setSearchTerm('')}
                                >
                                    Xóa bộ lọc
                                </Button>
                            )}
                        </CardBody>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {specialtiesToDisplay.map((specialty) => (
                            <SpecialtyCard key={specialty.id} specialty={specialty} />
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-8">
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
            </div>
        </div>
    );
}

// Specialty Card Component
interface SpecialtyCardProps {
    specialty: Specialty;
}

function SpecialtyCard({ specialty }: SpecialtyCardProps) {
    return (
        <Link href={`/patient/specialties/${specialty.id}`}>
            <Card hover className="h-full group">
                <div className="relative h-48 overflow-hidden">
                    <Image
                        src={`/${specialty.image}`}
                        alt={specialty.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-white font-semibold text-lg mb-1">
                            {specialty.name}
                        </h3>
                    </div>
                </div>
                <CardBody className="p-6">
                    <p className="text-neutral-600 text-sm line-clamp-3 mb-4">
                        {specialty.description}
                    </p>
                    <div className="flex items-center justify-between">
                        <span className="text-primary-600 font-medium text-sm group-hover:text-primary-700 transition-colors">
                            Xem chi tiết
                        </span>
                        <svg className="w-4 h-4 text-primary-600 group-hover:text-primary-700 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </CardBody>
            </Card>
        </Link>
    );
}
