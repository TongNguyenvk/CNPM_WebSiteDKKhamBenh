'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getAllSpecialties } from '@/lib/api';
import { DataTable } from '@/components/ui';
import { toast } from 'react-hot-toast';
import { getSpecialtyImageUrl } from '@/lib/utils';

interface Specialty {
    id: number;
    name: string;
    description?: string;
    image?: string;
}

export default function SpecialtiesPage() {
    const router = useRouter();
    const [specialties, setSpecialties] = useState<Specialty[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    useEffect(() => {
        fetchSpecialties();
    }, []);

    const fetchSpecialties = async () => {
        try {
            setLoading(true);
            const data = await getAllSpecialties();
            setSpecialties(data);
        } catch (error) {
            toast.error('Lỗi khi tải danh sách chuyên khoa');
        } finally {
            setLoading(false);
        }
    };

    const filteredSpecialties = useMemo(() => {
        if (!searchTerm) return specialties;
        const search = searchTerm.toLowerCase();
        return specialties.filter(s =>
            s.name.toLowerCase().includes(search) ||
            s.description?.toLowerCase().includes(search)
        );
    }, [specialties, searchTerm]);

    const columns = useMemo(() => [
        {
            key: 'specialty', header: 'Chuyên khoa',
            render: (s: Specialty) => (
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {s.image ? (
                            <Image
                                src={getSpecialtyImageUrl(s.image)}
                                alt=""
                                width={48}
                                height={48}
                                className="w-12 h-12 rounded-lg object-cover"
                            />
                        ) : (
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        )}
                    </div>
                    <div>
                        <p className="font-medium text-gray-900">{s.name}</p>
                        <p className="text-sm text-gray-500 line-clamp-1">{s.description || 'Chưa có mô tả'}</p>
                    </div>
                </div>
            )
        },
        {
            key: 'actions', header: '', width: 'w-32',
            render: (s: Specialty) => (
                <button
                    onClick={() => router.push(`/patient/specialties/${s.id}`)}
                    className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition"
                >
                    Xem bác sĩ
                </button>
            )
        },
    ], [router]);

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
            <div className="px-6 py-4 border-b bg-white flex-shrink-0">
                <h1 className="text-xl font-bold text-gray-900">Chuyên khoa y tế</h1>
                <p className="text-sm text-gray-500 mt-1">Chọn chuyên khoa phù hợp với nhu cầu khám chữa bệnh</p>
            </div>

            {/* Stats */}
            <div className="px-6 py-4 bg-gray-50 border-b flex-shrink-0">
                <div className="bg-white rounded-xl p-4 border inline-flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-900">{specialties.length}</p>
                        <p className="text-sm text-gray-500">Chuyên khoa</p>
                    </div>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex items-center justify-between gap-4 px-6 py-3 border-b bg-white flex-shrink-0">
                <div className="relative flex-1 max-w-sm">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Tìm chuyên khoa..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-md transition ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
                    >
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-md transition ${viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
                    >
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-6">
                {filteredSpecialties.length === 0 ? (
                    <div className="text-center py-12">
                        <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <p className="text-gray-500">Không tìm thấy chuyên khoa nào</p>
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="mt-4 px-4 py-2 text-sm text-blue-600 hover:text-blue-700"
                            >
                                Xóa bộ lọc
                            </button>
                        )}
                    </div>
                ) : viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredSpecialties.map(specialty => (
                            <div
                                key={specialty.id}
                                onClick={() => router.push(`/patient/specialties/${specialty.id}`)}
                                className="bg-white rounded-xl border p-5 hover:shadow-md hover:border-blue-200 transition cursor-pointer group"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden group-hover:bg-blue-200 transition">
                                        {specialty.image ? (
                                            <Image
                                                src={getSpecialtyImageUrl(specialty.image)}
                                                alt=""
                                                width={56}
                                                height={56}
                                                className="w-14 h-14 rounded-xl object-cover"
                                            />
                                        ) : (
                                            <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                            </svg>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition">{specialty.name}</h3>
                                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{specialty.description || 'Chưa có mô tả'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-end mt-4 pt-4 border-t">
                                    <span className="text-sm text-blue-600 font-medium group-hover:text-blue-700 flex items-center gap-1">
                                        Xem bác sĩ
                                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-xl border overflow-hidden">
                        <DataTable
                            columns={columns}
                            data={filteredSpecialties}
                            keyField="id"
                            pageSize={10}
                            emptyMessage="Không tìm thấy chuyên khoa nào"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
