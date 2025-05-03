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
        } catch (error) {
            toast.error('Lỗi khi tải danh sách người dùng');
        }
    };

    const handleCreateUser = async () => {
        try {
            await createUser(formData);
            toast.success('Tạo người dùng thành công');
            setIsCreateModalOpen(false);
            loadUsers();
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
        } catch (error) {
            toast.error('Lỗi khi cập nhật người dùng');
        }
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Quản lý người dùng</h1>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Thêm người dùng
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
                            <th className="px-4 py-2 border">Vai trò</th>
                            <th className="px-4 py-2 border">Số điện thoại</th>
                            <th className="px-4 py-2 border">Trạng thái</th>
                            <th className="px-4 py-2 border">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td className="px-4 py-2 border">{user.id}</td>
                                <td className="px-4 py-2 border">{user.email}</td>
                                <td className="px-4 py-2 border">{user.firstName}</td>
                                <td className="px-4 py-2 border">{user.lastName}</td>
                                <td className="px-4 py-2 border">{user.roleId}</td>
                                <td className="px-4 py-2 border">{user.phoneNumber}</td>
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
                                        className="bg-gray-100 px-3 py-1 rounded hover:bg-gray-200"
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
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h2 className="text-xl font-bold mb-4">Thêm người dùng mới</h2>
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
                                <label className="block mb-1">Vai trò</label>
                                <select
                                    value={formData.roleId}
                                    onChange={(e) => setFormData({ ...formData, roleId: e.target.value })}
                                    className="w-full border rounded px-3 py-2"
                                >
                                    <option value="R1">Admin</option>
                                    <option value="R2">Bác sĩ</option>
                                    <option value="R3">Bệnh nhân</option>
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
                                    onClick={handleCreateUser}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h2 className="text-xl font-bold mb-4">Cập nhật thông tin người dùng</h2>
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
                                <label className="block mb-1">Vai trò</label>
                                <select
                                    value={formData.roleId}
                                    onChange={(e) => setFormData({ ...formData, roleId: e.target.value })}
                                    className="w-full border rounded px-3 py-2"
                                >
                                    <option value="R1">Admin</option>
                                    <option value="R2">Bác sĩ</option>
                                    <option value="R3">Bệnh nhân</option>
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
                                    onClick={handleUpdateUser}
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