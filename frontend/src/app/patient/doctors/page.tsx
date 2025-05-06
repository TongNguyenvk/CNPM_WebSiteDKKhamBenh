'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Doctor {
    id: number;
    firstName: string;
    lastName: string;
    email?: string;
    image?: string;
    // Thêm các trường khác nếu cần
}

export default function DoctorsPage() {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('http://localhost:8080/api/doctors')
            .then(res => setDoctors(res.data.data || res.data))
            .catch(err => alert('Lỗi tải bác sĩ: ' + err.message))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div>Đang tải...</div>;

    return (
        <div>
            <h1>Danh sách bác sĩ</h1>
            <ul>
                {doctors.map(d => (
                    <li key={d.id}>
                        {d.lastName} {d.firstName} {d.email && `(${d.email})`}
                    </li>
                ))}
            </ul>
        </div>
    );
} 