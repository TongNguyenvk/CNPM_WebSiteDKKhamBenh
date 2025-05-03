'use client';
import React, { useEffect, useState } from 'react';
import { getSpecialtyById, getDoctorsBySpecialty } from '../../../../lib/api';
import Image from 'next/image';
import Link from 'next/link';

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

interface PageProps {
    params: {
        id: string;
    };
}

export default function SpecialtyDetailPage({ params }: PageProps) {
    const [specialty, setSpecialty] = useState<Specialty | null>(null);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const specialtyId = parseInt(params.id);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError('');

                const [specialtyData, doctorsData] = await Promise.all([
                    getSpecialtyById(specialtyId),
                    getDoctorsBySpecialty(specialtyId)
                ]);

                setSpecialty(specialtyData);
                setDoctors(doctorsData);
            } catch (err: Error) {
                console.error('Error fetching data:', err);
                setError(err.message || 'Có lỗi xảy ra khi tải thông tin chuyên khoa');
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

    if (!specialty) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <p className="text-gray-600">Không tìm thấy thông tin chuyên khoa</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 mt-12">
            <div className="max-w-4xl mx-auto">
                {/* Thông tin chuyên khoa */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                    <div className="relative h-64">
                        <Image
                            src={`/image/${specialty.image}`}
                            alt={specialty.name}
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="p-6">
                        <h1 className="text-3xl font-bold mb-4">{specialty.name}</h1>
                        <p className="text-gray-600">{specialty.description}</p>
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
                                        />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">
                                            {doctor.firstName} {doctor.lastName}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            {doctor.specialtyData?.name}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-600">Chưa có bác sĩ nào trong chuyên khoa này</p>
                    )}
                </div>
            </div>
        </div>
    );
}
