'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { getBookingById, cancelBooking } from '@/lib/api';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LoadingPage } from '@/components/ui/loading';
import { BackButton } from '@/components/ui/BackButton';
import { toast } from 'react-hot-toast';

interface Appointment {
    id: number;
    statusId: string;
    date: string;
    timeType: string;
    doctorId: number;
    patientId: number;
    createdAt?: string;
    updatedAt?: string;
    doctorData?: {
        id: number;
        firstName: string;
        lastName: string;
        email?: string;
        image?: string;
        specialtyData?: {
            id: number;
            name: string;
            description?: string;
        };
        positionData?: {
            valueVi: string;
        };
    };
    patientData?: {
        id: number;
        firstName: string;
        lastName: string;
        email?: string;
        phoneNumber?: string;
        address?: string;
        gender?: boolean;
    };
    timeTypeData?: {
        keyMap: string;
        valueVi: string;
        valueEn: string;
    };
    statusData?: {
        keyMap: string;
        valueVi: string;
        valueEn: string;
    };
}

function StatusBadge({ status }: { status: string }) {
    const getStatusInfo = (status: string) => {
        switch (status) {
            case 'S1':
                return { label: 'Chờ xác nhận', variant: 'warning' as const };
            case 'S2':
                return { label: 'Đã xác nhận', variant: 'success' as const };
            case 'S3':
                return { label: 'Đã hoàn thành', variant: 'success' as const };
            case 'S4':
                return { label: 'Đã hủy', variant: 'error' as const };
            default:
                return { label: 'Không xác định', variant: 'default' as const };
        }
    };

    const { label, variant } = getStatusInfo(status);
    return <Badge variant={variant}>{label}</Badge>;
}

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatDateTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN');
}

export default function AppointmentDetailPage() {
    const router = useRouter();
    const params = useParams();
    const [appointment, setAppointment] = useState<Appointment | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [cancelling, setCancelling] = useState(false);

    const appointmentId = params?.id ? Number(params.id) : null;

    useEffect(() => {
        if (!appointmentId || isNaN(appointmentId)) {
            setError('ID lịch khám không hợp lệ');
            setLoading(false);
            return;
        }

        const fetchAppointment = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getBookingById(appointmentId);
                setAppointment(data);
            } catch (err: any) {
                setError(err.message || 'Lỗi khi tải chi tiết lịch khám');
            } finally {
                setLoading(false);
            }
        };

        fetchAppointment();
    }, [appointmentId]);

    const handleCancelAppointment = async () => {
        if (!appointment) return;

        if (!window.confirm("Bạn có chắc chắn muốn hủy lịch khám này?")) {
            return;
        }

        try {
            setCancelling(true);
            await cancelBooking(appointment.id);
            toast.success("Hủy lịch khám thành công!");

            // Cập nhật trạng thái local
            setAppointment(prev => prev ? { ...prev, statusId: 'S4' } : null);
        } catch (err: any) {
            toast.error(err.message || "Có lỗi xảy ra khi hủy lịch khám");
        } finally {
            setCancelling(false);
        }
    };

    if (loading) {
        return <LoadingPage />;
    }

    if (error || !appointment) {
        return (
            <div className="max-w-4xl mx-auto p-4">
                <BackButton />
                <Card className="mt-4">
                    <CardBody className="text-center py-12">
                        <div className="text-red-600 text-xl mb-4">⚠️</div>
                        <p className="text-red-600 mb-4">{error || 'Không tìm thấy lịch khám'}</p>
                        <Button onClick={() => router.push('/patient/appointments')}>
                            Quay lại danh sách lịch khám
                        </Button>
                    </CardBody>
                </Card>
            </div>
        );
    }

    const appointmentDate = new Date(appointment.date);
    const isUpcoming = appointmentDate >= new Date() && appointment.statusId !== 'S3' && appointment.statusId !== 'S4';
    const canCancel = appointment.statusId === 'S1' && isUpcoming;

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-6">
            <BackButton />

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>Chi tiết lịch khám</span>
                        <StatusBadge status={appointment.statusId} />
                    </CardTitle>
                </CardHeader>
                <CardBody className="space-y-6">
                    {/* Thông tin bác sĩ */}
                    <div className="border-b pb-6">
                        <h3 className="text-lg font-semibold mb-4">Thông tin bác sĩ</h3>
                        <div className="flex items-start space-x-4">
                            <div className="relative">
                                {appointment.doctorData?.image ? (
                                    <Image
                                        src={`http://localhost:8080/images/${appointment.doctorData.image}`}
                                        alt={`${appointment.doctorData?.firstName || ''} ${appointment.doctorData?.lastName || ''}`}
                                        width={80}
                                        height={80}
                                        className="w-20 h-20 rounded-full object-cover"
                                        unoptimized
                                    />
                                ) : (
                                    <div className="w-20 h-20 bg-neutral-200 rounded-full flex items-center justify-center">
                                        <span className="text-neutral-600 text-xl font-medium">
                                            {appointment.doctorData?.firstName?.charAt(0)}{appointment.doctorData?.lastName?.charAt(0)}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <h4 className="text-xl font-semibold text-neutral-900">
                                    {appointment.doctorData?.positionData?.valueVi} {appointment.doctorData?.firstName} {appointment.doctorData?.lastName}
                                </h4>
                                <p className="text-primary-600 font-medium">
                                    {appointment.doctorData?.specialtyData?.name}
                                </p>
                                {appointment.doctorData?.email && (
                                    <p className="text-neutral-600 text-sm">
                                        Email: {appointment.doctorData.email}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Thông tin lịch khám */}
                    <div className="border-b pb-6">
                        <h3 className="text-lg font-semibold mb-4">Thông tin lịch khám</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-neutral-600">Ngày khám</p>
                                <p className="font-medium">{formatDate(appointment.date)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-neutral-600">Giờ khám</p>
                                <p className="font-medium">{appointment.timeTypeData?.valueVi || appointment.timeTypeData?.valueEn}</p>
                            </div>
                            <div>
                                <p className="text-sm text-neutral-600">Trạng thái</p>
                                <StatusBadge status={appointment.statusId} />
                            </div>
                            <div>
                                <p className="text-sm text-neutral-600">Mã lịch khám</p>
                                <p className="font-medium">#{appointment.id}</p>
                            </div>
                        </div>
                    </div>

                    {/* Thông tin thời gian tạo */}
                    {appointment.createdAt && (
                        <div className="border-b pb-6">
                            <h3 className="text-lg font-semibold mb-4">Thông tin đặt lịch</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-neutral-600">Thời gian đặt</p>
                                    <p className="font-medium">{formatDateTime(appointment.createdAt)}</p>
                                </div>
                                {appointment.updatedAt && appointment.updatedAt !== appointment.createdAt && (
                                    <div>
                                        <p className="text-sm text-neutral-600">Cập nhật lần cuối</p>
                                        <p className="font-medium">{formatDateTime(appointment.updatedAt)}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-end">
                        {canCancel && (
                            <Button
                                variant="error"
                                onClick={handleCancelAppointment}
                                disabled={cancelling}
                            >
                                {cancelling ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Đang hủy...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        Hủy lịch khám
                                    </>
                                )}
                            </Button>
                        )}

                        <Button
                            variant="outline"
                            onClick={() => router.push('/patient/appointments')}
                        >
                            Quay lại danh sách
                        </Button>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}
