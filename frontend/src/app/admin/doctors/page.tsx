'use client';

import { useState, useEffect } from 'react';
import { getAllDoctors, getAllSpecialties, createDoctor, updateDoctor, deleteDoctor } from '@/lib/api';
import { toast } from 'react-hot-toast';

interface Doctor {
    id: number;
    email?: string;
    firstName: string;
    lastName: string;
    specialtyId?: number;
    positionId?: string;
    phoneNumber?: string;
    address?: string;
    gender?: boolean;
    image?: string;
    Specialty?: {
        id: number;
        name: string;
    };
}

interface Specialty {
    id: number;
    name: string;
}

export default function DoctorsPage() {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [specialties, setSpecialties] = useState<Specialty[]>([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        specialtyId: '',
        positionId: '',
        phoneNumber: '',
        address: '',
        gender: true
    });

    useEffect(() => {
        loadDoctors();
        loadSpecialties();
    }, []);

    const loadDoctors = async () => {
        try {
            const data = await getAllDoctors();
            setDoctors(data);
        } catch (error) {
            toast.error('Lỗi khi tải danh sách bác sĩ');
        }
    };

    const loadSpecialties = async () => {
        try {
            const data = await getAllSpecialties();
            setSpecialties(data);
        } catch (error) {
            toast.error('Lỗi khi tải danh sách chuyên khoa');
        }
    };

    const handleCreateDoctor = async () => {
        try {
            await createDoctor({
                ...formData,
                specialtyId: Number(formData.specialtyId)
            });
            toast.success('Tạo bác sĩ thành công');
            setIsCreateModalOpen(false);
            loadDoctors();
        } catch (error) {
            toast.error('Lỗi khi tạo bác sĩ');
        }
    };

    const handleUpdateDoctor = async () => {
        if (!selectedDoctor) return;
        try {
            await updateDoctor(selectedDoctor.id, {
                ...formData,
                specialtyId: Number(formData.specialtyId)
            });
            toast.success('Cập nhật bác sĩ thành công');
            setIsEditModalOpen(false);
            loadDoctors();
        } catch (error) {
            toast.error('Lỗi khi cập nhật bác sĩ');
        }
    };

    const handleDeleteDoctor = async (doctorId: number) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa bác sĩ này?')) {
            try {
                await deleteDoctor(doctorId);
                toast.success('Xóa bác sĩ thành công');
                loadDoctors();
            } catch (error) {
                toast.error('Lỗi khi xóa bác sĩ');
            }
        }
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Quản lý bác sĩ</h1>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Thêm bác sĩ
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="px-4 py-2 border">ID</th>
                            <th className="px-4 py-2 border">Email</th>
                            <th className="px-4 py-2 border">Họ</th>
                            <th className="px-4 py-2 border">Tên</th>
                            <th className="px-4 py-2 border">Chuyên khoa</th>
                            <th className="px-4 py-2 border">Số điện thoại</th>
                            <th className="px-4 py-2 border">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {doctors.map((doctor) => (
                            <tr key={doctor.id}>
                                <td className="px-4 py-2 border">{doctor.id}</td>
                                <td className="px-4 py-2 border">{doctor.email}</td>
                                <td className="px-4 py-2 border">{doctor.firstName}</td>
                                <td className="px-4 py-2 border">{doctor.lastName}</td>
                                <td className="px-4 py-2 border">{doctor.Specialty?.name}</td>
                                <td className="px-4 py-2 border">{doctor.phoneNumber}</td>
                                <td className="px-4 py-2 border">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                setSelectedDoctor(doctor);
                                                setFormData({
                                                    email: doctor.email || '',
                                                    password: '',
                                                    firstName: doctor.firstName,
                                                    lastName: doctor.lastName,
                                                    specialtyId: doctor.specialtyId?.toString() || '',
                                                    positionId: doctor.positionId || '',
                                                    phoneNumber: doctor.phoneNumber || '',
                                                    address: doctor.address || '',
                                                    gender: doctor.gender || true
                                                });
                                                setIsEditModalOpen(true);
                                            }}
                                            className="bg-gray-100 px-3 py-1 rounded hover:bg-gray-200"
                                        >
                                            Sửa
                                        </button>
                                        <button
                                            onClick={() => handleDeleteDoctor(doctor.id)}
                                            className="bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200"
                                        >
                                            Xóa
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Create Doctor Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h2 className="text-xl font-bold mb-4">Thêm bác sĩ mới</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block mb-1">Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="block mb-1">Mật khẩu</label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="block mb-1">Họ</label>
                                <input
                                    type="text"
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="block mb-1">Tên</label>
                                <input
                                    type="text"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="block mb-1">Chuyên khoa</label>
                                <select
                                    value={formData.specialtyId}
                                    onChange={(e) => setFormData({ ...formData, specialtyId: e.target.value })}
                                    className="w-full border rounded px-3 py-2"
                                >
                                    <option value="">Chọn chuyên khoa</option>
                                    {specialties.map((specialty) => (
                                        <option key={specialty.id} value={specialty.id}>
                                            {specialty.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block mb-1">Vị trí</label>
                                <select
                                    value={formData.positionId}
                                    onChange={(e) => setFormData({ ...formData, positionId: e.target.value })}
                                    className="w-full border rounded px-3 py-2"
                                >
                                    <option value="P0">Bác sĩ</option>
                                    <option value="P1">Thạc sĩ</option>
                                    <option value="P2">Tiến sĩ</option>
                                    <option value="P3">Phó giáo sư</option>
                                    <option value="P4">Giáo sư</option>
                                </select>
                            </div>
                            <div>
                                <label className="block mb-1">Số điện thoại</label>
                                <input
                                    type="text"
                                    value={formData.phoneNumber}
                                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="block mb-1">Địa chỉ</label>
                                <input
                                    type="text"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>
                            <div className="flex justify-end gap-2 mt-4">
                                <button
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="px-4 py-2 border rounded hover:bg-gray-100"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={handleCreateDoctor}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Tạo
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Doctor Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h2 className="text-xl font-bold mb-4">Cập nhật thông tin bác sĩ</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block mb-1">Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    disabled
                                    className="w-full border rounded px-3 py-2 bg-gray-100"
                                />
                            </div>
                            <div>
                                <label className="block mb-1">Họ</label>
                                <input
                                    type="text"
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="block mb-1">Tên</label>
                                <input
                                    type="text"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="block mb-1">Chuyên khoa</label>
                                <select
                                    value={formData.specialtyId}
                                    onChange={(e) => setFormData({ ...formData, specialtyId: e.target.value })}
                                    className="w-full border rounded px-3 py-2"
                                >
                                    <option value="">Chọn chuyên khoa</option>
                                    {specialties.map((specialty) => (
                                        <option key={specialty.id} value={specialty.id}>
                                            {specialty.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block mb-1">Vị trí</label>
                                <select
                                    value={formData.positionId}
                                    onChange={(e) => setFormData({ ...formData, positionId: e.target.value })}
                                    className="w-full border rounded px-3 py-2"
                                >
                                    <option value="P0">Bác sĩ</option>
                                    <option value="P1">Thạc sĩ</option>
                                    <option value="P2">Tiến sĩ</option>
                                    <option value="P3">Phó giáo sư</option>
                                    <option value="P4">Giáo sư</option>
                                </select>
                            </div>
                            <div>
                                <label className="block mb-1">Số điện thoại</label>
                                <input
                                    type="text"
                                    value={formData.phoneNumber}
                                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="block mb-1">Địa chỉ</label>
                                <input
                                    type="text"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>
                            <div className="flex justify-end gap-2 mt-4">
                                <button
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="px-4 py-2 border rounded hover:bg-gray-100"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={handleUpdateDoctor}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Cập nhật
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
} 