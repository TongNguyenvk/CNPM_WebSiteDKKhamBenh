import React from 'react';
import SpecialtyDetailClient from './SpecialtyDetailClient';
import ErrorBoundary from '@/components/ErrorBoundary';
import { BackButton } from "@/components/ui/BackButton";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function SpecialtyDetailPage({ params }: PageProps) {
    // Đợi params được resolve
    const { id } = await params;

    // Kiểm tra tính hợp lệ của ID
    const specialtyId = parseInt(id);
    if (!id || isNaN(specialtyId) || specialtyId <= 0) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="text-red-600 text-xl mb-4">⚠️</div>
                    <p className="text-red-600">ID chuyên khoa không hợp lệ</p>
                    <a
                        href="/patient/specialties"
                        className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Quay lại danh sách chuyên khoa
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 ">
            <div className="mb-4 ">
            </div>
            <ErrorBoundary>
                <SpecialtyDetailClient specialtyId={specialtyId} />
            </ErrorBoundary>
        </div>
    );
}
