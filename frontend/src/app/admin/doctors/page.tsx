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
            setFormData({
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
        <div className="max-w-5xl mx-auto p-4 md:p-6 pt-28">
            <div className="bg-white rounded-xl shadow-2xl p-8">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-blue-600 text-center border-b pb-3">Quản lý bác sĩ</h1>
                </div>

                <div className="mb-6 flex justify-end">
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 ease-in-out"
                    >
                        Thêm bác sĩ
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border rounded-lg">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="px-4 py-2 border text-left">ID</th>
                                <th className="px-4 py-2 border text-left">Email</th>
                                <th className="px-4 py-2 border text-left">Họ</th>
                                <th className="px-4 py-2 border text-left">Tên</th>
                                <th className="px-4 py-2 border text-left">Chuyên khoa</th>
                                <th className="px-4 py-2 border text-left">Số điện thoại</th>
                                <th className="px-4 py-2 border text-left">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {doctors.map((doctor) => (
                                <tr key={doctor.id} className="hover:bg-gray-50 transition duration-150">
                                    <td className="px-4 py-2 border">{doctor.id}</td>
                                    <td className="px-4 py-2 border">{doctor.email || 'Chưa cập nhật'}</td>
                                    <td className="px-4 py-2 border">{doctor.firstName}</td>
                                    <td className="px-4 py-2 border">{doctor.lastName}</td>
                                    <td className="px-4 py-2 border">{doctor.Specialty?.name || 'Chưa cập nhật'}</td>
                                    <td className="px-4 py-2 border">{doctor.phoneNumber || 'Chưa cập nhật'}</td>
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
                                                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition duration-200"
                                            >
                                                Sửa
                                            </button>
                                            <button
                                                onClick={() => handleDeleteDoctor(doctor.id)}
                                                className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
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
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-xl w-96 shadow-2xl">
                            <h2 className="text-xl font-bold text-gray-800 mb-6">Thêm bác sĩ mới</h2>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
                                    <input
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Họ</label>
                                    <input
                                        type="text"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Tên</label>
                                    <input
                                        type="text"
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Chuyên khoa</label>
                                    <select
                                        value={formData.specialtyId}
                                        onChange={(e) => setFormData({ ...formData, specialtyId: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
                                    <label className="block text-sm font-medium text-gray-700">Vị trí</label>
                                    <select
                                        value={formData.positionId}
                                        onChange={(e) => setFormData({ ...formData, positionId: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    >
                                        <option value="">Chọn vị trí</option>
                                        <option value="P0">Bác sĩ</option>
                                        <option value="P1">Thạc sĩ</option>
                                        <option value="P2">Tiến sĩ</option>
                                        <option value="P3">Phó giáo sư</option>
                                        <option value="P4">Giáo sư</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                                    <input
                                        type="text"
                                        value={formData.phoneNumber}
                                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Địa chỉ</label>
                                    <input
                                        type="text"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="flex justify-end gap-4 mt-6">
                                    <button
                                        onClick={() => setIsCreateModalOpen(false)}
                                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-200"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        onClick={handleCreateDoctor}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
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
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-8 rounded-xl w-full max-w-md shadow-2xl transform transition-all duration-300 ease-in-out hover:shadow-3xl">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b-2 border-blue-500 pb-2">Cập nhật thông tin bác sĩ</h2>
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        disabled
                                        className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200 text-lg py-3"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Họ</label>
                                    <input
                                        type="text"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200 text-lg py-3"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Tên</label>
                                    <input
                                        type="text"
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200 text-lg py-3"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Chuyên khoa</label>
                                    <select
                                        value={formData.specialtyId}
                                        onChange={(e) => setFormData({ ...formData, specialtyId: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200 text-lg py-3"
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
                                    <label className="block text-sm font-medium text-gray-700">Vị trí</label>
                                    <select
                                        value={formData.positionId}
                                        onChange={(e) => setFormData({ ...formData, positionId: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200 text-lg py-3"
                                    >
                                        <option value="">Chọn vị trí</option>
                                        <option value="P0">Bác sĩ</option>
                                        <option value="P1">Thạc sĩ</option>
                                        <option value="P2">Tiến sĩ</option>
                                        <option value="P3">Phó giáo sư</option>
                                        <option value="P4">Giáo sư</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                                    <input
                                        type="text"
                                        value={formData.phoneNumber}
                                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200 text-lg py-3"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Địa chỉ</label>
                                    <input
                                        type="text"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200 text-lg py-3"
                                    />
                                </div>
                                <div className="flex justify-end gap-4 mt-6">
                                    <button
                                        onClick={() => setIsEditModalOpen(false)}
                                        className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition duration-200 shadow-md hover:shadow-lg"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        onClick={handleUpdateDoctor}
                                        className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition duration-200 shadow-md hover:shadow-lg"
                                    >
                                        Cập nhật
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}