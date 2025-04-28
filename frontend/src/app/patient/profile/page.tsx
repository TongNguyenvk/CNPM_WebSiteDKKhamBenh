'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getUserProfile, updateUserProfile, uploadProfileImage } from '@/lib/api';

interface UserProfile {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    address?: string;
    gender?: boolean;
    roleId: string;
    image?: string;
}

export default function PatientProfilePage() {
    const router = useRouter();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        address: '',
        gender: false
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getUserProfile();
            setProfile(data);
            setFormData({
                firstName: data.firstName,
                lastName: data.lastName,
                phoneNumber: data.phoneNumber || '',
                address: data.address || '',
                gender: data.gender || false
            });
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleGenderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            gender: e.target.value === 'true'
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setError(null);
            setSuccess(null);
            const updatedProfile = await updateUserProfile(formData);
            setProfile(updatedProfile);
            setSuccess('Cập nhật thông tin thành công');
            setIsEditing(false);
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !e.target.files[0]) return;

        try {
            setError(null);
            setSuccess(null);
            const result = await uploadProfileImage(e.target.files[0]);
            setProfile(prev => prev ? { ...prev, image: result.imageUrl } : null);
            setSuccess('Cập nhật ảnh đại diện thành công');
        } catch (err: any) {
            setError(err.message);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Đang tải thông tin...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-6">
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Thông tin cá nhân</h1>
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                        {isEditing ? 'Hủy' : 'Chỉnh sửa'}
                    </button>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md">
                        {success}
                    </div>
                )}

                <div className="flex flex-col md:flex-row gap-6">
                    {/* Ảnh đại diện */}
                    <div className="flex-shrink-0">
                        <div className="relative w-32 h-32 mx-auto">
                            <Image
                                src={profile?.image ? `http://localhost:8080/images/${profile.image}` : "/images/default-avatar.png"}
                                alt="Profile"
                                fill
                                className="rounded-full object-cover border-2 border-gray-200"
                            />
                            {isEditing && (
                                <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                    />
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                    </svg>
                                </label>
                            )}
                        </div>
                    </div>

                    {/* Form thông tin */}
                    <div className="flex-1">
                        {isEditing ? (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Họ</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Tên</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <input
                                        type="email"
                                        value={profile?.email}
                                        disabled
                                        className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                                    <input
                                        type="tel"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Địa chỉ</label>
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        rows={3}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Giới tính</label>
                                    <div className="mt-2 space-x-4">
                                        <label className="inline-flex items-center">
                                            <input
                                                type="radio"
                                                name="gender"
                                                value="true"
                                                checked={formData.gender === true}
                                                onChange={handleGenderChange}
                                                className="form-radio text-blue-600"
                                            />
                                            <span className="ml-2">Nam</span>
                                        </label>
                                        <label className="inline-flex items-center">
                                            <input
                                                type="radio"
                                                name="gender"
                                                value="false"
                                                checked={formData.gender === false}
                                                onChange={handleGenderChange}
                                                className="form-radio text-blue-600"
                                            />
                                            <span className="ml-2">Nữ</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                    >
                                        Lưu thay đổi
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Họ</label>
                                        <p className="mt-1 text-gray-900">{profile?.lastName}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Tên</label>
                                        <p className="mt-1 text-gray-900">{profile?.firstName}</p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <p className="mt-1 text-gray-900">{profile?.email}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                                    <p className="mt-1 text-gray-900">{profile?.phoneNumber || 'Chưa cập nhật'}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Địa chỉ</label>
                                    <p className="mt-1 text-gray-900">{profile?.address || 'Chưa cập nhật'}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Giới tính</label>
                                    <p className="mt-1 text-gray-900">{profile?.gender ? 'Nam' : 'Nữ'}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
} 