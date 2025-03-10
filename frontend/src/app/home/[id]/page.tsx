"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

async function getSpecialtyDetails(id) {
    const res = await fetch(`http://localhost:8080/api/specialties/${id}`);
    if (!res.ok) throw new Error("Failed to fetch");
    return res.json();
}

async function getDoctorsBySpecialty(id) {
    const res = await fetch(`http://localhost:8080/api/doctor/${id}`);
    if (!res.ok) throw new Error("Failed to fetch");
    return res.json();
}

async function getDoctorSchedules(doctorId, date) {
    const res = await fetch(`http://localhost:8080/api/schedules/doctor/${doctorId}?date=${date}`);
    if (!res.ok) throw new Error("Failed to fetch");
    return res.json();
}

export default function SpecialtyDetailPage() {
    const { id } = useParams();
    const [specialty, setSpecialty] = useState(null);
    const [doctors, setDoctors] = useState([]);
    const [selectedDate, setSelectedDate] = useState("");
    const [schedules, setSchedules] = useState([]);
    const [availableDates, setAvailableDates] = useState([]);

    useEffect(() => {
        if (!id) return;

        async function fetchData() {
            try {
                const specialtyData = await getSpecialtyDetails(id);
                const doctorData = await getDoctorsBySpecialty(id);
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
        if (selectedDate && doctors.length > 0) {
            async function fetchSchedules() {
                try {
                    const doctorId = doctors[0]?.id; // Mặc định lấy lịch của bác sĩ đầu tiên
                    const scheduleData = await getDoctorSchedules(doctorId, selectedDate);
                    setSchedules(scheduleData);
                } catch (error) {
                    console.error("Error fetching schedules:", error);
                }
            }
            fetchSchedules();
        }
    }, [selectedDate, doctors]);

    if (!specialty) return <p>Không tìm thấy bác sĩ thuộc chuyên khoa này</p>;

    return (
        <div>
            <h1>{specialty.name}</h1>
            <img src={specialty.image} alt={specialty.name} width="500" />
            <p>{specialty.description}</p>

            <h2>Danh sách bác sĩ</h2>
            <ul>
                {doctors.map((doctor) => (
                    <li key={doctor.id}>

                        <img src={doctor.image} alt={doctor.name} width="100" height="100" />
                        <p>{doctor.firstName} - {doctor.Specialty.name}</p>
                    </li>
                ))}
            </ul>

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
                            {schedule.date} - {schedule.timeTypeData?.valueVi}
                        </li>
                    ))
                ) : (
                    <p>Không có lịch khám cho ngày này.</p>
                )}
            </ul>
        </div>
    );
}
