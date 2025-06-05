'use client';
import React, { useEffect, useState } from 'react';
import { getAllSpecialties } from '../../../lib/api';
import Link from 'next/link';
import Image from 'next/image';

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

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Đang tải...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="text-red-600 text-xl mb-4">⚠️</div>
                    <p className="text-red-600">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="mt-20 px-4">
            <h1 className="text-2xl font-bold text-center text-blue-600 mb-8">Danh Sách Chuyên Khoa</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {specialties.map((specialty) => (
                    <Link
                        key={specialty.id}
                        href={`/patient/specialties/${specialty.id}`}
                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                    >
                        <div className="relative h-48">
                            <Image
                                src={`/${specialty.image}`}
                                alt={specialty.name}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                        <div className="p-4">
                            <h2 className="text-xl font-semibold mb-2">{specialty.name}</h2>
                            <p className="text-gray-600 line-clamp-2">{specialty.description}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );

} 