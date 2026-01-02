'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { createBooking, getDoctorById, getScheduleById } from '@/lib/api';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { toast } from 'react-hot-toast';
import { getAvatarUrl } from '@/lib/utils';

interface Schedule {
    id: number;
    date: string;
    doctorId: number;
    timeType: string;
    maxNumber: number;
    currentNumber?: number;
    timeTypeData?: { valueVi: string };
}

interface Doctor {
    id: number;
    firstName: string;
    lastName: string;
    image?: string;
    Specialty?: { name: string };
    positionData?: { valueVi: string };
}

function BookAppointmentForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [doctor, setDoctor] = useState<Doctor | null>(null);
    const [schedule, setSchedule] = useState<Schedule | null>(null);

    const doctorId = searchParams.get('doctorId');
    const scheduleId = searchParams.get('scheduleId');
    const date = searchParams.get('date');
    const timeType = searchParams.get('timeType');

    useEffect(() => {
        const fetchData = async () => {
            if (!doctorId || !scheduleId) {
                toast.error('Thiếu thông tin cần thiết để đặt lịch');
                router.push('/patient/doctors');
                return;
            }

            try {
                const [doctorData, scheduleData] = await Promise.all([
                    getDoctorById(Number(doctorId)),
                    getScheduleById(Number(scheduleId))
                ]);
                setDoctor(doctorData);
                setSchedule(scheduleData);
            } catch (err) {
                toast.error('Có lỗi xảy ra khi tải thông tin');
                router.push('/patient/doctors');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [doctorId, scheduleId, router]);

    const handleSubmit = async () => {
        if (!doctorId || !scheduleId || !date || !timeType) {
            toast.error('Thiếu thông tin cần thiết để đặt lịch');
            return;
        }

        const userStr = localStorage.getItem('user');
        if (!userStr) {
            toast.error('Vui lòng đăng nhập để đặt lịch');
            router.push('/auth/login');
            return;
        }

        setSubmitting(true);
        try {
            const user = JSON.parse(userStr);
            await createBooking({
                statusId: 'S1',
                doctorId: Number(doctorId),
                patientId: user.userId,
                date: date,
                timeType: timeType
            });
            toast.success('Đặt lịch thành công!');
            setTimeout(() => router.push('/patient/appointments'), 1500);
        } catch (err: unknown) {
            const error = err as Error;
            toast.error(error.message || 'Có lỗi xảy ra khi đặt lịch');
        } finally {
            setSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!doctor || !schedule) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-500 mb-4">Không tìm thấy thông tin lịch khám</p>
                    <button
                        onClick={() => router.push('/patient/doctors')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Quay lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 border-b bg-white flex-shrink-0">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                    >
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Xác nhận đặt lịch</h1>
                        <p className="text-sm text-gray-500">Kiểm tra thông tin trước khi đặt lịch</p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-6">
                <div className="max-w-2xl mx-auto space-y-6">
                    {/* Doctor Info */}
                    <div className="bg-white rounded-xl border p-6">
                        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Thông tin bác sĩ</h2>
                        <div className="flex items-center gap-4">
                            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden">
                                {doctor.image ? (
                                    <Image
                                        src={getAvatarUrl(doctor.image)}
                                        alt=""
                                        width={80}
                                        height={80}
                                        className="w-20 h-20 rounded-full object-cover"
                                        unoptimized
                                    />
                                ) : (
                                    <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                )}
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    BS. {doctor.firstName} {doctor.lastName}
                                </h3>
                                <p className="text-gray-600">{doctor.positionData?.valueVi || 'Bác sĩ'}</p>
                                <span className="inline-block mt-1 px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                                    {doctor.Specialty?.name || 'Chưa có chuyên khoa'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Schedule Info */}
                    <div className="bg-white rounded-xl border p-6">
                        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Thông tin lịch khám</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-gray-50 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Ngày khám</p>
                                        <p className="font-semibold text-gray-900">
                                            {date ? format(new Date(date), 'EEEE, dd/MM/yyyy', { locale: vi }) : '-'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Giờ khám</p>
                                        <p className="font-semibold text-gray-900">
                                            {schedule.timeTypeData?.valueVi || timeType}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Notice */}
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                            <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <div>
                                <p className="font-medium text-amber-800">Lưu ý quan trọng</p>
                                <ul className="mt-1 text-sm text-amber-700 space-y-1">
                                    <li>• Vui lòng đến trước giờ hẹn 15 phút</li>
                                    <li>• Mang theo CMND/CCCD và thẻ BHYT (nếu có)</li>
                                    <li>• Lịch khám sẽ được xác nhận qua email</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4">
                        <button
                            onClick={() => router.back()}
                            className="flex-1 px-6 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition"
                        >
                            Quay lại
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {submitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    Đang xử lý...
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Xác nhận đặt lịch
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function BookAppointmentPage() {
    return (
        <Suspense fallback={
            <div className="h-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
        }>
            <BookAppointmentForm />
        </Suspense>
    );
}
