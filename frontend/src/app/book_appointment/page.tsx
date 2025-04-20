"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { getBookingsByPatientId, getUserProfile, Booking } from "../lib/api"; // Import Booking từ lib/api

const BookingListPage = () => {
    const router = useRouter();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const fetchBookings = async () => {
            const token = Cookies.get("token") || localStorage.getItem("token");

            console.log("Token:", token);

            if (!token) {
                console.log("Không tìm thấy token, chuyển hướng đến trang login");
                router.push("/login?redirect=/bookings");
                return;
            }

            try {
                const profile = await getUserProfile(token);
                console.log("Profile:", profile);
                setUser(profile);

                if (!profile.id) {
                    throw new Error("Không tìm thấy ID người dùng trong profile");
                }

                const data = await getBookingsByPatientId(profile.id);
                console.log("Bookings:", data);
                setBookings(data);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (err: any) {
                console.error("Lỗi khi lấy lịch đặt:", err);
                setError(err.message || "Đã xảy ra lỗi khi tải dữ liệu.");
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [router]);

    if (loading) {
        return (
            <div className="p-6 text-center">
                <p>Đang tải lịch khám...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 text-center text-red-500">
                <p>{error}</p>
            </div>
        );
    }

    if (bookings.length === 0) {
        return (
            <div className="p-6 text-center text-gray-500">
                <p>Chưa có lịch khám nào.</p>
            </div>
        );
    }

    return (
        <div className="p-6 min-h-screen bg-gray-50">
            <h2 className="text-2xl font-bold mb-4 text-center">Lịch hẹn của bạn</h2>
            <div className="grid gap-4">
                {bookings.map((booking) => (
                    <div
                        key={booking.booking_id}
                        className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-all"
                    >
                        <p>
                            <strong>Mã lịch:</strong> {booking.booking_id}
                        </p>
                        <p>
                            <strong>Ngày:</strong>{" "}
                            {new Date(booking.date).toLocaleString("vi-VN", {
                                dateStyle: "medium",
                                timeStyle: "short",
                            })}
                        </p>
                        {booking.timeType && (
                            <p>
                                <strong>Giờ:</strong> {booking.timeType}
                            </p>
                        )}
                        {booking.doctorId && (
                            <p>
                                <strong>Bác sĩ ID:</strong> {booking.doctorId}
                            </p>
                        )}
                        {booking.status && (
                            <p>
                                <strong>Trạng thái:</strong> {booking.status}
                            </p>
                        )}
                    </div>
                ))}
            </div>

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
        </div>
    );
};

export default BookingListPage;