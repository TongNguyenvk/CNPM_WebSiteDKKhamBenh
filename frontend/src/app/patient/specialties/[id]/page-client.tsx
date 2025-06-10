'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getSpecialtyById, getDoctorsBySpecialty } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';
import ErrorBoundary from '@/components/ErrorBoundary';

interface Specialty {
    id: number;
    name: string;
    description: string;
    image: string;
}

interface Doctor {
    id: number;
    firstName: string;
    lastName: string;
    image: string;
    specialtyData?: {
        name: string;
    };
}

function SpecialtyDetailContent() {
    const [specialty, setSpecialty] = useState<Specialty | null>(null);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const params = useParams();
    const specialtyId = parseInt(params.id as string);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError('');

                // Validate ID
                if (isNaN(specialtyId) || specialtyId <= 0) {
                    throw new Error('ID chuyên khoa không hợp lệ');
                }

                console.log('Fetching data for specialty ID:', specialtyId);

                const [specialtyData, doctorsData] = await Promise.all([
                    getSpecialtyById(specialtyId),
                    getDoctorsBySpecialty(specialtyId)
                ]);

                console.log('Specialty data:', specialtyData);
                console.log('Doctors data:', doctorsData);

                if (!specialtyData) {
                    throw new Error('Không tìm thấy thông tin chuyên khoa');
                }

                setSpecialty(specialtyData as Specialty);
                setDoctors(doctorsData as Doctor[]);
            } catch (err: unknown) {
                console.error('Error fetching data:', err);
                const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải thông tin chuyên khoa';
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [specialtyId]);

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
                    <div className="mt-4 space-x-4">
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            Thử lại
                        </button>
                        <Link
                            href="/patient/specialties"
                            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                        >
                            Quay lại
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (!specialty) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <p className="text-gray-600">Không tìm thấy thông tin chuyên khoa</p>
                    <Link
                        href="/patient/specialties"
                        className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Quay lại danh sách chuyên khoa
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 mt-6">
            <div className="max-w-4xl mx-auto">
                {/* Nút Quay lại */}
                <Link
                    href="/patient/specialties"
                    className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-full border-2 border-blue-500 hover:bg-gray-200 transition-colors mb-6"
                >
                    ← Quay lại
                </Link>

                {/* Thông tin chuyên khoa */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                    <div className="relative h-64">
                        <Image
                            src={`/${specialty.image}`}
                            alt={specialty.name}
                            fill
                            className="object-cover"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/images/default-specialty.jpg';
                            }}
                        />
                    </div>
                    <div className="p-6">
                        <h1 className="text-3xl font-bold mb-4">{specialty.name}</h1>
                        <div 
                            className="text-gray-600"
                            dangerouslySetInnerHTML={{ __html: specialty.description }}
                        />
                    </div>
                </div>

                {/* Danh sách bác sĩ */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-bold mb-6">Danh Sách Bác Sĩ</h2>
                    {doctors.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {doctors.map((doctor) => (
                                <Link
                                    key={doctor.id}
                                    href={`/patient/doctors/${doctor.id}`}
                                    className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <div className="relative w-16 h-16">
                                        <Image
                                            src={`/image/${doctor.image}`}
                                            alt={`${doctor.firstName} ${doctor.lastName}`}
                                            fill
                                            className="rounded-full object-cover"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.src = '/images/default-doctor.jpg';
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">
                                            {doctor.firstName} {doctor.lastName}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            {doctor.specialtyData?.name || specialty.name}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-gray-600 mb-4">Chưa có bác sĩ nào trong chuyên khoa này</p>
                            <Link
                                href="/patient/specialties"
                                className="text-blue-600 hover:text-blue-800"
                            >
                                Xem các chuyên khoa khác
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function SpecialtyDetailPage() {
    return (
        <ErrorBoundary>
            <SpecialtyDetailContent />
        </ErrorBoundary>
    );
}
