'use client';
import React, { useEffect, useState } from 'react';
import { getUserProfile, updateUserProfile, uploadProfileImage } from '@/lib/api';
import Image from 'next/image';

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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        } catch (error: unknown) {
            const err = error as Error;
            setError(err.message || 'Cập nhật thông tin thất bại');
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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setError(err.message);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Đang tải thông tin...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-10 px-4 pt-16">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
                <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">Thông tin cá nhân</h1>

                {error && (
                    <p className="mt-4 text-red-600 text-sm text-center">{error}</p>
                )}

                {success && (
                    <p className="mt-4 text-green-600 text-sm text-center">{success}</p>
                )}

                <div className="flex flex-col items-center gap-6">
                    {/* Ảnh đại diện */}
                    <div className="flex-shrink-0">
                        <div className="relative w-32 h-32">
                            <Image
                                src={profile?.image ? `http://localhost:8080/images/${profile.image}` : "/images/default-avatar.png"}
                                alt="Profile"
                                width={128}
                                height={128}
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
                    <div className="w-full">
                        {isEditing ? (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Họ</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            required
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
                                            required
                                        />
                                    </div>
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
                                        <div className="mt-2 space-x-6">
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
                                </div>
                                <div className="flex justify-end space-x-4 mt-6">
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
                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Họ</label>
                                        <p className="mt-1 text-gray-900">{profile?.lastName || 'Chưa cập nhật'}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Tên</label>
                                        <p className="mt-1 text-gray-900">{profile?.firstName || 'Chưa cập nhật'}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Email</label>
                                        <p className="mt-1 text-gray-900">{profile?.email || 'Chưa cập nhật'}</p>
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
                                        <p className="mt-1 text-gray-900">{profile?.gender ? 'Nam' : profile?.gender === false ? 'Nữ' : 'Chưa cập nhật'}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                    >
                                        Chỉnh sửa
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}