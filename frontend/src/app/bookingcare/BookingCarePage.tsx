// app/bookingcare/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { getDoctorById, getDoctorScheduleById, createBooking, getUserProfile } from "@/app/lib/api";
import { useUser } from "../lib/UserContext";

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  address?: string;
  phonenumber?: string;
  gender?: string;
}

interface Doctor {
  id: number;
  firstName: string;
  lastName: string;
  image: string;
  Specialty?: {
    name: string;
  };
}

interface Schedule {
  id: number;
  date: string;
  timeType: string;
  maxNumber: number;
  currentNumber: number;
  timeTypeData?: {
    valueVi: string;
    valueEn?: string;
  };
}

export interface BookingPayload {
  userId: number;
  doctorId: number;
  scheduleId: number;
  date: string;
  timeType: string;
  reason?: string;
}

export default function BookingCarePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const doctorId = searchParams.get("doctorId");
  const scheduleId = searchParams.get("scheduleId");
  const date = searchParams.get("date");
  const timeType = searchParams.get("timeType");

  const [user, setUser] = useState<User | null>(null);
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { roleId } = useUser();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push(`/login?redirect=/bookingcare?doctorId=${doctorId}&scheduleId=${scheduleId}&date=${date}&timeType=${timeType}`);
        return;
      }

      try {
        // Fetch fresh profile, luôn ưu tiên gọi API để đảm bảo đúng user
        const userProfile = await getUserProfile(token);
        setUser(userProfile);
        localStorage.setItem("userData", JSON.stringify(userProfile)); // nếu muốn lưu lại

        if (!doctorId || !scheduleId || !date || !timeType) {
          setError("Thiếu thông tin cần thiết để đặt lịch");
          setLoading(false);
          return;
        }

        const [doctorData, scheduleData] = await Promise.all([
          getDoctorById(Number(doctorId)),
          getDoctorScheduleById(Number(scheduleId)),
        ]);

        setDoctor(doctorData);
        setSchedule(scheduleData);
      } catch (err: unknown) {
        console.error("Lỗi khi fetch:", err);

        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Lỗi khi tải dữ liệu");
        }
      } finally {
        setLoading(false);
      }

    };

    fetchData();
  }, [doctorId, scheduleId, date, timeType, router]);

  const handleBooking = async () => {
    if (!doctor || !schedule || !user) {
      setError("Thiếu thông tin cần thiết để đặt lịch");
      return;
    }

    // Định nghĩa interface ngay trong hàm
    interface BookingPayload {
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

    const bookingData: BookingPayload = {
      statusId: 'S1', // trạng thái mặc định là chờ xác nhận
      doctorId: doctor.id,
      patientId: user.id,
      date: schedule.date,
      timeType: schedule.timeType,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(), // hoặc lấy từ input
    };

    try {
      const response = await createBooking(bookingData);
      if (response.success) {
        setSuccess("Đặt lịch thành công!");
        setTimeout(() => {
          router.push("/book_apointment"); // <-- Trang xem thông tin đặt lịch
        }); // đợi 3 giây trước khi điều hướng
      } else {
        alert("Đặt lịch thất bại!");
      }
    } catch (error) {
      console.error(error);
      alert("Đã xảy ra lỗi khi đặt lịch!");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString + "T00:00:00").toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Đang tải thông tin đặt lịch...</h2>
          <p className="text-gray-500">Vui lòng chờ trong giây lát</p>
        </div>
      </div>
    );
  }

  if (roleId && roleId !== 'R1' && roleId !== 'R3') {
    return <div className="p-6 text-center text-red-500">Bạn không có quyền truy cập trang này.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl md:text-3xl font-bold text-blue-700 mb-6 text-center">
        Xác nhận thông tin đặt lịch khám
      </h1>

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
          <p className="font-medium">{success}</p>
          <p className="mt-2 text-sm">Bạn sẽ được chuyển về trang lịch hẹn sau 3 giây...</p>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <p className="font-medium">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        {/* Thông tin bệnh nhân */}
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold mb-4">Thông tin bệnh nhân</h2>
          {user ? (
            <div className="space-y-3">
              <p><span className="font-medium">Họ tên:</span> {user.lastName} {user.firstName}</p>
              <p><span className="font-medium">Email:</span> {user.email}</p>
              {user.phonenumber && (
                <p><span className="font-medium">Số điện thoại:</span> {user.phonenumber}</p>
              )}
              {user.address && (
                <p><span className="font-medium">Địa chỉ:</span> {user.address}</p>
              )}
              {user.gender && (
                <p><span className="font-medium">Giới tính:</span> {user.gender === 'M' ? 'Nam' : 'Nữ'}</p>
              )}
            </div>
          ) : (
            <p className="text-gray-600">Không có thông tin bệnh nhân</p>
          )}
        </div>

        {/* Thông tin bác sĩ */}
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold mb-4">Thông tin bác sĩ</h2>
          {doctor ? (
            <div className="flex items-center space-x-4">
              <Image
                src={doctor.image ? `/${doctor.image}` : "/default-avatar.png"}
                alt={`${doctor.firstName} ${doctor.lastName}`}
                width={100}
                height={100}
                className="rounded-full object-cover border-2 border-gray-200"
              />
              <div>
                <p className="font-semibold text-lg">{doctor.firstName} {doctor.lastName}</p>
                {doctor.Specialty && (
                  <p className="text-gray-600">{doctor.Specialty.name}</p>
                )}
              </div>
            </div>
          ) : (
            <p className="text-gray-600">Không có thông tin bác sĩ</p>
          )}
        </div>

        {/* Thông tin lịch khám */}
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold mb-4">Thông tin lịch khám</h2>
          {schedule ? (
            <div className="space-y-3">
              <p><span className="font-medium">Ngày khám:</span> {formatDate(schedule.date)}</p>
              <p><span className="font-medium">Giờ khám:</span> {schedule.timeTypeData?.valueVi || timeType}</p>
            </div>
          ) : (
            <p className="text-gray-600">Không có thông tin lịch khám</p>
          )}
        </div>

        {/* Lý do khám */}
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Lý do khám</h2>
          <textarea
            rows={4}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Nhập lý do khám (không bắt buộc)"
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="flex space-x-4">
        <button
          onClick={() => router.back()}
          className="flex-1 py-3 px-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors font-medium"
        >
          Quay lại
        </button>
        <button
          onClick={handleBooking}
          disabled={bookingLoading || !!success}
          className={`flex-1 py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium ${(bookingLoading || !!success) ? "opacity-70 cursor-not-allowed" : ""
            }`}
        >
          {bookingLoading ? "Đang xử lý..." : "Xác nhận đặt lịch"}
        </button>
      </div>
    </div>
  );
}
