"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const API_URL = "http://localhost:8080/api"; // Thay bằng URL backend

interface Appointment {
    id: number;
    doctorName: string;
    date: string;
    time: string;
    status: "scheduled" | "completed" | "canceled";
}

const AppointmentsPage = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            axios
                .get(`${API_URL}/appointments`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then((response) => setAppointments(response.data))
                .catch((error) => console.error("Lỗi khi lấy lịch khám:", error));
        }
    }, []);

    const handleCancel = async (id: number) => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            await axios.delete(`${API_URL}/appointments/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAppointments(appointments.filter((appt) => appt.id !== id));
            setSelectedAppointment(null);
            alert("Hủy lịch khám thành công!");
        } catch (error) {
            console.error("Lỗi khi hủy lịch khám:", error);
            alert("Không thể hủy lịch khám!");
        }
    };

    return (
        <div className="p-6 min-h-screen bg-gray-100">
            <h2 className="text-2xl font-bold text-center mb-4">Lịch khám của bạn</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    {appointments.length === 0 ? (
                        <p className="text-center text-gray-500">Không có lịch khám nào.</p>
                    ) : (
                        appointments.map((appt) => (
                            <div
                                key={appt.id}
                                onClick={() => setSelectedAppointment(appt)}
                                className="p-4 bg-white shadow-md rounded-lg cursor-pointer hover:bg-gray-200 transition-all"
                            >
                                <p>Bác sĩ: {appt.doctorName}</p>
                                <p>Ngày: {appt.date}</p>
                                <p>Giờ: {appt.time}</p>
                                <p className="text-sm text-gray-600">Trạng thái: {appt.status}</p>
                            </div>
                        ))
                    )}
                </div>

                {selectedAppointment && (
                    <div className="p-6 bg-white shadow-lg rounded-lg">
                        <h3 className="text-xl font-semibold">Chi tiết lịch khám</h3>
                        <p><strong>Bác sĩ:</strong> {selectedAppointment.doctorName}</p>
                        <p><strong>Ngày:</strong> {selectedAppointment.date}</p>
                        <p><strong>Giờ:</strong> {selectedAppointment.time}</p>
                        <p><strong>Trạng thái:</strong> {selectedAppointment.status}</p>

                        {selectedAppointment.status === "scheduled" && (
                            <button
                                onClick={() => handleCancel(selectedAppointment.id)}
                                className="mt-4 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                            >
                                Hủy lịch khám
                            </button>
                        )}
                    </div>
                )}
            </div>
            <button onClick={() => router.back()} className="mt-6 p-2 bg-gray-300 rounded-lg">← Quay lại</button>
        </div>
    );
};

export default AppointmentsPage;
