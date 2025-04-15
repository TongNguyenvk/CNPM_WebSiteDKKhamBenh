"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie"; // Import js-cookie để làm việc với cookies

const API_URL = "http://localhost:8080/api";

interface DoctorSchedule {
    id: number;
    doctorName: string;
    date: string;
    time: string;
}

const BookAppointmentPage = () => {
    const [schedules, setSchedules] = useState<DoctorSchedule[]>([]);
    const [selectedSchedule, setSelectedSchedule] = useState<number | null>(null);
    const router = useRouter();

    useEffect(() => {
        const token = Cookies.get("token"); // Lấy token từ cookies
        if (!token) {
            alert("Vui lòng đăng nhập để xem lịch bác sĩ.");
            router.push("/login");
            return;
        }

        axios
            .get(`${API_URL}/schedules`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                setSchedules(res.data);
            })
            .catch((err) => {
                console.error("Lỗi lấy lịch bác sĩ:", err);
                alert("Không thể lấy lịch bác sĩ. Vui lòng thử lại sau.");
            });
    }, [router]);

    const handleBook = async () => {
        const token = Cookies.get("token"); // Lấy token từ cookies
        if (!token || !selectedSchedule) {
            alert("Vui lòng đăng nhập và chọn lịch trước khi đặt.");
            if (!token) router.push("/login");
            return;
        }

        try {
            await axios.post(
                `${API_URL}/appointments`,
                { scheduleId: selectedSchedule },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert("Đặt lịch thành công!");
            router.push("/appointments");
        } catch (error) {
            console.error("Lỗi đặt lịch:", error);
            alert("Đặt lịch thất bại.");
        }
    };

    return (
        <div className="p-6 min-h-screen bg-gray-100">
            <h2 className="text-2xl font-bold text-center mb-4">Đặt lịch khám</h2>
            <div className="grid gap-4">
                {schedules.map((sch) => (
                    <div
                        key={sch.id}
                        onClick={() => setSelectedSchedule(sch.id)}
                        className={`p-4 bg-white rounded-lg shadow-md cursor-pointer hover:bg-blue-100 transition-all ${
                            selectedSchedule === sch.id ? "border-2 border-blue-500" : ""
                        }`}
                    >
                        <p><strong>Bác sĩ:</strong> {sch.doctorName}</p>
                        <p><strong>Ngày:</strong> {sch.date}</p>
                        <p><strong>Giờ:</strong> {sch.time}</p>
                    </div>
                ))}
            </div>

            <button
                onClick={handleBook}
                disabled={!selectedSchedule}
                className="mt-6 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
            >
                Xác nhận đặt lịch
            </button>

            <button onClick={() => router.back()} className="ml-4 px-4 py-2 bg-gray-300 rounded-lg">
                ← Quay lại
            </button>
        </div>
    );
};

export default BookAppointmentPage;