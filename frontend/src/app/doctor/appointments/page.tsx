// Trang xem lịch bệnh nhân đặt cho bác sĩ
export default function DoctorAppointmentsPage() {
    return <div>Lịch khám của tôi (bác sĩ)</div>;
}

try {
    const response = await getDoctorAppointments();
    setAppointments(response);
} catch (error: unknown) {
    const err = error as Error;
    setError(err.message || 'Lỗi khi tải lịch hẹn');
} 