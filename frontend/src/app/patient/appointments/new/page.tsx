'use client';
import React, { useEffect, useState } from 'react';
import { createBooking, getAllDoctors } from '@/lib/api';

interface DoctorOption {
    id: number;
    firstName: string;
    lastName: string;
}

const timeSlots = [
    { key: 'T1', label: '08:00 - 09:00' },
    { key: 'T2', label: '09:00 - 10:00' },
    { key: 'T3', label: '10:00 - 11:00' },
    { key: 'T4', label: '11:00 - 12:00' },
    { key: 'T5', label: '13:00 - 14:00' },
    { key: 'T6', label: '14:00 - 15:00' },
    { key: 'T7', label: '15:00 - 16:00' },
    { key: 'T8', label: '16:00 - 17:00' }
];

export default function NewAppointmentPage() {
    const [doctorId, setDoctorId] = useState<number>(0);
    const [doctors, setDoctors] = useState<DoctorOption[]>([]);
    const [patientId, setPatientId] = useState<number>(0);
    const [date, setDate] = useState('');
    const [timeType, setTimeType] = useState('');
    const [statusId] = useState('S1');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const data = await getAllDoctors();
                setDoctors(data);
            } catch (err: any) {
                setError('Không thể tải danh sách bác sĩ');
            }
        };

        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            setPatientId(user.userId);
        }

        fetchDoctors();
    }, []);

    const handleTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedLabel = e.target.value;
        const slot = timeSlots.find(t => t.label === selectedLabel);
        if (slot) setTimeType(slot.key);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-10 px-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
                <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">Đặt lịch khám</h1>
                <form onSubmit={async e => {
                    e.preventDefault();
                    setLoading(true);
                    setError(null);
                    setSuccess(null);

                    try {
                        await createBooking({ doctorId, patientId, date, timeType, statusId });
                        setSuccess('Đặt lịch thành công!');
                    } catch (error: unknown) {
                        const err = error as Error;
                        setError(err.message || 'Lỗi khi tạo lịch hẹn');
                    }
                    setLoading(false);
                }} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">ID bệnh nhân</label>
                        <input
                            type="number"
                            value={patientId}
                            readOnly
                            className="w-full mt-1 px-3 py-2 border border-gray-300 bg-gray-100 rounded-md focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Chọn bác sĩ</label>
                        <select
                            value={doctorId}
                            onChange={e => setDoctorId(Number(e.target.value))}
                            required
                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">-- Chọn bác sĩ --</option>
                            {doctors.map(doc => (
                                <option key={doc.id} value={doc.id}>
                                    {doc.firstName} {doc.lastName} (ID: {doc.id})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Ngày khám</label>
                        <input
                            type="date"
                            value={date}
                            onChange={e => setDate(e.target.value)}
                            required
                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Khung giờ</label>
                        <div className="grid grid-cols-2 gap-2">
                            <select
                                value={timeSlots.find(slot => slot.key === timeType)?.label || ''}
                                onChange={handleTimeChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">-- Chọn giờ --</option>
                                {timeSlots.map(slot => (
                                    <option key={slot.key} value={slot.label}>{slot.label}</option>
                                ))}
                            </select>
                            <input
                                type="text"
                                readOnly
                                value={timeType}
                                placeholder="Mã giờ (T1-T8)"
                                className="w-full px-3 py-2 border border-gray-300 bg-gray-100 rounded-md"
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors"
                    >
                        {loading ? 'Đang đặt...' : 'Đặt lịch'}
                    </button>
                </form>
                {success && <p className="mt-4 text-green-600 text-sm text-center">{success}</p>}
                {error && <p className="mt-4 text-red-600 text-sm text-center">{error}</p>}
            </div>
        </div>
    );
}
