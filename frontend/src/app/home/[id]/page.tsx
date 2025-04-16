"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

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

async function getSpecialtyDetails(id: number) {
    const res = await fetch(`http://localhost:8080/api/specialties/${id}`);
    if (!res.ok) throw new Error("Failed to fetch");
    return res.json();
}

async function getDoctorsBySpecialty(id: number) {
    const res = await fetch(`http://localhost:8080/api/doctor/specialty/${id}`);
    if (!res.ok) throw new Error("Failed to fetch");
    return res.json();
}

export default function SpecialtyDetailPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const [specialty, setSpecialty] = useState<Specialty | null>(null);
    const [doctors, setDoctors] = useState<Doctor[]>([]);

    useEffect(() => {
        if (!id) return;
        const specialtyId = Number(id);
        if (isNaN(specialtyId)) return;

        async function fetchData() {
            try {
                const [specialtyData, doctorData] = await Promise.all([
                    getSpecialtyDetails(specialtyId),
                    getDoctorsBySpecialty(specialtyId),
                ]);
                setSpecialty(specialtyData);
                setDoctors(doctorData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }

        fetchData();
    }, [id]);

    return (
        <div className="max-w-6xl mx-auto p-6">
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
                onClick={() => router.back()}>
                ← Quay lại
            </button>


            {specialty && (
                <>
                    <h1 className="text-4xl font-bold mb-4">{specialty.name}</h1>
                    <Image
                        src={`/${specialty.image}`}
                        alt={specialty.name}
                        width={400}
                        height={300}
                        className="rounded-lg shadow mb-6"
                    />
                    <p className="text-lg mb-10">{specialty.description}</p>
                </>
            )}

            <h2 className="text-2xl font-semibold mb-4">Danh sách bác sĩ</h2>
            <ul className="space-y-4">
                {doctors.map((doctor) => (
                    <li key={doctor.id} className="flex items-center gap-4 p-4 border rounded-lg cursor-pointer hover:bg-gray-100" onClick={() => router.push(`/doctor/${doctor.id}`)}>
                        <Image src={`/${doctor.image}`} alt={doctor.firstName} width={100} height={100} className="rounded-full"/>
                        <div>
                            <p className="text-lg font-medium">
                                {doctor.firstName} {doctor.lastName}
                            </p>
                            <p className="text-gray-600">{doctor.Specialty?.name}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
