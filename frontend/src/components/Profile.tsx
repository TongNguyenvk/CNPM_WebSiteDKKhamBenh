'use client';
import React, { useEffect, useState } from 'react';
import { getUserProfile, updateUserProfile, uploadProfileImage } from '@/lib/api';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input, Textarea } from '@/components/ui/input';
import { LoadingPage } from '@/components/ui/loading';
import { cn, getRoleText } from '@/lib/utils';

interface ProfileProps {
    role: 'admin' | 'doctor' | 'patient';
}

export default function Profile({ role }: ProfileProps) {
    const [profile, setProfile] = useState<unknown>(null);
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
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleEditClick = () => {
        setIsEditing(true);
        setSelectedFile(null);
        setImagePreview(null);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setSelectedFile(null);
        setImagePreview(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setError(null);
            setSuccess(null);
            let imageUrl = profile?.image;
            if (selectedFile) {
                const result = await uploadProfileImage(selectedFile);
                imageUrl = result.imageUrl;
            }
            await updateUserProfile({ ...formData, image: imageUrl });
            await fetchProfile();
            setSuccess('Cập nhật thông tin thành công');
            setIsEditing(false);
            setSelectedFile(null);
            setImagePreview(null);
        } catch (error: unknown) {
            const err = error as Error;
            setError(err.message || 'Cập nhật thông tin thất bại');
        }
    };

    if (loading) {
        return <LoadingPage text="Đang tải thông tin hồ sơ..." />;
    }

    return (
        <div className="min-h-screen bg-neutral-50">
            <div className="container py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-neutral-900 mb-2">
                        Hồ Sơ Cá Nhân
                    </h1>
                    <p className="text-neutral-600">
                        Quản lý thông tin cá nhân và cài đặt tài khoản của bạn
                    </p>
                </div>

                {/* Alerts */}
                {error && (
                    <div className="mb-6 p-4 bg-error-50 border border-error-200 text-error-700 rounded-xl">
                        <div className="flex items-center space-x-2">
                            <svg className="w-5 h-5 text-error-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <span>{error}</span>
                        </div>
                    </div>
                )}

                {success && (
                    <div className="mb-6 p-4 bg-success-50 border border-success-200 text-success-700 rounded-xl">
                        <div className="flex items-center space-x-2">
                            <svg className="w-5 h-5 text-success-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>{success}</span>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Card */}
                    <div className="lg:col-span-1">
                        <Card>
                            <CardBody className="text-center p-8">
                                <div className="relative w-32 h-32 mx-auto mb-6">
                                    <img
                                        src={imagePreview || (profile?.image ? (profile.image.startsWith('http') ? profile.image : `http://localhost:8080${profile.image}?${Date.now()}`) : "/images/default-avatar.png")}
                                        alt="Profile"
                                        width={128}
                                        height={128}
                                        className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-medium"
                                    />
                                    {isEditing && (
                                        <label className="absolute bottom-2 right-2 bg-primary-600 text-white p-2 rounded-full cursor-pointer hover:bg-primary-700 transition-colors shadow-medium">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                className="hidden"
                                            />
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                            </svg>
                                        </label>
                                    )}
                                </div>

                                <h2 className="text-xl font-bold text-neutral-900 mb-2">
                                    {profile?.firstName} {profile?.lastName}
                                </h2>

                                <p className="text-neutral-600 mb-4">
                                    {getRoleText(role)}
                                </p>

                                {profile?.email && (
                                    <div className="flex items-center justify-center space-x-2 text-sm text-neutral-500 mb-4">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                        </svg>
                                        <span>{profile.email}</span>
                                    </div>
                                )}

                                {!isEditing && (
                                    <Button onClick={handleEditClick} className="w-full">
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                        </svg>
                                        Chỉnh sửa hồ sơ
                                    </Button>
                                )}
                            </CardBody>
                        </Card>
                    </div>

                    {/* Information Card */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    {isEditing ? 'Chỉnh sửa thông tin' : 'Thông tin cá nhân'}
                                </CardTitle>
                            </CardHeader>
                            <CardBody className="p-6">
                                {isEditing ? (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <Input
                                                label="Họ"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleInputChange}
                                                required
                                            />

                                            <Input
                                                label="Tên"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>

                                        <Input
                                            label="Email"
                                            type="email"
                                            value={profile?.email || ''}
                                            disabled
                                            helperText="Email không thể thay đổi"
                                        />

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <Input
                                                label="Số điện thoại"
                                                type="tel"
                                                name="phoneNumber"
                                                value={formData.phoneNumber}
                                                onChange={handleInputChange}
                                                placeholder="Nhập số điện thoại"
                                            />

                                            <div className="form-group">
                                                <label className="form-label">Giới tính</label>
                                                <div className="flex space-x-6 mt-2">
                                                    <label className="flex items-center">
                                                        <input
                                                            type="radio"
                                                            name="gender"
                                                            value="true"
                                                            checked={formData.gender === true}
                                                            onChange={handleGenderChange}
                                                            className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500"
                                                        />
                                                        <span className="ml-2 text-neutral-700">Nam</span>
                                                    </label>
                                                    <label className="flex items-center">
                                                        <input
                                                            type="radio"
                                                            name="gender"
                                                            value="false"
                                                            checked={formData.gender === false}
                                                            onChange={handleGenderChange}
                                                            className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500"
                                                        />
                                                        <span className="ml-2 text-neutral-700">Nữ</span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        <Textarea
                                            label="Địa chỉ"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            rows={3}
                                            placeholder="Nhập địa chỉ của bạn"
                                        />

                                        {/* Doctor specific fields */}
                                        {role === 'doctor' && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <Input
                                                    label="Chuyên khoa"
                                                    value={profile?.Specialty?.name || ''}
                                                    disabled
                                                    helperText="Thông tin này không thể thay đổi"
                                                />

                                                <Input
                                                    label="Vị trí"
                                                    value={profile?.positionData?.valueVi || ''}
                                                    disabled
                                                    helperText="Thông tin này không thể thay đổi"
                                                />
                                            </div>
                                        )}

                                        <div className="flex justify-end space-x-4 pt-6 border-t border-neutral-200">
                                            <Button
                                                type="button"
                                                variant="secondary"
                                                onClick={handleCancelEdit}
                                            >
                                                Hủy
                                            </Button>
                                            <Button type="submit">
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                Lưu thay đổi
                                            </Button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="text-sm font-medium text-neutral-500">Họ</label>
                                                <p className="mt-1 text-lg text-neutral-900">{profile?.lastName || 'Chưa cập nhật'}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-neutral-500">Tên</label>
                                                <p className="mt-1 text-lg text-neutral-900">{profile?.firstName || 'Chưa cập nhật'}</p>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium text-neutral-500">Email</label>
                                            <p className="mt-1 text-lg text-neutral-900">{profile?.email}</p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="text-sm font-medium text-neutral-500">Số điện thoại</label>
                                                <p className="mt-1 text-lg text-neutral-900">
                                                    {profile?.phoneNumber || (
                                                        <span className="text-neutral-400 italic">Chưa cập nhật</span>
                                                    )}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-neutral-500">Giới tính</label>
                                                <p className="mt-1 text-lg text-neutral-900">{profile?.gender ? 'Nam' : 'Nữ'}</p>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium text-neutral-500">Địa chỉ</label>
                                            <p className="mt-1 text-lg text-neutral-900">
                                                {profile?.address || (
                                                    <span className="text-neutral-400 italic">Chưa cập nhật</span>
                                                )}
                                            </p>
                                        </div>

                                        {/* Doctor specific fields */}
                                        {role === 'doctor' && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-neutral-200">
                                                <div>
                                                    <label className="text-sm font-medium text-neutral-500">Chuyên khoa</label>
                                                    <p className="mt-1 text-lg text-neutral-900">
                                                        {profile?.Specialty?.name || (
                                                            <span className="text-neutral-400 italic">Chưa cập nhật</span>
                                                        )}
                                                    </p>
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium text-neutral-500">Vị trí</label>
                                                    <p className="mt-1 text-lg text-neutral-900">
                                                        {profile?.positionData?.valueVi || (
                                                            <span className="text-neutral-400 italic">Chưa cập nhật</span>
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
} 