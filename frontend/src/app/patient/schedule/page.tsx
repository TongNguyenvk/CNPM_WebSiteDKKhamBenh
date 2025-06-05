'use client';
import React, { useState, useEffect } from 'react';
import { getDoctorSchedules, getAllDoctors } from '@/lib/api';

interface DoctorOption {
    id: number;
    firstName: string;
    lastName: string;
}

export default function PatientSchedulePage() {
    const [doctorId, setDoctorId] = useState<number>(0);
    const [doctors, setDoctors] = useState<DoctorOption[]>([]);
    const [date, setDate] = useState('');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [schedules, setSchedules] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const data = await getAllDoctors();
                setDoctors(data);
            } catch {
                setError('Không thể tải danh sách bác sĩ');
            }
        };
        fetchDoctors();
    }, []);

    const handleSearch = async () => {
        if (!doctorId || !date) {
            setError('Vui lòng nhập ID bác sĩ và ngày khám');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            console.log('Gọi getDoctorSchedules với:', { doctorId, date });
            const data = await getDoctorSchedules(doctorId, date);
            console.log('Kết quả trả về từ getDoctorSchedules:', data);
            setSchedules(data);
        } catch (error: unknown) {
            const err = error as Error;
            setError(err.message || 'Lỗi khi tải lịch khám');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-10 px-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
                <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">Xem lịch khám của bác sĩ</h1>
                <div className="space-y-4">
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
                    <button
                        onClick={handleSearch}
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors disabled:bg-blue-400"
                    >
                        {loading ? 'Đang tải...' : 'Xem lịch'}
                    </button>
                </div>
                {error && <p className="mt-4 text-red-600 text-sm text-center">{error}</p>}
                {schedules.length > 0 && (
                    <div className="mt-6">
                        <h2 className="text-lg font-semibold text-gray-700 mb-2">Lịch khám</h2>
                        <ul className="space-y-2">
                            {schedules.map(s => (
                                <li
                                    key={s.id}
                                    className="border border-gray-200 rounded-md p-3 text-gray-700 text-sm"
                                >
                                    {s.date} - {s.timeTypeData?.valueVi || s.timeType}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}
