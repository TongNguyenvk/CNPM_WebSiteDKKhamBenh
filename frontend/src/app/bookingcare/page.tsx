// src/app/booking/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
// Giả sử bạn có các hàm API này trong thư viện api của mình
import { getAllDoctors, getDoctorSchedules, createBooking } from '@/app/lib/api';
// Giả sử bạn có các kiểu dữ liệu này
import type { Doctor, Schedule } from '@/app/types'; // Hoặc đường dẫn thực tế đến file types

// --- GIẢ SỬ ---
// Giả sử bạn có cách lấy thông tin người dùng đã đăng nhập
// Ví dụ: thông qua Context API hoặc một hook tùy chỉnh
// import { useAuth } from '@/app/context/AuthContext';
// --- KẾT THÚC GIẢ SỬ ---

export default function BookingPage() {
  // --- State cho các lựa chọn của người dùng ---
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  // Lưu timeType hoặc ID của khung giờ được chọn
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');

  // --- State cho dữ liệu fetch từ API ---
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [timeSlots, setTimeSlots] = useState<Schedule[]>([]); // Lưu danh sách khung giờ

  // --- State cho trạng thái UI ---
  const [isLoadingDoctors, setIsLoadingDoctors] = useState<boolean>(true);
  const [isLoadingSlots, setIsLoadingSlots] = useState<boolean>(false);
  const [isBooking, setIsBooking] = useState<boolean>(false); // Trạng thái đang đặt lịch
  const [error, setError] = useState<string | null>(null); // Lỗi API chung
  const [validationError, setValidationError] = useState<string | null>(null); // Lỗi validation
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // Thông báo thành công

  const router = useRouter();
  // --- GIẢ SỬ ---
  // Lấy thông tin người dùng (ví dụ)
  // const { user } = useAuth();
  // const patientId = user?.id; // Lấy ID bệnh nhân từ context/hook
  const patientId = 1; // <<--- THAY THẾ BẰNG LOGIC LẤY PATIENT ID THỰC TẾ
  // --- KẾT THÚC GIẢ SỬ ---


  // --- Effect để fetch danh sách bác sĩ khi component mount ---
  useEffect(() => {
    const fetchDoctors = async () => {
      setIsLoadingDoctors(true);
      setError(null);
      try {
        // Gọi API lấy danh sách bác sĩ (role R2)
        const fetchedDoctors = await getAllDoctors();
        setDoctors(fetchedDoctors || []); // Đảm bảo là mảng
      } catch (err: any) {
        console.error("Lỗi fetch bác sĩ:", err);
        setError("Không thể tải danh sách bác sĩ. Vui lòng thử lại.");
      } finally {
        setIsLoadingDoctors(false);
      }
    };

    fetchDoctors();
  }, []); // Mảng dependency rỗng nghĩa là chỉ chạy 1 lần khi mount

  // --- Effect để fetch khung giờ khi bác sĩ hoặc ngày thay đổi ---
  useEffect(() => {
    // Chỉ fetch khi đã chọn bác sĩ và ngày
    if (selectedDoctorId && selectedDate) {
      const fetchSlots = async () => {
        setIsLoadingSlots(true);
        setError(null);
        setTimeSlots([]); // Xóa khung giờ cũ
        setSelectedTimeSlot(''); // Reset lựa chọn khung giờ
        try {
          // Gọi API lấy lịch trình của bác sĩ cho ngày đã chọn
          // Hàm getDoctorSchedules cần trả về danh sách Schedule cho ngày đó
          const fetchedSchedules = await getDoctorSchedules(parseInt(selectedDoctorId, 10), selectedDate);
          setTimeSlots(fetchedSchedules || []);
        } catch (err: any) {
          console.error("Lỗi fetch khung giờ:", err);
          setError("Không thể tải khung giờ. Vui lòng thử lại.");
        } finally {
          setIsLoadingSlots(false);
        }
      };
      fetchSlots();
    } else {
      // Nếu chưa chọn đủ bác sĩ/ngày, reset danh sách khung giờ
      setTimeSlots([]);
      setSelectedTimeSlot('');
    }
  }, [selectedDoctorId, selectedDate]); // Chạy lại effect khi doctorId hoặc date thay đổi

  // --- Hàm xử lý khi submit form đặt lịch ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null); // Reset lỗi validation
    setError(null); // Reset lỗi API
    setSuccessMessage(null); // Reset thông báo thành công

    // 1. Validation cơ bản
    if (!selectedDoctorId) {
      setValidationError("Vui lòng chọn bác sĩ.");
      return;
    }
    if (!selectedDate) {
      setValidationError("Vui lòng chọn ngày khám.");
      return;
    }
    if (!selectedTimeSlot) {
      setValidationError("Vui lòng chọn khung giờ.");
      return;
    }
    // --- GIẢ SỬ ---
    if (!patientId) {
         setError('Không thể xác định người dùng. Vui lòng đăng nhập lại.');
         return; // Dừng lại nếu không có patientId
    }
    // --- KẾT THÚC GIẢ SỬ ---


    setIsBooking(true); // Bắt đầu trạng thái đang đặt lịch

    try {
      // 2. Gọi API tạo booking
      // Gửi các ID và thông tin cần thiết lên backend
      await createBooking({
        statusId: 'S1', // Giả sử 'S1' là trạng thái "Chờ xác nhận"
        doctorId: parseInt(selectedDoctorId, 10),
        patientId: patientId, // <<--- LẤY TỪ AUTH CONTEXT/STATE
        date: selectedDate,
        timeType: selectedTimeSlot, // Gửi timeType (hoặc ID khung giờ nếu backend cần)
        // Backend sẽ tự tạo token
      });

      // 3. Xử lý thành công
      setSuccessMessage('Đặt lịch thành công! Bạn sẽ được chuyển hướng sau giây lát.');
      // Reset form (tùy chọn)
      setSelectedDoctorId('');
      setSelectedDate('');
      setSelectedTimeSlot('');
      setTimeSlots([]);
      // Chuyển hướng sau một khoảng thời gian
      setTimeout(() => {
        router.push('/appointments'); // Chuyển đến trang xem lịch hẹn (ví dụ)
      }, 3000);

    } catch (err: any) {
      // 4. Xử lý lỗi API
      console.error("Lỗi đặt lịch:", err);
      // Hiển thị lỗi từ backend nếu có, nếu không thì hiển thị lỗi chung
      setError(err.response?.data?.message || "Đặt lịch thất bại. Đã có lỗi xảy ra.");
    } finally {
      setIsBooking(false); // Kết thúc trạng thái đang đặt lịch
    }
  };

  // --- Phần JSX với Tailwind CSS ---
  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Đặt lịch khám</h1>

      {/* Hiển thị thông báo lỗi validation */}
      {validationError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{validationError}</span>
        </div>
      )}
      {/* Hiển thị thông báo lỗi API */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      {/* Hiển thị thông báo thành công */}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        {/* --- Chọn Bác sĩ --- */}
        <div className="mb-6">
          <label htmlFor="doctor" className="block text-gray-700 text-sm font-bold mb-2">
            Chọn bác sĩ:
          </label>
          {isLoadingDoctors ? (
            <p className="text-gray-500">Đang tải danh sách bác sĩ...</p>
          ) : doctors.length > 0 ? (
            <select
              id="doctor"
              value={selectedDoctorId}
              onChange={(e) => setSelectedDoctorId(e.target.value)}
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
              disabled={isBooking} // Vô hiệu hóa khi đang đặt lịch
            >
              <option value="">-- Chọn một bác sĩ --</option>
              {doctors.map((doctor) => (
                // Giả sử model Doctor có id, firstName, lastName
                <option key={doctor.id} value={doctor.id.toString()}>
                  {doctor.firstName} {doctor.lastName}
                </option>
              ))}
            </select>
          ) : (
            <p className="text-red-500">Không có bác sĩ nào.</p>
          )}
        </div>

        {/* --- Chọn Ngày khám --- */}
        <div className="mb-6">
          <label htmlFor="date" className="block text-gray-700 text-sm font-bold mb-2">
            Ngày khám:
          </label>
          <input
            type="date"
            id="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            // Giới hạn ngày trong tương lai (ví dụ)
            min={new Date().toISOString().split('T')[0]}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
            disabled={!selectedDoctorId || isBooking} // Vô hiệu hóa nếu chưa chọn bác sĩ hoặc đang đặt
          />
        </div>

        {/* --- Chọn Khung giờ --- */}
        <div className="mb-6">
          <label htmlFor="timeSlot" className="block text-gray-700 text-sm font-bold mb-2">
            Chọn khung giờ:
          </label>
          {isLoadingSlots ? (
            <p className="text-gray-500">Đang tải khung giờ...</p>
          ) : !selectedDoctorId || !selectedDate ? (
            <p className="text-gray-500 italic">Vui lòng chọn bác sĩ và ngày khám.</p>
          ) : timeSlots.length > 0 ? (
            <select
              id="timeSlot"
              value={selectedTimeSlot}
              onChange={(e) => setSelectedTimeSlot(e.target.value)}
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
              disabled={isBooking}
            >
              <option value="">-- Chọn khung giờ --</option>
              {timeSlots.map((slot) => (
                // Giả sử Schedule có timeType (là keyMap) và timeTypeData (từ include)
                <option key={slot.timeType} value={slot.timeType}>
                  {slot.timeTypeData?.valueVi || slot.timeTypeData?.valueEn || slot.timeType}
                </option>
              ))}
            </select>
          ) : (
            <p className="text-red-500">Không có khung giờ trống cho ngày này.</p>
          )}
        </div>

        {/* --- Nút Đặt lịch --- */}
        <div className="flex items-center justify-center">
          <button
            type="submit"
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out ${
              isBooking ? 'opacity-50 cursor-not-allowed' : '' // Thêm style khi đang loading
            }`}
            disabled={isBooking} // Vô hiệu hóa nút khi đang đặt lịch
          >
            {isBooking ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang xử lý...
              </>
            ) : (
              'Đặt lịch'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}