"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { getDoctorById, getDoctorSchedules } from "@/lib/api";

interface Schedule {
    id: number;
    date: string;
    doctorId: number;
    timeType: string;
    maxNumber: number;
    currentNumber?: number;
    createdAt?: string;
    updatedAt?: string;
    timeTypeData?: {
        valueVi: string;
        valueEn?: string;
    };
}

interface Doctor {
    id: number;
    email?: string;
    firstName: string;
    lastName: string;
    address?: string;
    phoneNumber?: string;
    gender?: boolean;
    roleId?: string;
    positionId?: string;
    image?: string;
    specialtyId?: number;
    createdAt?: string;
    updatedAt?: string;
    doctorDetail?: {
        descriptionMarkdown?: string;
        descriptionHTML?: string;
    } | null;
    Specialty?: {
        id: number;
        name: string;
    };
    specialtyData?: {
        id: number;
        name: string;
        description?: string;
    };
    positionData?: {
        keyMap: string;
        valueVi: string;
        valueEn: string;
    };
}

export default function DoctorDetailPage() {
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const id = params?.id;

    // State để lưu trạng thái đăng nhập
    const [isLoggedIn, setIsLogin] = useState<boolean>(false);

    const [doctor, setDoctor] = useState<Doctor | null>(null);
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [dates, setDates] = useState<string[]>([]);
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [isLoadingSchedules, setIsLoadingSchedules] = useState<boolean>(false);
    const [bookingError, setBookingError] = useState<string | null>(null);
    const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);
    const [generalError, setGeneralError] = useState<string | null>(null);

    // Effect để kiểm tra trạng thái đăng nhập
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) setIsLogin(true);
    }, []);

    // Effect để tạo danh sách ngày và fetch dữ liệu ban đầu
    useEffect(() => {
        setBookingError(null);
        setBookingSuccess(null);
        if (!id) {
            setGeneralError("Không tìm thấy ID bác sĩ.");
            return;
        }
        const doctorId = Number(id);
        if (isNaN(doctorId)) {
            setGeneralError("ID bác sĩ không hợp lệ.");
            return;
        }

        const today = new Date();
        const nextDays = Array.from({ length: 4 }, (_, i) => {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            return date.toISOString().split("T")[0];
        });
        setDates(nextDays);
        const initialDate = nextDays[0];
        setSelectedDate(initialDate);

        const fetchInitialData = async () => {
            setGeneralError(null);
            try {
                const response = await getDoctorById(Number(id));
                console.log('Doctor API response:', response);
                console.log('Specialty data:', response?.Specialty);
                console.log('SpecialtyData:', response?.specialtyData);
                setDoctor(response);
            } catch (error: unknown) {
                const err = error as Error;
                setGeneralError(err.message || 'Lỗi khi tải thông tin bác sĩ');
                setDoctor(null);
                setSchedules([]);
            }
        };
        fetchInitialData();
    }, [id]);

    // Effect để fetch lịch khi selectedDate hoặc id thay đổi
    useEffect(() => {
        setBookingError(null);
        setBookingSuccess(null);
        if (!id || !selectedDate) return;
        const doctorId = Number(id);
        if (isNaN(doctorId)) return;

        const fetchSchedulesForDate = async () => {
            setIsLoadingSchedules(true);
            setGeneralError(null);
            try {
                const scheduleData = await getDoctorSchedules(doctorId, selectedDate);
                setSchedules(scheduleData);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (err: any) {
                console.error(`Lỗi khi fetch lịch cho ngày ${selectedDate}:`, err);
                setGeneralError(err.message || `Không thể tải lịch khám cho ngày ${selectedDate}.`);
                setSchedules([]);
            } finally {
                setIsLoadingSchedules(false);
            }
        };
        fetchSchedulesForDate();
    }, [selectedDate, id]);

    // Hàm xử lý đặt lịch
    const handleBookingClick = async (scheduleItem: Schedule) => {
        setBookingError(null);
        setBookingSuccess(null);

        if (!isLoggedIn) {
            setBookingError("Vui lòng đăng nhập để đặt lịch.");
            router.push(`/auth/login?redirect=/patient/doctors/${id}`);
            return;
        }

        if (!doctor) {
            setBookingError("Không tìm thấy thông tin bác sĩ.");
            return;
        }

        router.push(`/patient/book_appointment?doctorId=${doctor.id}&scheduleId=${scheduleItem.id}&date=${scheduleItem.date}&timeType=${scheduleItem.timeType}`);
    };

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
            {/* Nút Quay lại */}
            <button
                className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-full border-2 border-blue-500 hover:bg-gray-200 transition-colors"
                onClick={() => router.back()}
            >
                ← Quay lại
            </button>

            {/* Thông tin bác sĩ */}
            {doctor && (
                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 p-4 border rounded-lg shadow-sm bg-white">
                    <div className="flex-shrink-0">
                        <Image
                            src={doctor.image ? `http://localhost:8080/images/${doctor.image}` : "/images/default-doctor.jpg"}
                            alt={`${doctor.firstName} ${doctor.lastName}`}
                            width={120}
                            height={120}
                            className="rounded-full object-cover border-2 border-gray-200"
                            priority
                        />
                    </div>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold text-blue-700">
                            {doctor.firstName} {doctor.lastName}
                        </h1>
                        <div className="mt-2 space-y-2">
                            <p className="text-gray-600">
                                <span className="font-semibold">Chuyên khoa:</span> {doctor.specialtyData?.name || doctor.Specialty?.name || "Chưa cập nhật"}
                            </p>
                            <p className="text-gray-600">
                                <span className="font-semibold">Vị trí:</span> {doctor.positionData?.valueVi || "Chưa cập nhật"}
                            </p>
                            <p className="text-gray-600">
                                <span className="font-semibold">Địa chỉ:</span> {doctor.address || "Chưa cập nhật"}
                            </p>
                            <p className="text-gray-600">
                                <span className="font-semibold">Số điện thoại:</span> {doctor.phoneNumber || "Chưa cập nhật"}
                            </p>
                            <p className="text-gray-600">
                                <span className="font-semibold">Email:</span> {doctor.email || "Chưa cập nhật"}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Mô tả chi tiết */}
            {doctor && (
                <div className="p-4 border rounded-lg shadow-sm bg-white">
                    <h2 className="text-xl font-semibold mb-4">Thông tin chi tiết</h2>
                    <div className="space-y-4">


                        {/* Hiển thị mô tả HTML */}
                        {doctor.doctorDetail?.descriptionHTML && (
                            <div className="prose max-w-none">
                                <h3 className="text-lg font-medium text-gray-800 mb-2">Giới thiệu</h3>
                                <div
                                    className="text-gray-600"
                                    dangerouslySetInnerHTML={{ __html: doctor.doctorDetail.descriptionHTML }}
                                />
                            </div>
                        )}

                        {/* Hiển thị mô tả Markdown */}
                        {doctor.doctorDetail?.descriptionMarkdown && (
                            <div className="prose max-w-none">
                                <h3 className="text-lg font-medium text-gray-800 mb-2">Thông tin bổ sung</h3>
                                <div className="text-gray-600 whitespace-pre-wrap">
                                    {doctor.doctorDetail.descriptionMarkdown}
                                </div>
                            </div>
                        )}

                        {(!doctor.doctorDetail || (!doctor.doctorDetail.descriptionHTML && !doctor.doctorDetail.descriptionMarkdown)) && (
                            <p className="text-gray-500 italic">Chưa có thông tin chi tiết</p>
                        )}
                    </div>
                </div>
            )}

            {!doctor && !generalError && !isLoadingSchedules && (
                <p className="text-center text-gray-500">Đang tải thông tin bác sĩ...</p>
            )}

            {/* Chọn ngày */}
            <div className="p-4 border rounded-lg shadow-sm bg-white">
                <label htmlFor="date-select" className="font-semibold block mb-2 text-gray-700">
                    Chọn ngày khám:
                </label>
                <select
                    id="date-select"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full sm:w-auto border px-3 py-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    disabled={isLoadingSchedules}
                >
                    {dates.map((date) => (
                        <option key={date} value={date}>
                            {new Date(date + 'T00:00:00').toLocaleDateString("vi-VN", {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </option>
                    ))}
                </select>
            </div>

            {/* Hiển thị lỗi chung */}
            {generalError && (
                <div className="p-3 border border-red-300 bg-red-50 text-red-700 rounded-lg">
                    <p><strong>Lỗi:</strong> {generalError}</p>
                </div>
            )}

            {/* Hiển thị lỗi/thành công khi đặt lịch */}
            {bookingError && (
                <div className="mb-4 p-3 border border-red-300 bg-red-50 text-red-700 rounded-lg">
                    <p><strong>Lỗi:</strong> {bookingError}</p>
                </div>
            )}

            {bookingSuccess && (
                <div className="mb-4 p-3 border border-green-300 bg-green-50 text-green-700 rounded-lg">
                    <p><strong>Thành công:</strong> {bookingSuccess}</p>
                </div>
            )}

            {/* Lịch khám */}
            <div className="p-4 border rounded-lg shadow-sm bg-white">
                <h2 className="text-xl font-semibold mb-4">Lịch khám</h2>
                {isLoadingSchedules ? (
                    <p className="text-center text-gray-500">Đang tải lịch khám...</p>
                ) : schedules.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {schedules.map((schedule) => (
                            <div
                                key={schedule.id}
                                className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                                onClick={() => handleBookingClick(schedule)}
                            >
                                <p className="font-medium">{schedule.timeTypeData?.valueVi}</p>
                                <p className="text-sm text-gray-600">
                                    Số lượng: {schedule.currentNumber || 0}/{schedule.maxNumber}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500">Không có lịch khám cho ngày này</p>
                )}
            </div>
        </div>
    );
} 