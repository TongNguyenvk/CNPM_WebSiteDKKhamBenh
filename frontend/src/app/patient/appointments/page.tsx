"use client";

import Image from 'next/image';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getPatientAppointments, cancelBooking } from "@/lib/api";
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge, StatusBadge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LoadingPage } from '@/components/ui/loading';
import { cn, formatDate, formatTime } from '@/lib/utils';

interface Appointment {
    id: number;
    date: string;
    timeType: string;
    statusId: string;
    patientId: number;
    doctorId: number;
    doctorData?: {
        firstName: string;
        lastName: string;
        email: string;
        image: string;
        specialtyData?: {
            name: string;
        };
    };
    statusData?: {
        keyMap: string;
        valueVi: string;
        valueEn: string;
    };
    timeTypeData?: {
        valueVi: string;
        valueEn?: string;
    };
}

export default function AppointmentsPage() {
    const router = useRouter();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const userStr = localStorage.getItem('user');
                if (!userStr) {
                    router.push('/auth/login');
                    return;
                }

                const user = JSON.parse(userStr);
                const patientId = user.userId;

                const data = await getPatientAppointments(patientId);
                setAppointments(data);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (err: any) {
                setError(err.message || "Có lỗi xảy ra khi tải danh sách lịch khám");
            } finally {
                setIsLoading(false);
            }
        };

        fetchAppointments();
    }, [router]);

    const handleCancelAppointment = async (appointmentId: number) => {
        if (!window.confirm("Bạn có chắc chắn muốn hủy lịch khám này?")) {
            return;
        }

        try {
            setError(null);
            setSuccess(null);
            await cancelBooking(appointmentId);
            setSuccess("Hủy lịch khám thành công!");

            // Cập nhật lại danh sách
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                const patientId = user.userId;
                const data = await getPatientAppointments(patientId);
                setAppointments(data);
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setError(err.message || "Có lỗi xảy ra khi hủy lịch khám");
        }
    };

    const handleConfirmCancel = async (appointmentId: number) => {
        const confirmed = window.confirm("Bạn có chắc chắn muốn hủy lịch khám này?");
        if (confirmed) {
            await handleCancelAppointment(appointmentId);
        }
    };

    const getAppointmentsByStatus = () => {
        const upcoming = appointments.filter(apt =>
            new Date(apt.date) >= new Date() && apt.statusId !== 'S3'
        );
        const past = appointments.filter(apt =>
            new Date(apt.date) < new Date() || apt.statusId === 'S3' || apt.statusId === 'S4'
        );
        return { upcoming, past };
    };

    if (isLoading) {
        return <LoadingPage text="Đang tải danh sách lịch khám..." />;
    }

    const { upcoming, past } = getAppointmentsByStatus();

    return (
        <div className="min-h-screen bg-neutral-50">
            <div className="container py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-neutral-900 mb-2">
                        Lịch Khám Của Tôi
                    </h1>
                    <p className="text-neutral-600">
                        Quản lý và theo dõi các lịch khám của bạn
                    </p>
                </div>

                {/* Alerts */}
                {error && (
                    <div className="mb-6 p-4 bg-error-50 border border-error-200 text-error-700 rounded-xl">
                        <div className="flex items-center space-x-2">
                            <svg className="w-5 h-5 text-error-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <span>{error}</span>
                        </div>
                    </div>
                )}

                {success && (
                    <div className="mb-6 p-4 bg-success-50 border border-success-200 text-success-700 rounded-xl">
                        <div className="flex items-center space-x-2">
                            <svg className="w-5 h-5 text-success-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>{success}</span>
                        </div>
                    </div>
                )}

                {appointments.length === 0 ? (
                    <Card className="text-center py-16">
                        <CardBody>
                            <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-12 h-12 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                                Chưa có lịch khám nào
                            </h3>
                            <p className="text-neutral-600 mb-6">
                                Bạn chưa đặt lịch khám nào. Hãy đặt lịch để được chăm sóc sức khỏe tốt nhất.
                            </p>
                            <Button onClick={() => router.push('/patient/specialties')}>
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Đặt lịch khám ngay
                            </Button>
                        </CardBody>
                    </Card>
                ) : (
                    <div className="space-y-8">
                        {/* Upcoming Appointments */}
                        {upcoming.length > 0 && (
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-semibold text-neutral-900">
                                        Lịch Khám Sắp Tới ({upcoming.length})
                                    </h2>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => router.push('/patient/specialties')}
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        Đặt thêm lịch
                                    </Button>
                                </div>
                                <div className="grid gap-6">
                                    {upcoming.map((appointment) => (
                                        <AppointmentCard
                                            key={appointment.id}
                                            appointment={appointment}
                                            onCancel={handleConfirmCancel}
                                            isUpcoming={true}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Past Appointments */}
                        {past.length > 0 && (
                            <div>
                                <h2 className="text-xl font-semibold text-neutral-900 mb-6">
                                    Lịch Sử Khám ({past.length})
                                </h2>
                                <div className="grid gap-4">
                                    {past.map((appointment) => (
                                        <AppointmentCard
                                            key={appointment.id}
                                            appointment={appointment}
                                            onCancel={handleConfirmCancel}
                                            isUpcoming={false}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

// Appointment Card Component
interface AppointmentCardProps {
    appointment: Appointment;
    onCancel: (id: number) => void;
    isUpcoming: boolean;
}

function AppointmentCard({ appointment, onCancel, isUpcoming }: AppointmentCardProps) {
    const appointmentDate = new Date(appointment.date);
    const isToday = appointmentDate.toDateString() === new Date().toDateString();
    const isTomorrow = appointmentDate.toDateString() === new Date(Date.now() + 86400000).toDateString();

    const getDateLabel = () => {
        if (isToday) return "Hôm nay";
        if (isTomorrow) return "Ngày mai";
        return formatDate(appointment.date);
    };

    return (
        <Card className={cn(
            "transition-all duration-200",
            isUpcoming ? "border-l-4 border-l-primary-500" : "opacity-75"
        )}>
            <CardBody className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    {/* Doctor Info */}
                    <div className="flex items-start space-x-4">
                        <div className="relative">
                            {appointment.doctorData?.image ? (
                                <Image
                                    src={`http://localhost:8080/images/${appointment.doctorData.image}`}
                                    alt={`${appointment.doctorData?.firstName || ''} ${appointment.doctorData?.lastName || ''}`}
                                    width={64}
                                    height={64}
                                    className="w-16 h-16 rounded-full object-cover"
                                    unoptimized
                                />
                            ) : (
                                <div className="w-16 h-16 bg-neutral-200 rounded-full flex items-center justify-center">
                                    <svg className="w-8 h-8 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                            )}
                            {isToday && (
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary-500 rounded-full flex items-center justify-center">
                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                </div>
                            )}
                        </div>

                        <div className="flex-1">
                            <h3 className="font-semibold text-lg text-neutral-900">
                                BS. {appointment.doctorData?.firstName} {appointment.doctorData?.lastName}
                            </h3>
                            <p className="text-neutral-600 mb-3">
                                {appointment.doctorData?.specialtyData?.name || 'Chưa có thông tin chuyên khoa'}
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="flex items-center space-x-2 text-sm">
                                    <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span className="text-neutral-600">
                                        <span className="font-medium">{getDateLabel()}</span>
                                    </span>
                                </div>

                                <div className="flex items-center space-x-2 text-sm">
                                    <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-neutral-600">
                                        <span className="font-medium">{appointment.timeTypeData?.valueVi || appointment.timeType}</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Status and Actions */}
                    <div className="flex flex-col items-end space-y-3">
                        <StatusBadge status={appointment.statusId} />

                        {appointment.statusId === 'S1' && isUpcoming && (
                            <Button
                                variant="error"
                                size="sm"
                                onClick={() => onCancel(appointment.id)}
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Hủy lịch
                            </Button>
                        )}

                        {appointment.statusId === 'S2' && isUpcoming && (
                            <div className="text-center">
                                <Badge variant="success" size="sm">
                                    Đã xác nhận
                                </Badge>
                                <p className="text-xs text-neutral-500 mt-1">
                                    Vui lòng đến đúng giờ
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </CardBody>
        </Card>
    );
}