"use client";
import Image from 'next/image';
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

// 🏥 Định nghĩa interface để tránh dùng any
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
async function getSpecialtyDetails(id:number) {
    const res = await fetch(`http://localhost:8080/api/specialties/${id}`);
    if (!res.ok) throw new Error("Failed to fetch");
    return res.json();
}

async function getDoctorsBySpecialty(id:number) {
    const res = await fetch(`http://localhost:8080/api/doctor/${id}`);
    if (!res.ok) throw new Error("Failed to fetch");
    return res.json();
}

async function getDoctorSchedules(doctorId:number, date:string) {
    const res = await fetch(`http://localhost:8080/api/schedules/doctor/${doctorId}?date=${date}`);
    if (!res.ok) throw new Error("Failed to fetch");
    return res.json();
}


export default function SpecialtyDetailPage() {
    const { id } = useParams<{ id: string }>();

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

                console.log("Doctors data:", doctorData);
                setSpecialty(specialtyData);
                setDoctors(doctorData);

                // 🗓️ Tạo danh sách 3 ngày tiếp theo
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

    if (!specialty) return <p>Không tìm thấy bác sĩ thuộc chuyên khoa này</p>;

    return (
        <div>
            <h1>{specialty.name}</h1>
            <Image src={`/${specialty.image}`} alt={specialty.name} width={500} height={300} />
            <p>{specialty.description}</p>

            <h2>Danh sách bác sĩ</h2>
            {doctors.length > 0 ? (
                <ul>
                    {doctors.map((doctor) => (
                        <li key={doctor.id}>
                            <Image src={`/${doctor.image}`} alt={doctor.firstName} width={100} height={100} />
                            <p>{doctor.firstName} - {doctor.Specialty?.name}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Không có bác sĩ nào trong chuyên khoa này</p>
            )}

            <h2>Chọn ngày khám</h2>
            <select value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}>
                {availableDates.map((date) => (
                    <option key={date} value={date}>{date}</option>
                ))}
            </select>

            <h2>Lịch khám</h2>
            <ul>
                {schedules.length > 0 ? (
                    schedules.map((schedule) => (
                        <li key={schedule.id}>
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
