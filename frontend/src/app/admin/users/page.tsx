'use client';

import { useState, useEffect } from 'react';
import { getAllUsers, createUser, updateUser } from '@/lib/api';
import { toast } from 'react-hot-toast';

interface UserProfile {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    roleId: string;
    phoneNumber?: string;
    address?: string;
    gender?: boolean;
    isActive?: boolean;
}

export default function UsersPage() {
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        roleId: '',
        phoneNumber: '',
        address: '',
        gender: true
    });

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const data = await getAllUsers();
            setUsers(data);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast.error('Lỗi khi tải danh sách người dùng');
        }
    };

    const handleCreateUser = async () => {
        try {
            await createUser(formData);
            toast.success('Tạo người dùng thành công');
            setIsCreateModalOpen(false);
            setFormData({
                email: '',
                password: '',
                firstName: '',
                lastName: '',
                roleId: '',
                phoneNumber: '',
                address: '',
                gender: true
            });
            loadUsers();
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast.error('Lỗi khi tạo người dùng');
        }
    };

    const handleUpdateUser = async () => {
        if (!selectedUser) return;
        try {
            await updateUser(selectedUser.id, formData);
            toast.success('Cập nhật người dùng thành công');
            setIsEditModalOpen(false);
            loadUsers();
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast.error('Lỗi khi cập nhật người dùng');
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-4 md:p-6 pt-28">
            <div className="bg-white rounded-xl shadow-2xl p-8">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-blue-600 text-center border-b pb-3">Quản lý người dùng</h1>
                </div>

                <div className="mb-6 flex justify-end">
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 ease-in-out"
                    >
                        Thêm người dùng
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
                                <th className="px-4 py-2 border text-left">Vai trò</th>
                                <th className="px-4 py-2 border text-left">Số điện thoại</th>
                                <th className="px-4 py-2 border text-left">Trạng thái</th>
                                <th className="px-4 py-2 border text-left">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 transition duration-150">
                                    <td className="px-4 py-2 border">{user.id}</td>
                                    <td className="px-4 py-2 border">{user.email}</td>
                                    <td className="px-4 py-2 border">{user.firstName}</td>
                                    <td className="px-4 py-2 border">{user.lastName}</td>
                                    <td className="px-4 py-2 border">{user.roleId === 'R1' ? 'Admin' : user.roleId === 'R2' ? 'Bác sĩ' : 'Bệnh nhân'}</td>
                                    <td className="px-4 py-2 border">{user.phoneNumber || 'Chưa cập nhật'}</td>
                                    <td className="px-4 py-2 border">{user.isActive ? 'Hoạt động' : 'Không hoạt động'}</td>
                                    <td className="px-4 py-2 border">
                                        <button
                                            onClick={() => {
                                                setSelectedUser(user);
                                                setFormData({
                                                    email: user.email,
                                                    password: '',
                                                    firstName: user.firstName,
                                                    lastName: user.lastName,
                                                    roleId: user.roleId,
                                                    phoneNumber: user.phoneNumber || '',
                                                    address: user.address || '',
                                                    gender: user.gender || true
                                                });
                                                setIsEditModalOpen(true);
                                            }}
                                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition duration-200"
                                        >
                                            Sửa
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Create User Modal */}
                {isCreateModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-xl w-96 shadow-2xl">
                            <h2 className="text-xl font-bold text-gray-800 mb-6">Thêm người dùng mới</h2>
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
                                    <label className="block text-sm font-medium text-gray-700">Vai trò</label>
                                    <select
                                        value={formData.roleId}
                                        onChange={(e) => setFormData({ ...formData, roleId: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    >
                                        <option value="">Chọn vai trò</option>
                                        <option value="R1">Admin</option>
                                        <option value="R2">Bác sĩ</option>
                                        <option value="R3">Bệnh nhân</option>
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
                                        onClick={handleCreateUser}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                                    >
                                        Tạo
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Edit User Modal */}
                {isEditModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-xl w-96 shadow-2xl">
                            <h2 className="text-xl font-bold text-gray-800 mb-6">Cập nhật thông tin người dùng</h2>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        disabled
                                        className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm"
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
                                    <label className="block text-sm font-medium text-gray-700">Vai trò</label>
                                    <select
                                        value={formData.roleId}
                                        onChange={(e) => setFormData({ ...formData, roleId: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    >
                                        <option value="">Chọn vai trò</option>
                                        <option value="R1">Admin</option>
                                        <option value="R2">Bác sĩ</option>
                                        <option value="R3">Bệnh nhân</option>
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
                                        onClick={() => setIsEditModalOpen(false)}
                                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-200"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        onClick={handleUpdateUser}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
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