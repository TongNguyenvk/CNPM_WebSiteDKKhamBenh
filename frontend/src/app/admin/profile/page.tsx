'use client';

import { useState, useEffect } from 'react';
import { getUserProfile, updateUserProfile, uploadProfileImage } from '@/lib/api';
import { toast } from 'react-hot-toast';

interface UserProfile {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    address?: string;
    gender?: boolean;
    image?: string;
}

export default function AdminProfilePage() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        address: '',
        gender: true
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const data = await getUserProfile();
            setProfile(data);
            setFormData({
                firstName: data.firstName,
                lastName: data.lastName,
                phoneNumber: data.phoneNumber || '',
                address: data.address || '',
                gender: data.gender || true
            });
            if (data.image) {
                setImagePreview(data.image);
            }
        } catch (error: any) {
            toast.error(error.message || 'Lỗi khi tải thông tin cá nhân');
        }
    };

    const handleUpdateProfile = async () => {
        try {
            const updatedProfile = await updateUserProfile(formData);
            setProfile(updatedProfile);
            setIsEditModalOpen(false);
            toast.success('Cập nhật thông tin thành công');
        } catch (error: any) {
            toast.error(error.message || 'Lỗi khi cập nhật thông tin');
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageUpload = async () => {
        if (!imageFile) {
            toast.error('Vui lòng chọn ảnh để tải lên');
            return;
        }
        try {
            const response = await uploadProfileImage(imageFile);
            setImagePreview(response.imageUrl);
            toast.success('Tải ảnh đại diện thành công');
            loadProfile(); // Refresh profile to ensure consistency
        } catch (error: any) {
            toast.error(error.message || 'Lỗi khi tải ảnh đại diện');
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-4 md:p-6 pt-28">
            <div className="bg-white rounded-xl shadow-2xl p-8">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-blue-600 text-center border-b pb-3">Hồ sơ quản trị viên</h1>
                </div>

                {profile ? (
                    <div className="space-y-6">
                        <div className="flex justify-center mb-6">
                            <div className="relative">
                                <img
                                    src={imagePreview || 'https://via.placeholder.com/150'}
                                    alt="Profile"
                                    className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                                />
                                <label
                                    htmlFor="imageUpload"
                                    className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition duration-200"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L15.232 5.232z"
                                        />
                                    </svg>
                                </label>
                                <input
                                    id="imageUpload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageChange}
                                />
                            </div>
                        </div>

                        {imageFile && (
                            <div className="flex justify-center">
                                <button
                                    onClick={handleImageUpload}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                                >
                                    Tải ảnh lên
                                </button>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <p className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm p-2">
                                    {profile.email}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Họ</label>
                                <p className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm p-2">
                                    {profile.firstName}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Tên</label>
                                <p className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm p-2">
                                    {profile.lastName}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                                <p className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm p-2">
                                    {profile.phoneNumber || 'Chưa cập nhật'}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Địa chỉ</label>
                                <p className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm p-2">
                                    {profile.address || 'Chưa cập nhật'}
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                onClick={() => setIsEditModalOpen(true)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                            >
                                Chỉnh sửa hồ sơ
                            </button>
                        </div>
                    </div>
                ) : (
                    <p className="text-center text-gray-600">Đang tải thông tin...</p>
                )}

                {/* Edit Profile Modal */}
                {isEditModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-xl w-96 shadow-2xl">
                            <h2 className="text-xl font-bold text-gray-800 mb-6">Chỉnh sửa hồ sơ</h2>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <input
                                        type="email"
                                        value={profile?.email || ''}
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
                                        onClick={handleUpdateProfile}
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