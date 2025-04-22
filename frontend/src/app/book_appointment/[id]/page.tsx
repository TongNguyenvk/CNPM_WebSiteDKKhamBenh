"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Cookies from "js-cookie";
import { Booking } from "../../lib/api";

const BookingDetailPage = () => {
    const router = useRouter();
    const params = useParams();
    const bookingId = params?.id;
    const [booking, setBooking] = useState<Booking | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBooking = async () => {
            if (!bookingId) {
                setError("Không tìm thấy mã lịch.");
                setLoading(false);
                return;
            }
            try {
                const token = Cookies.get("token") || localStorage.getItem("token");
                if (!token) {
                    router.push("/login?redirect=/book_appointment/" + bookingId);
                    return;
                }
                // Gọi API backend lấy chi tiết booking theo id
                const res = await fetch(`http://localhost:8080/api/bookings/${bookingId}`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (!res.ok) {
                    throw new Error("Không tìm thấy lịch khám hoặc bạn không có quyền xem.");
                }
                const data = await res.json();
                setBooking(data.data || data); // data.data nếu backend trả về {success, data}
            } catch (err: any) {
                setError(err.message || "Đã xảy ra lỗi khi tải chi tiết lịch khám.");
            } finally {
                setLoading(false);
            }
        };
        fetchBooking();
    }, [bookingId, router]);

    if (loading) return <div className="p-6 text-center">Đang tải chi tiết lịch khám...</div>;
    if (error) return <div className="p-6 text-center text-red-500">{error}</div>;
    if (!booking) return <div className="p-6 text-center text-gray-500">Không tìm thấy lịch khám.</div>;

    return (
        <div className="p-6 min-h-screen bg-gray-50">
            <h2 className="text-2xl font-bold mb-4 text-center">Chi tiết lịch khám</h2>
            <div className="max-w-xl mx-auto bg-white rounded-lg shadow p-6">
                <p><strong>Mã lịch:</strong> {booking.id}</p>
                <p><strong>Ngày:</strong> {new Date(booking.date).toLocaleString("vi-VN", { dateStyle: "medium", timeStyle: "short" })}</p>
                {booking.timeType && <p><strong>Khung giờ:</strong> {booking.timeType}</p>}
                {booking.statusData && <p><strong>Trạng thái:</strong> {booking.statusData.valueVi}</p>}
                {booking.doctorData && (
                    <>
                        <p><strong>Bác sĩ:</strong> {booking.doctorData.firstName} {booking.doctorData.lastName}</p>
                        {booking.doctorData.Specialty && <p><strong>Chuyên khoa:</strong> {booking.doctorData.Specialty.name}</p>}
                        {booking.doctorData.doctorDetail && (
                            <div className="mt-2">
                                <strong>Mô tả bác sĩ:</strong>
                                <div className="prose" dangerouslySetInnerHTML={{ __html: booking.doctorData.doctorDetail.descriptionHTML || "" }} />
                            </div>
                        )}
                    </>
                )}
                {booking.patientData && (
                    <>
                        <p><strong>Bệnh nhân:</strong> {booking.patientData.firstName} {booking.patientData.lastName}</p>
                        <p><strong>Email bệnh nhân:</strong> {booking.patientData.email}</p>
                    </>
                )}
            </div>
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
                onClick={() => router.back()} >
                ← Quay lại
            </button>
        </div>
    );
};

export default BookingDetailPage; 