// app/doctor/[id]/page.tsx (hoặc đường dẫn tương ứng)
"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { getDoctorById, getDoctorSchedules, createBooking } from "@/app/lib/api"; // Đường dẫn tới file service

// --- Interfaces (Giữ nguyên) ---
// ... Doctor, Schedule, Specialty, Booking ...
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

interface Specialty {
    id?: number;
    name: string;
}

interface Doctor {
    id: number;
    email?: string;
    firstName: string;
    lastName: string;
    address?: string;
    phonenumber?: string;
    gender?: string;
    roleId?: string;
    positionId?: string;
    image: string;
    description?: string;
    contentHTML?: string;
    contentMarkdown?: string;
    clinicId?: number;
    specialtyId?: number;
    createdAt?: string;
    updatedAt?: string;
    Specialty?: Specialty;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface Booking {
    id: number;
    statusId: string;
    doctorId: number;
    patientId: number;
    date: string;
    timeType: string;
    token?: string;
    reason?: string;
    createdAt: string;
    updatedAt: string;
}


export default function DoctorDetailPage() {
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const id = params?.id;

    // State để lưu trạng thái đăng nhập, mặc định là chưa đăng nhập
    const [isLoggedIn, setIsLogin] = useState<boolean>(false);

    const [doctor, setDoctor] = useState<Doctor | null>(null);
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [dates, setDates] = useState<string[]>([]);
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [isLoadingSchedules, setIsLoadingSchedules] = useState<boolean>(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [isBooking, setIsBooking] = useState<boolean>(false);
    const [bookingError, setBookingError] = useState<string | null>(null);
    const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);
    const [generalError, setGeneralError] = useState<string | null>(null);

    // Effect để kiểm tra trạng thái đăng nhập khi component mount
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) setIsLogin(true);
    }, []);
    // Chạy một lần duy nhất khi component được tải

    // Effect để tạo danh sách ngày và fetch dữ liệu ban đầu
    useEffect(() => {
        setBookingError(null);
        setBookingSuccess(null);
        if (!id) {
            setGeneralError("Không tìm thấy ID bác sĩ.");
            return;
        };
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
                const doctorInfo = await getDoctorById(doctorId);
                setDoctor(doctorInfo);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (err: any) {
                console.error("Lỗi lấy dữ liệu ban đầu:", err);
                setGeneralError(err.message || "Không thể tải thông tin bác sĩ.");
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

    // --- Hàm xử lý Đặt lịch (sử dụng state isLoggedIn) ---
    const handleBookingClick = async (scheduleItem: Schedule) => {
        setBookingError(null);
        setBookingSuccess(null);
    
        // Kiểm tra trạng thái đăng nhập từ state
        if (!isLoggedIn) {
            setBookingError("Vui lòng đăng nhập để đặt lịch.");
            // Chuyển hướng đến trang đăng nhập, mang theo trang hiện tại để quay lại
            router.push(`/login?redirect=/doctor/${id}`);
            return;
        }
    
        if (!doctor) {
            setBookingError("Không tìm thấy thông tin bác sĩ.");
            return;
        }
    
        // Chuyển hướng đến trang BookingCare với các thông tin cần thiết
        router.push(`/bookingcare?doctorId=${doctor.id}&scheduleId=${scheduleItem.id}&date=${scheduleItem.date}&timeType=${scheduleItem.timeType}`);
    };


    // --- Phần Render JSX (giữ nguyên logic hiển thị dựa trên isLoggedIn) ---
    return (
        <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
            {/* 🔙 Nút Quay lại */}
            <button
                style={{
                    color: "black",
                    backgroundColor: "#f5f5f5", // 👈 màu nền nhạt hơn
                    padding: "10px 20px",
                    borderRadius: "100px",
                    border: "2px solid #306CD4",
                    cursor: "pointer",
                    marginBottom: "20px",
                    marginTop: "30px"
                }}
                onClick={() => router.back()} >
                ← Quay lại
            </button>

            {/* Thông tin bác sĩ */}
            {doctor && ( /* ... */
                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 p-4 border rounded-lg shadow-sm bg-white">
                    <div className="flex-shrink-0">
                        <Image
                            src={doctor.image ? `/${doctor.image}` : "/default-avatar.png"}
                            alt={`${doctor.firstName} ${doctor.lastName}`}
                            width={120}
                            height={120}
                            className="rounded-full object-cover border-2 border-gray-200"
                            priority
                        />
                    </div>
                    <div className="text-center sm:text-left">
                        <h1 className="text-2xl font-bold text-blue-700">
                            {doctor.firstName} {doctor.lastName}
                        </h1>
                        <p className="text-gray-600">{doctor.Specialty?.name || "Chưa cập nhật chuyên khoa"}</p>
                    </div>
                </div>
            )}
            {!doctor && !generalError && !isLoadingSchedules && <p className="text-center text-gray-500">Đang tải thông tin bác sĩ...</p>}

            {/* Chọn ngày */}
            <div className="p-4 border rounded-lg shadow-sm bg-white">
                {/* ... */}
                <label htmlFor="date-select" className="font-semibold block mb-2 text-gray-700">Chọn ngày khám:</label>
                <select
                    id="date-select"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full sm:w-auto border px-3 py-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    disabled={isLoadingSchedules || isBooking}
                >
                    {dates.map((date) => (
                        <option key={date} value={date}>
                            {new Date(date + 'T00:00:00').toLocaleDateString("vi-VN", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </option>
                    ))}
                </select>
            </div>

            {/* Hiển thị lỗi chung */}
            {generalError && ( /* ... */
                <div className="p-3 border border-red-300 bg-red-50 text-red-700 rounded-lg">
                    <p><strong>Lỗi:</strong> {generalError}</p>
                </div>
            )}
            {/* Hiển thị lỗi/thành công khi đặt lịch */}
            {bookingError && ( /* ... */
                <div className="mb-4 p-3 border border-red-300 bg-red-50 text-red-700 rounded-lg">
                    <p><strong>Lỗi đặt lịch:</strong> {bookingError}</p>
                </div>
            )}
            {bookingSuccess && ( /* ... */
                <div className="mb-4 p-3 border border-green-300 bg-green-50 text-green-700 rounded-lg">
                    <p><strong>Thành công:</strong> {bookingSuccess}</p>
                </div>
            )}

            {/* Hiển thị lịch khám */}
            <div className="p-4 border rounded-lg shadow-sm bg-white">
                <h2 className="text-xl font-semibold mb-4 text-blue-600">
                    Lịch khám ngày {selectedDate ? new Date(selectedDate + 'T00:00:00').toLocaleDateString("vi-VN", { day: 'numeric', month: 'numeric', year: 'numeric' }) : ''}
                </h2>
                {isLoadingSchedules ? ( /* ... */
                    <div className="text-center text-gray-500 py-4">Đang tải lịch khám...</div>
                ) : schedules.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {schedules.map((item) => {
                            const isAvailable = item.currentNumber !== undefined
                                ? item.currentNumber < item.maxNumber
                                : true;

                            return (
                                <div key={item.id}
                                    className={`p-3 border rounded-lg shadow-sm flex flex-col items-center justify-center text-center transition-colors duration-150 ${isAvailable ? 'bg-blue-50' : 'bg-gray-100'
                                        }`}
                                >
                                    <span className={`font-medium mb-2 ${isAvailable ? 'text-blue-800' : 'text-gray-500'}`}>
                                        {item.timeTypeData?.valueVi || `ID: ${item.id}`}
                                    </span>
                                    {/* Dùng state isLoggedIn để quyết định hiển thị nút nào */}
                                    {isLoggedIn ? (
                                        <button
                                            onClick={() => handleBookingClick(item)}
                                            disabled={!isAvailable || isLoadingSchedules || isBooking}
                                            className={`px-3 py-1 text-sm font-medium rounded-md transition-colors duration-150 w-full ${isAvailable
                                                ? 'bg-blue-500 hover:bg-blue-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'
                                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                } disabled:opacity-70 disabled:cursor-wait`}
                                        >
                                            {isBooking ? 'Đang xử lý...' : (isAvailable ? 'Đặt lịch' : 'Hết chỗ')}
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => router.push(`/login?redirect=/doctor/${id}`)}
                                            className="px-3 py-1 text-sm font-medium rounded-md bg-gray-500 hover:bg-gray-600 text-white transition-colors duration-150 w-full"
                                        >
                                            Đăng ký
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    !generalError && <p className="text-center text-gray-500 py-4">Không có lịch khám nào cho ngày này.</p>
                )}
            </div>
        </div>
    );
}