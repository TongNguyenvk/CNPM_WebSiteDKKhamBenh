// src/app/dashboard/doctor/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useUser } from "../../lib/UserContext";
import { getBookingsByDoctorId } from "../../lib/api";

export default function DoctorDashboard() {
  const router = useRouter();
  const { roleId, user, loading } = useUser();
  const [bookings, setBookings] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && (!roleId || (roleId !== "R2" && roleId !== "R3"))) {
      router.push("/login?redirect=/dashboard/bacsi");
      return;
    }
    if (roleId === "R2" && user?.id) {
      const token = localStorage.getItem("token") || undefined;
      getBookingsByDoctorId(user.id, token)
        .then(setBookings)
        .catch((err) => setError(err.message || "Lỗi khi tải lịch khám"));
    }
  }, [roleId, user, loading, router]);

  if (loading) return <div className="p-6 text-center">Đang tải...</div>;
  if (roleId && roleId !== "R2" && roleId !== "R3")
    return <div className="p-6 text-center text-red-500">Bạn không có quyền truy cập trang này.</div>;

  return (
    <div style={{ fontFamily: "Montserrat, sans-serif", maxWidth: "1700px", margin: "auto", padding: "20px", color: "black" }}>
      {/* NavBar */}
      <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50 px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Image src="https://phuongnamvina.com/img_data/images/logo-benh-vien.jpg" alt="Logo" width={100} height={50} className="rounded-md shadow-sm" />
        </div>
        {/* Menu */}
        <ul className="flex space-x-20 text-lg font-medium">
          <li style={{ marginRight: "50px" }}>
            <button onClick={() => router.push("/dashboard")} className="hover:text-blue-600 transition-colors duration-200 bg-transparent border-none">Dashboard</button>
          </li>

          <li style={{ marginRight: "50px" }}>
            <button onClick={() => router.push("/contact")} className="hover:text-blue-600 transition-colors duration-200 bg-transparent border-none">Liên hệ</button>
          </li>
          <li style={{ marginRight: "50px" }}>
            <button onClick={() => router.push("/profile")} className="hover:text-blue-600 transition-colors duration-200 bg-transparent border-none">Tôi</button>
          </li>
        </ul>
      </nav>

      {/* Khoảng trống cho nav */}
      <div style={{ marginTop: "100px" }}></div>

      <h1 className="text-2xl font-bold mb-6 text-center">Quản lý lịch hẹn của bạn</h1>
      {error && <div className="text-red-500 text-center mb-4">{error}</div>}
      {bookings.length === 0 ? (
        <div className="text-center text-gray-500">Chưa có lịch khám nào.</div>
      ) : (
        <div className="grid gap-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-all"
            >
              <p><strong>Mã lịch:</strong> {booking.id}</p>
              <p><strong>Ngày:</strong> {new Date(booking.date).toLocaleString("vi-VN", { dateStyle: "medium", timeStyle: "short" })}</p>
              {booking.timeType && <p><strong>Khung giờ:</strong> {booking.timeType}</p>}
              {booking.patientData && (
                <p><strong>Bệnh nhân:</strong> {booking.patientData.firstName} {booking.patientData.lastName}</p>
              )}
              {booking.statusData && (
                <p><strong>Trạng thái:</strong> {booking.statusData.valueVi}</p>
              )}
            </div>
          ))}
        </div>
      )}

      <button
        style={{
          color: "black",
          backgroundColor: "#f5f5f5",
          padding: "10px 20px",
          borderRadius: "100px",
          border: "2px solid #306CD4",
          cursor: "pointer",
          marginBottom: "20px",
          marginTop: "30px"
        }}
        onClick={() => router.push("/dashboard")}
      >
        ← Quay lại Dashboard
      </button>
    </div>
  );
}