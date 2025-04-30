// Xem lịch khám được phân công cho bác sĩ
export default function DoctorSchedulePage() {
    return <div>Lịch phân công (bác sĩ)</div>;
}

try {
    const response = await getDoctorSchedule();
    setSchedule(response);
} catch (error: unknown) {
    const err = error as Error;
    setError(err.message || 'Lỗi khi tải lịch khám');
} 