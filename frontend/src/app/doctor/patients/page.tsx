'use client';

import { useState, useEffect, useMemo } from 'react';
import { getDoctorAppointments } from '@/lib/api';
import { SlidePanel, DataTable } from '@/components/ui';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { toast } from 'react-hot-toast';
import { getAvatarUrl } from '@/lib/utils';

interface Patient {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    address?: string;
    gender?: boolean;
    image?: string;
    appointmentCount: number;
    lastVisit?: string;
}

export default function DoctorPatientsPage() {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [isPanelOpen, setIsPanelOpen] = useState(false);

    useEffect(() => { fetchPatients(); }, []);

    const fetchPatients = async () => {
        try {
            setLoading(true);
            const userStr = localStorage.getItem('user');
            if (!userStr) return;
            const user = JSON.parse(userStr);
            const appointments = await getDoctorAppointments(user.userId);
            
            // Group by patient
            const patientMap = new Map<number, Patient>();
            appointments.forEach((apt: { patientId: number; patientData?: { firstName: string; lastName: string; email: string; phoneNumber?: string; address?: string; gender?: boolean; image?: string }; date: string }) => {
                if (!apt.patientData) return;
                const existing = patientMap.get(apt.patientId);
                if (existing) {
                    existing.appointmentCount++;
                    if (!existing.lastVisit || apt.date > existing.lastVisit) {
                        existing.lastVisit = apt.date;
                    }
                } else {
                    patientMap.set(apt.patientId, {
                        id: apt.patientId,
                        firstName: apt.patientData.firstName,
                        lastName: apt.patientData.lastName,
                        email: apt.patientData.email,
                        phoneNumber: apt.patientData.phoneNumber,
                        address: apt.patientData.address,
                        gender: apt.patientData.gender,
                        image: apt.patientData.image,
                        appointmentCount: 1,
                        lastVisit: apt.date,
                    });
                }
            });
            setPatients(Array.from(patientMap.values()));
        } catch (error) {
            console.error('Error:', error);
            toast.error('Không thể tải danh sách bệnh nhân');
        } finally {
            setLoading(false);
        }
    };

    const filteredPatients = useMemo(() => {
        if (!searchTerm) return patients;
        const s = searchTerm.toLowerCase();
        return patients.filter(p => 
            `${p.firstName} ${p.lastName}`.toLowerCase().includes(s) ||
            p.email.toLowerCase().includes(s) ||
            p.phoneNumber?.includes(s)
        );
    }, [patients, searchTerm]);

    const columns = useMemo(() => [
        {
            key: 'name', header: 'Bệnh nhân',
            render: (p: Patient) => (
                <div className="flex items-center gap-3">
                    {p.image ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={getAvatarUrl(p.image)} alt={`${p.firstName} ${p.lastName}`} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-medium">
                            {p.firstName?.charAt(0)}{p.lastName?.charAt(0)}
                        </div>
                    )}
                    <div>
                        <p className="font-medium text-gray-900">{p.firstName} {p.lastName}</p>
                        <p className="text-sm text-gray-500">{p.email}</p>
                    </div>
                </div>
            )
        },
        { key: 'phone', header: 'Số điện thoại', render: (p: Patient) => <span className="text-gray-700">{p.phoneNumber || '-'}</span> },
        { key: 'gender', header: 'Giới tính', render: (p: Patient) => <span className="text-gray-700">{p.gender ? 'Nam' : 'Nữ'}</span> },
        { 
            key: 'visits', header: 'Số lần khám', 
            render: (p: Patient) => (
                <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">{p.appointmentCount} lần</span>
            )
        },
        { 
            key: 'lastVisit', header: 'Lần khám cuối', 
            render: (p: Patient) => <span className="text-gray-700">{p.lastVisit ? format(new Date(p.lastVisit), 'dd/MM/yyyy', { locale: vi }) : '-'}</span>
        },
        {
            key: 'actions', header: '', width: 'w-24',
            render: (p: Patient) => (
                <button 
                    onClick={() => { setSelectedPatient(p); setIsPanelOpen(true); }} 
                    className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition"
                >
                    Chi tiết
                </button>
            )
        },
    ], []);

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b bg-white flex-shrink-0">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Bệnh nhân của tôi</h1>
                    <p className="text-sm text-gray-500">{filteredPatients.length} bệnh nhân</p>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex items-center gap-4 px-6 py-3 border-b bg-white flex-shrink-0">
                <div className="relative flex-1 max-w-sm">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Tìm theo tên, email, SĐT..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-hidden bg-white">
                <DataTable
                    columns={columns}
                    data={filteredPatients}
                    keyField="id"
                    pageSize={15}
                    emptyMessage="Chưa có bệnh nhân nào"
                />
            </div>

            {/* Detail Panel */}
            <SlidePanel
                isOpen={isPanelOpen}
                onClose={() => setIsPanelOpen(false)}
                title="Thông tin bệnh nhân"
                width="md"
            >
                {selectedPatient && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                            {selectedPatient.image ? (
                                /* eslint-disable-next-line @next/next/no-img-element */
                                <img src={getAvatarUrl(selectedPatient.image)} alt={`${selectedPatient.firstName} ${selectedPatient.lastName}`} className="w-16 h-16 rounded-full object-cover border-2 border-white shadow" />
                            ) : (
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold shadow">
                                    {selectedPatient.firstName?.charAt(0)}{selectedPatient.lastName?.charAt(0)}
                                </div>
                            )}
                            <div>
                                <p className="text-lg font-semibold text-gray-900">{selectedPatient.firstName} {selectedPatient.lastName}</p>
                                <p className="text-gray-500">{selectedPatient.email}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-semibold text-gray-900">Thông tin liên hệ</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-500">Số điện thoại</p>
                                    <p className="font-medium text-gray-900">{selectedPatient.phoneNumber || '-'}</p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-500">Giới tính</p>
                                    <p className="font-medium text-gray-900">{selectedPatient.gender ? 'Nam' : 'Nữ'}</p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-500">Số lần khám</p>
                                    <p className="font-medium text-gray-900">{selectedPatient.appointmentCount} lần</p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-500">Lần khám cuối</p>
                                    <p className="font-medium text-gray-900">{selectedPatient.lastVisit ? format(new Date(selectedPatient.lastVisit), 'dd/MM/yyyy', { locale: vi }) : '-'}</p>
                                </div>
                            </div>
                            {selectedPatient.address && (
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-500">Địa chỉ</p>
                                    <p className="font-medium text-gray-900">{selectedPatient.address}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </SlidePanel>
        </div>
    );
}
