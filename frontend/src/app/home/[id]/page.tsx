"use client";
import Image from 'next/image';
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation"; // ✅ Import useRouter để quay lại trang trước

// 🏥 Định nghĩa interface 
interface Specialty {
    id: number;
    name: string;
    description: string;
    image: string;
}

interface Doctor {
    id: number;
    firstName: string;
    lastName: string;
    image: string;
    Specialty: {
        name: string;
    };
}

interface Schedule {
    id: number;
    date: string;
    timeTypeData?: {
        valueVi: string;
    };
}

// 🛠️ Hàm gọi API
async function getSpecialtyDetails(id: number) {
    const res = await fetch(`http://localhost:8080/api/specialties/${id}`);
    if (!res.ok) throw new Error("Failed to fetch");
    return res.json();
}

async function getDoctorsBySpecialty(id: number) {
    const res = await fetch(`http://localhost:8080/api/doctor/${id}`);
    if (!res.ok) throw new Error("Failed to fetch");
    return res.json();
}

async function getDoctorSchedules(doctorId: number, date: string) {
    const res = await fetch(`http://localhost:8080/api/schedules/doctor/${doctorId}?date=${date}`);
    if (!res.ok) throw new Error("Failed to fetch");
    return res.json();
}

export default function SpecialtyDetailPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter(); // ✅ Sử dụng useRouter để xử lý nút quay lại

    // 🏥 State quản lý dữ liệu
    const [specialty, setSpecialty] = useState<Specialty | null>(null);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [availableDates, setAvailableDates] = useState<string[]>([]);

    useEffect(() => {
        if (!id) return;

        const specialtyId = Number(id);
        if (isNaN(specialtyId)) {
            console.error("ID chuyên khoa không hợp lệ:", id);
            return;
        }

        async function fetchData() {
            try {
                const [specialtyData, doctorData] = await Promise.all([
                    getSpecialtyDetails(specialtyId),
                    getDoctorsBySpecialty(specialtyId),
                ]);

                setSpecialty(specialtyData);
                setDoctors(doctorData);

                // Tạo danh sách 3 ngày tiếp theo
                const today = new Date();
                const nextDays = Array.from({ length: 3 }, (_, i) => {
                    const date = new Date(today);
                    date.setDate(today.getDate() + i);
                    return date.toISOString().split('T')[0]; // YYYY-MM-DD
                });

                setAvailableDates(nextDays);
                setSelectedDate(nextDays[0]); // Mặc định chọn ngày đầu tiên
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }

        fetchData();
    }, [id]);

    useEffect(() => {
        if (!selectedDate || doctors.length === 0) return;

        async function fetchSchedules() {
            try {
                const doctorId = doctors[0]?.id;
                if (!doctorId) return;

                const scheduleData = await getDoctorSchedules(doctorId, selectedDate);
                setSchedules(scheduleData);
            } catch (error) {
                console.error("Error fetching schedules:", error);
            }
        }

        fetchSchedules();
    }, [selectedDate, doctors]);

    if (!specialty) return <p className="text-center text-gray-500 mt-10">Không tìm thấy bác sĩ thuộc chuyên khoa này</p>;

    return (
        <div style={{ maxWidth: "1600px", margin: "auto", padding: "20px" }}>
            {/* Nút Quay lại */}
            <button style={{color:"black", padding: "10px 20px", borderRadius: "100px", border: "2px solid cyan", cursor: "pointer", marginBottom: "20px" }}
                onClick={() => router.back()} // ✅ Quay lại trang trước
            >
                ← Quay lại
            </button>

            <h1 style={{ textAlign: "center", fontFamily: "inherit", fontSize: "60px", color: "black" }}>Thông tin chi tiết</h1>
            <div style={{ width: "100px", height: "50px" }}></div>

            {/* Bố cục hình ảnh */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                {/* Hình ảnh */}
                <div className="flex justify-center">
                    <Image src={`/${specialty.image}`} alt={specialty.name} width={400} height={300} className="rounded-lg shadow-lg" />
                </div>
                <div style={{width:"5%"}}></div>
                {/* Nội dung */}
                <div className="w-full md:w-2/3 text-black">
                    <h1 style={{ fontFamily: "inherit", fontSize: "30px", color: "black" }}>{specialty.name}</h1>
                    <p style={{ fontFamily: "inherit", fontSize: "20px", color: "black" }}>{specialty.description}</p>
                </div>
            </div>

            <div style={{ width: "100px", height: "50px" }}></div>
            <hr />
            <div style={{ width: "100px", height: "50px" }}></div>

            {/* Danh sách bác sĩ */}
            <h2 style={{ fontFamily: "inherit", fontSize: "30px", color: "black" }}>Danh sách bác sĩ</h2>
            {doctors.length > 0 ? (
                <ul className="mt-4 space-y-4">
                    {doctors.map((doctor) => (
                        <li key={doctor.id} className="flex items-center gap-4 p-4 border rounded-lg shadow-sm">
                            <Image src={`/${doctor.image}`} alt={doctor.firstName} width={100} height={100} className="rounded-full" />
                            <p className="text-lg font-medium">{doctor.firstName} - {doctor.Specialty?.name}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Không có bác sĩ nào trong chuyên khoa này</p>
            )}

            {/* Chọn ngày khám */}
            <h2 className="mt-8 text-2xl font-semibold">Chọn ngày khám</h2>
            <select className="mt-2 p-2 border rounded-lg" value={selectedDate} 
                onChange={(e) => setSelectedDate(e.target.value)}
            >
                {availableDates.map((date) => (
                    <option key={date} value={date}>{date}</option>
                ))}
            </select>

            {/* Lịch khám */}
            <h2 className="mt-8 text-2xl font-semibold">Lịch khám</h2>
            <ul className="mt-4">
                {schedules.length > 0 ? (
                    schedules.map((schedule) => (
                        <li key={schedule.id} className="p-2 border rounded-lg shadow-sm">
                            {schedule.date} - {schedule.timeTypeData?.valueVi || "Không có thông tin"}
                        </li>
                    ))
                ) : (
                    <p>Không có lịch khám cho ngày này.</p>
                )}
            </ul>
        </div>
    );
}
