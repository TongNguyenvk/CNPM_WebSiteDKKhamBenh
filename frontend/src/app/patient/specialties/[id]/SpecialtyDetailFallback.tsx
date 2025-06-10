'use client';

import React from 'react';
import Link from 'next/link';

interface SpecialtyDetailFallbackProps {
    specialtyId: number;
    error?: string;
}

export default function SpecialtyDetailFallback({ specialtyId, error }: SpecialtyDetailFallbackProps) {
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

                {/* Error message */}
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <div className="text-red-600 text-6xl mb-4">⚠️</div>
                    <h1 className="text-2xl font-bold mb-4 text-gray-800">
                        Không thể tải thông tin chuyên khoa
                    </h1>
                    <p className="text-gray-600 mb-6">
                        {error || `Có lỗi xảy ra khi tải thông tin chuyên khoa ID: ${specialtyId}`}
                    </p>
                    
                    <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => window.location.reload()}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Thử lại
                            </button>
                            <Link
                                href="/patient/specialties"
                                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-center"
                            >
                                Quay lại danh sách chuyên khoa
                            </Link>
                        </div>
                        
                        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                            <h3 className="font-semibold mb-2">Gợi ý:</h3>
                            <ul className="text-sm text-gray-600 space-y-1">
                                <li>• Kiểm tra kết nối internet</li>
                                <li>• Thử tải lại trang</li>
                                <li>• Liên hệ hỗ trợ nếu vấn đề vẫn tiếp tục</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
