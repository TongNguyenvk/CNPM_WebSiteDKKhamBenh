'use client';
import React, { useEffect, useState } from 'react';
import { getUserProfile, updateUserProfile, uploadProfileImage } from '@/lib/api';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaVenusMars, FaCamera } from 'react-icons/fa';

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
    dateOfBirth?: string;
}

export default function PatientProfilePage() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        address: '',
        gender: false,
        dateOfBirth: ''
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            setError(null);
            const data: UserProfile = await getUserProfile();
            setProfile(data);
            setFormData({
                firstName: data.firstName,
                lastName: data.lastName,
                phoneNumber: data.phoneNumber || '',
                address: data.address || '',
                gender: data.gender || false,
                dateOfBirth: data.dateOfBirth || ''
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
            const loadingToast = toast.loading('Đang cập nhật thông tin...');
            const updatedProfile = await updateUserProfile(formData);
            setProfile(updatedProfile);
            toast.dismiss(loadingToast);
            toast.success('Cập nhật thông tin thành công');
            setSuccess('Cập nhật thông tin thành công');
            setIsEditing(false);
        } catch (error: unknown) {
            const err = error as Error;
            toast.error(err.message || 'Cập nhật thông tin thất bại');
            setError(err.message || 'Cập nhật thông tin thất bại');
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !e.target.files[0]) return;

        try {
            setError(null);
            setSuccess(null);
            setUploading(true);
            const loadingToast = toast.loading('Đang tải ảnh lên...');
            const result = await uploadProfileImage(e.target.files[0]);
            setProfile(prev => prev ? { ...prev, image: result.imageUrl } : null);
            toast.dismiss(loadingToast);
            toast.success('Cập nhật ảnh đại diện thành công');
            setSuccess('Cập nhật ảnh đại diện thành công');
        } catch (err: any) {
            toast.error(err.message || 'Tải ảnh thất bại');
            setError(err.message);
        } finally {
            setUploading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 font-medium">Đang tải thông tin...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center py-10 px-4 pt-16">
            <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 transition-all duration-300 hover:shadow-2xl">
                <h1 className="text-2xl font-bold text-center text-blue-600 mb-6 flex items-center justify-center">
                    <FaUser className="mr-2" />
                    Thông tin cá nhân
                </h1>

                {error && (
                    <div className="mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm text-center">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mt-4 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md text-sm text-center">
                        {success}
                    </div>
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
                                className="rounded-full object-cover border-4 border-blue-100 shadow-md transition-all duration-300 hover:border-blue-300"
                            />
                            {isEditing && (
                                <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 shadow-lg transition-all duration-300 hover:scale-110">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                        disabled={uploading}
                                    />
                                    {uploading ? (
                                        <div className="animate-spin h-5 w-5 border-2 border-white rounded-full border-t-transparent"></div>
                                    ) : (
                                        <FaCamera className="h-5 w-5" />
                                    )}
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
                                        <label className="block text-sm font-medium text-gray-700 flex items-center">
                                            <FaVenusMars className="mr-2 text-blue-500" />
                                            Giới tính
                                        </label>
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
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                            </svg>
                                            Ngày sinh
                                        </label>
                                        <input
                                            type="date"
                                            name="dateOfBirth"
                                            value={formData.dateOfBirth}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end space-x-4 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-all duration-300 transform hover:scale-105"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                                    >
                                        Lưu thay đổi
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 flex items-center">
                                            <FaUser className="mr-2 text-blue-500" />
                                            Họ
                                        </label>
                                        <p className="mt-1 text-gray-900 font-medium">{profile?.lastName || <span className="text-gray-400 italic">Chưa cập nhật</span>}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 flex items-center">
                                            <FaUser className="mr-2 text-blue-500" />
                                            Tên
                                        </label>
                                        <p className="mt-1 text-gray-900 font-medium">{profile?.firstName || <span className="text-gray-400 italic">Chưa cập nhật</span>}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 flex items-center">
                                            <FaEnvelope className="mr-2 text-blue-500" />
                                            Email
                                        </label>
                                        <p className="mt-1 text-gray-900 font-medium">{profile?.email || <span className="text-gray-400 italic">Chưa cập nhật</span>}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 flex items-center">
                                            <FaPhone className="mr-2 text-blue-500" />
                                            Số điện thoại
                                        </label>
                                        <p className="mt-1 text-gray-900 font-medium">{profile?.phoneNumber || <span className="text-gray-400 italic">Chưa cập nhật</span>}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 flex items-center">
                                            <FaMapMarkerAlt className="mr-2 text-blue-500" />
                                            Địa chỉ
                                        </label>
                                        <p className="mt-1 text-gray-900 font-medium">{profile?.address || <span className="text-gray-400 italic">Chưa cập nhật</span>}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 flex items-center">
                                            <FaVenusMars className="mr-2 text-blue-500" />
                                            Giới tính
                                        </label>
                                        <p className="mt-1 text-gray-900 font-medium">
                                            {profile?.gender ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Nam</span>
                                            ) : profile?.gender === false ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800">Nữ</span>
                                            ) : (
                                                <span className="text-gray-400 italic">Chưa cập nhật</span>
                                            )}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                            </svg>
                                            Ngày sinh
                                        </label>
                                        <p className="mt-1 text-gray-900 font-medium">
                                            {profile?.dateOfBirth ? (
                                                new Date(profile.dateOfBirth).toLocaleDateString('vi-VN')
                                            ) : (
                                                <span className="text-gray-400 italic">Chưa cập nhật</span>
                                            )}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                        </svg>
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