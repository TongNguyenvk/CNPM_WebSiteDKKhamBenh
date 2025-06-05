"use client";

import { useEffect, useState } from "react";
import { getDoctorAppointments, updateBookingStatus } from "@/lib/api";

interface Appointment {
    id: number;
    date: string;
    timeType: string;
    statusId: string;
    patientId: number;
    doctorId: number;
    patientData?: {
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber?: string;
        address?: string;
        gender?: boolean;
    };
    statusData?: {
        keyMap: string;
        valueVi: string;
        valueEn: string;
    };
    timeTypeData?: {
        valueVi: string;
        valueEn: string;
    };
}

export default function DoctorAppointmentsPage() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const userStr = localStorage.getItem('user');
                if (!userStr) {
                    setError("Vui lòng đăng nhập để xem lịch khám");
                    return;
                }

                const user = JSON.parse(userStr);
                if (user.role !== 'R2') {
                    setError("Bạn không có quyền truy cập trang này");
                    return;
                }

                const doctorId = user.userId;
                const data = await getDoctorAppointments(doctorId);
                setAppointments(data);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (err: any) {
                console.error('Error fetching appointments:', err);
                setError(err.message || "Có lỗi xảy ra khi tải lịch khám");
            } finally {
                setIsLoading(false);
            }
        };

        fetchAppointments();
    }, []);

    const handleStatusUpdate = async (appointmentId: number, newStatus: string) => {
        try {
            setError(null);
            setSuccess(null);

            await updateBookingStatus(appointmentId, newStatus);
            setSuccess(newStatus === 'S2' ? "Xác nhận lịch khám thành công!" : "Hủy lịch khám thành công!");

            // Cập nhật lại danh sách
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                const doctorId = user.userId;
                const updatedAppointments = await getDoctorAppointments(doctorId);
                setAppointments(updatedAppointments);
                setSelectedAppointment(null);
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            console.error('Error updating appointment status:', err);
            setError(err.message || "Có lỗi xảy ra khi cập nhật trạng thái lịch khám");
        }
    };

    const getStatusColor = (statusId: string) => {
        switch (statusId) {
            case 'S1': return 'bg-yellow-100 text-yellow-800';
            case 'S2': return 'bg-green-100 text-green-800';
            case 'S3': return 'bg-red-100 text-red-800';
            case 'S4': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Đang tải lịch khám...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center text-red-600">
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-6 pt-20">
            <h1 className="text-2xl font-bold mb-8 text-blue-600 text-center">Lịch khám của tôi</h1>

            {success && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                    {success}
                </div>
            )}

            {appointments.length === 0 ? (
                <p className="text-center text-gray-500">Không có lịch khám nào</p>
            ) : (
                <div className="space-y-4">
                    {appointments.map((appointment) => (
                        <div
                            key={appointment.id}
                            className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
                            onClick={() => setSelectedAppointment(appointment)}
                        >
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                <div>
                                    <h3 className="font-semibold text-lg">
                                        {appointment.patientData?.firstName} {appointment.patientData?.lastName}
                                    </h3>
                                    <p className="text-gray-600">
                                        Ngày: {new Date(appointment.date).toLocaleDateString("vi-VN")}
                                    </p>
                                    <p className="text-gray-600">
                                        Ca khám: {appointment.timeTypeData?.valueVi}
                                    </p>
                                    <span className={`inline-block px-3 py-1 rounded-full text-sm ${getStatusColor(appointment.statusId)}`}>
                                        {appointment.statusData?.valueVi}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal chi tiết lịch khám */}
            {selectedAppointment && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl p-8 max-w-lg w-full shadow-2xl transform transition-all">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">Chi Tiết Lịch Khám</h2>

                        <div className="space-y-6">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-lg text-gray-700 mb-2">Thông Tin Bệnh Nhân</h3>
                                <div className="text-gray-600 space-y-2">
                                    <p><span className="font-medium">Họ tên:</span> {selectedAppointment.patientData?.firstName} {selectedAppointment.patientData?.lastName}</p>
                                    <p><span className="font-medium">Email:</span> {selectedAppointment.patientData?.email}</p>
                                    {selectedAppointment.patientData?.phoneNumber && (
                                        <p><span className="font-medium">Số điện thoại:</span> {selectedAppointment.patientData.phoneNumber}</p>
                                    )}
                                    {selectedAppointment.patientData?.address && (
                                        <p><span className="font-medium">Địa chỉ:</span> {selectedAppointment.patientData.address}</p>
                                    )}
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-lg text-gray-700 mb-2">Thông Tin Lịch Khám</h3>
                                <div className="text-gray-600 space-y-2">
                                    <p><span className="font-medium">Ngày:</span> {new Date(selectedAppointment.date).toLocaleDateString("vi-VN")}</p>
                                    <p><span className="font-medium">Ca khám:</span> {selectedAppointment.timeTypeData?.valueVi}</p>
                                    <p><span className="font-medium">Trạng thái:</span> {selectedAppointment.statusData?.valueVi}</p>
                                </div>
                            </div>

                            {selectedAppointment.statusId === 'S1' && (
                                <div className="flex space-x-4 mt-6">
                                    <button
                                        onClick={() => handleStatusUpdate(selectedAppointment.id, 'S2')}
                                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 ease-in-out"
                                    >
                                        Xác Nhận
                                    </button>
                                    <button
                                        onClick={() => handleStatusUpdate(selectedAppointment.id, 'S3')}
                                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200 ease-in-out"
                                    >
                                        Hủy Lịch
                                    </button>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => setSelectedAppointment(null)}
                            className="mt-6 w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-200 ease-in-out"
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
} 