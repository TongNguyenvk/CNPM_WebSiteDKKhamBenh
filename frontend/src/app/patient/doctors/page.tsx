'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardBody, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LoadingPage } from '@/components/ui/loading';
import { cn } from '@/lib/utils';

interface Doctor {
    id: number;
    firstName: string;
    lastName: string;
    email?: string;
    image?: string;
    specialtyData?: {
        name: string;
    };
    positionData?: {
        valueVi: string;
    };
    description?: string;
    experience?: number;
}

export default function DoctorsPage() {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSpecialty, setSelectedSpecialty] = useState('');

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                setLoading(true);
                setError('');
                const response = await axios.get('http://localhost:8080/api/doctors');
                setDoctors(response.data.data || response.data);
            } catch (err: any) {
                setError(err.message || 'Lỗi khi tải danh sách bác sĩ');
            } finally {
                setLoading(false);
            }
        };

        fetchDoctors();
    }, []);

    const filteredDoctors = doctors.filter(doctor => {
        const matchesSearch = searchTerm === '' ||
            `${doctor.firstName} ${doctor.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doctor.specialtyData?.name.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesSpecialty = selectedSpecialty === '' ||
            doctor.specialtyData?.name === selectedSpecialty;

        return matchesSearch && matchesSpecialty;
    });

    const specialties = Array.from(new Set(doctors.map(d => d.specialtyData?.name).filter(Boolean)));

    if (loading) {
        return <LoadingPage text="Đang tải danh sách bác sĩ..." />;
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
                        Đội Ngũ Bác Sĩ
                    </h1>
                    <p className="text-neutral-600 max-w-2xl mx-auto">
                        Đội ngũ bác sĩ giàu kinh nghiệm, chuyên môn cao, luôn tận tâm
                        chăm sóc sức khỏe cho bệnh nhân.
                    </p>
                </div>

                {/* Search and Filter */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
                        {/* Search */}
                        <div className="flex-1">
                            <div className="relative">
                                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm bác sĩ theo tên hoặc chuyên khoa..."
                                    className="form-input pl-10"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Specialty Filter */}
                        <div className="md:w-64">
                            <select
                                className="form-select"
                                value={selectedSpecialty}
                                onChange={(e) => setSelectedSpecialty(e.target.value)}
                            >
                                <option value="">Tất cả chuyên khoa</option>
                                {specialties.map((specialty) => (
                                    <option key={specialty} value={specialty}>
                                        {specialty}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Results Count */}
                <div className="mb-6">
                    <p className="text-neutral-600 text-center">
                        Tìm thấy <span className="font-semibold text-neutral-900">{filteredDoctors.length}</span> bác sĩ
                        {searchTerm && ` cho "${searchTerm}"`}
                        {selectedSpecialty && ` trong chuyên khoa "${selectedSpecialty}"`}
                    </p>
                </div>

                {/* Doctors Grid */}
                {filteredDoctors.length === 0 ? (
                    <Card className="text-center py-16">
                        <CardBody>
                            <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-12 h-12 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                                Không tìm thấy bác sĩ nào
                            </h3>
                            <p className="text-neutral-600 mb-6">
                                Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc chuyên khoa.
                            </p>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setSearchTerm('');
                                    setSelectedSpecialty('');
                                }}
                            >
                                Xóa bộ lọc
                            </Button>
                        </CardBody>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredDoctors.map((doctor) => (
                            <DoctorCard key={doctor.id} doctor={doctor} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

// Doctor Card Component
interface DoctorCardProps {
    doctor: Doctor;
}

function DoctorCard({ doctor }: DoctorCardProps) {
    return (
        <Link href={`/patient/doctors/${doctor.id}`}>
            <Card hover className="h-full group">
                <CardBody className="p-6">
                    <div className="flex items-start space-x-4 mb-4">
                        <div className="relative">
                            {doctor.image ? (
                                <Image
                                    src={`http://localhost:8080/images/${doctor.image}`}
                                    alt={`${doctor.firstName} ${doctor.lastName}`}
                                    width={64}
                                    height={64}
                                    className="w-16 h-16 rounded-full object-cover"
                                    unoptimized
                                />
                            ) : (
                                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                                    <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                            )}
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success-500 rounded-full flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                        </div>

                        <div className="flex-1">
                            <h3 className="font-semibold text-lg text-neutral-900 group-hover:text-primary-600 transition-colors">
                                BS. {doctor.firstName} {doctor.lastName}
                            </h3>
                            {doctor.positionData?.valueVi && (
                                <p className="text-sm text-neutral-500 mb-1">
                                    {doctor.positionData.valueVi}
                                </p>
                            )}
                            {doctor.specialtyData?.name && (
                                <Badge variant="primary" size="sm">
                                    {doctor.specialtyData.name}
                                </Badge>
                            )}
                        </div>
                    </div>

                    {doctor.description && (
                        <p className="text-neutral-600 text-sm line-clamp-3 mb-4">
                            {doctor.description}
                        </p>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                        <div className="flex items-center space-x-4 text-sm text-neutral-500">
                            {doctor.experience && (
                                <div className="flex items-center space-x-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                    </svg>
                                    <span>{doctor.experience}+ năm</span>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center space-x-1 text-primary-600 group-hover:text-primary-700 transition-colors">
                            <span className="text-sm font-medium">Xem chi tiết</span>
                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </div>
                </CardBody>
            </Card>
        </Link>
    );
}