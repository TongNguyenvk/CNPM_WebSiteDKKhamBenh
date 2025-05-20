'use client';

import { useState, useEffect, useRef } from 'react';
import { getAllUsersByRole, createDoctor, createAdmin, updateUser, deleteUser, getAllSpecialties } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import SimpleEditor from './components/SimpleEditor';

interface Specialty {
    id: number;
    name: string;
}

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
    roleData?: {
        keyMap: string;
        valueVi: string;
        valueEn: string;
    };
    positionData?: {
        keyMap: string;
        valueVi: string;
        valueEn: string;
    };
    Specialty?: {
        id: number;
        name: string;
    };
}

interface CreateUserData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    roleId: string;
    phoneNumber?: string;
    address?: string;
    gender?: boolean;
    positionId?: string;
    specialtyId?: number;
    image?: string;
    descriptionMarkdown?: string;
    descriptionHTML?: string;
}

interface UsersByRole {
    R1: UserProfile[];
    R2: UserProfile[];
    R3: UserProfile[];
}

export default function UsersPage() {
    const router = useRouter();
    const [usersByRole, setUsersByRole] = useState<UsersByRole>({
        R1: [],
        R2: [],
        R3: []
    });
    const [selectedRole, setSelectedRole] = useState<string>('all');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
    const [formData, setFormData] = useState<CreateUserData>({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        roleId: 'R2',
        phoneNumber: '',
        address: '',
        gender: true,
        positionId: '',
        specialtyId: undefined,
        image: '',
        descriptionMarkdown: '',
        descriptionHTML: ''
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [specialties, setSpecialties] = useState<Specialty[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        loadUsers();
        loadSpecialties();
    }, []);

    const loadUsers = async () => {
        try {
            const data = await getAllUsersByRole();
            setUsersByRole(data);
        } catch (error) {
            toast.error('Lỗi khi tải danh sách người dùng');
        }
    };

    const loadSpecialties = async () => {
        try {
            const data = await getAllSpecialties();
            // Ensure all specialties have required fields
            const validSpecialties = data.filter((specialty): specialty is Specialty =>
                typeof specialty.id === 'number' && typeof specialty.name === 'string'
            );
            setSpecialties(validSpecialties);
        } catch (error) {
            console.error('Error loading specialties:', error);
            toast.error('Lỗi khi tải danh sách chuyên khoa');
        }
    };

    const handleCreateUser = async () => {
        try {
            if (!formData.roleId) {
                toast.error('Vui lòng chọn vai trò!');
                return;
            }

            let imageUrl = '';
            if (imageFile) {
                try {
                    imageUrl = await uploadImage(imageFile);
                } catch (error) {
                    console.error('Error uploading image:', error);
                    toast.error('Lỗi khi tải lên ảnh!');
                    return;
                }
            }

            const userData = {
                ...formData,
                image: imageUrl,
                positionId: formData.roleId === "R2" ? "P1" : "P0",
                specialtyId: formData.roleId === "R2" ? formData.specialtyId : undefined,
                descriptionHTML: formData.descriptionHTML || '',
                descriptionMarkdown: formData.descriptionMarkdown || ''
            };

            if (formData.roleId === "R2") {
                if (!formData.specialtyId) {
                    toast.error('Vui lòng chọn chuyên khoa cho bác sĩ!');
                    return;
                }
                await createDoctor(userData);
                toast.success('Tạo bác sĩ thành công!');
            } else if (formData.roleId === "R3") {
                await createAdmin(userData);
                toast.success('Tạo admin thành công!');
            } else {
                toast.error('Vai trò không hợp lệ!');
                return;
            }

            setIsCreateModalOpen(false);
            resetForm();
            await loadUsers();
            router.refresh();
        } catch (error: any) {
            console.error('Error creating user:', error);
            toast.error(error.message || 'Lỗi khi tạo người dùng!');
        }
    };

    const resetForm = () => {
        setFormData({
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            roleId: 'R2',
            phoneNumber: '',
            address: '',
            gender: true,
            positionId: '',
            specialtyId: undefined,
            image: '',
            descriptionMarkdown: '',
            descriptionHTML: ''
        });
        setImagePreview('');
        setImageFile(null);
    };

    const handleUpdateUser = async () => {
        if (!selectedUser) return;
        try {
            await updateUser(selectedUser.id, formData);
            toast.success('Cập nhật người dùng thành công!', {
                duration: 3000,
                position: 'top-center',
            });
            setIsEditModalOpen(false);
            await loadUsers();
            router.refresh();
        } catch (error: any) {
            console.error('Error updating user:', error);
            toast.error(error.message || 'Lỗi khi cập nhật người dùng!', {
                duration: 3000,
                position: 'top-center',
            });
        }
    };

    const handleDeleteUser = async (userId: number) => {
        const confirmDelete = window.confirm('Bạn có chắc chắn muốn xóa người dùng này?');
        if (confirmDelete) {
            try {
                await deleteUser(userId);
                toast.success('Xóa người dùng thành công!', {
                    duration: 3000,
                    position: 'top-center',
                });
                await loadUsers();
            } catch (error: any) {
                console.error('Error deleting user:', error);
                toast.error(error.message || 'Lỗi khi xóa người dùng!', {
                    duration: 3000,
                    position: 'top-center',
                });
            }
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                toast.error('Kích thước ảnh không được vượt quá 5MB');
                return;
            }
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const uploadImage = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch('/api/upload', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: formData
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to upload image');
        }

        const data = await response.json();
        return data.imageUrl;
    };

    const renderUserTable = () => {
        let usersToDisplay: UserProfile[] = [];

        switch (selectedRole) {
            case 'R1':
                usersToDisplay = usersByRole.R1;
                break;
            case 'R2':
                usersToDisplay = usersByRole.R2;
                break;
            case 'R3':
                usersToDisplay = usersByRole.R3;
                break;
            default:
                usersToDisplay = [...usersByRole.R1, ...usersByRole.R2, ...usersByRole.R3];
        }

        return (
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Họ và tên</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quyền</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chuyên khoa</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {usersToDisplay.map((user) => (
                            <tr key={user.id}>
                                <td className="px-6 py-4 whitespace-nowrap">{user.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{`${user.firstName} ${user.lastName}`}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {user.roleData?.valueVi ||
                                        (user.roleId === 'R1' ? 'Bệnh nhân' :
                                            user.roleId === 'R2' ? 'Bác sĩ' : 'Admin')}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {user.Specialty?.name || '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center space-x-3">
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
                                                    gender: user.gender || true,
                                                    positionId: user.positionData?.keyMap || 'P1',
                                                    specialtyId: user.Specialty?.id || 1,
                                                    image: ''
                                                });
                                                setIsEditModalOpen(true);
                                            }}
                                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                            Sửa
                                        </button>
                                        <button
                                            onClick={() => handleDeleteUser(user.id)}
                                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                            Xóa
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Quản lý người dùng</h1>
                <div className="flex gap-4">
                    <select
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="all">Tất cả quyền</option>
                        <option value="R1">Bệnh nhân</option>
                        <option value="R2">Bác sĩ</option>
                        <option value="R3">Admin</option>
                    </select>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                    >
                        Thêm người dùng
                    </button>
                </div>
            </div>

            {renderUserTable()}

            {/* Create User Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl w-[600px] shadow-2xl max-h-[90vh] overflow-y-auto">
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
                                    <option value="R2">Bác sĩ</option>
                                    <option value="R3">Admin</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Ảnh đại diện</label>
                                <div className="mt-1 flex items-center space-x-4">
                                    {imagePreview && (
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="h-20 w-20 object-cover rounded-full"
                                        />
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                    >
                                        {imagePreview ? 'Đổi ảnh' : 'Chọn ảnh'}
                                    </button>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleImageChange}
                                        accept="image/*"
                                        className="hidden"
                                    />
                                </div>
                            </div>

                            {formData.roleId === "R2" && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Chuyên khoa</label>
                                        <select
                                            value={formData.specialtyId || ''}
                                            onChange={(e) => setFormData({ ...formData, specialtyId: Number(e.target.value) })}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            required
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
                                        <label className="block text-sm font-medium text-gray-700">Mô tả</label>
                                        <div className="mt-1">
                                            <SimpleEditor
                                                value={formData.descriptionHTML || ''}
                                                onChange={(content) => {
                                                    const safeContent = String(content || '');
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        descriptionHTML: safeContent,
                                                        descriptionMarkdown: safeContent.replace(/<[^>]*>/g, '')
                                                    }));
                                                }}
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => {
                                        setIsCreateModalOpen(false);
                                        resetForm();
                                    }}
                                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-200"
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
            {isEditModalOpen && selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl w-96 shadow-2xl">
                        <h2 className="text-xl font-bold text-gray-800 mb-6">Cập nhật người dùng</h2>
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
                                <label className="block text-sm font-medium text-gray-700">Mật khẩu mới (để trống nếu không đổi)</label>
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
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-200"
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
    );
}