'use client';
import React, { useEffect, useState, useRef } from 'react';
import { getUserProfile, updateUserProfile, uploadProfileImage } from '@/lib/api';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input, Textarea } from '@/components/ui/input';
import { LoadingPage } from '@/components/ui/loading';
import { cn, getRoleText } from '@/lib/utils';

interface ProfileProps {
    role: 'admin' | 'doctor' | 'patient';
}

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
    createdAt?: string;
    updatedAt?: string;
    Specialty?: {
        name: string;
    };
    positionData?: {
        valueVi: string;
    };
}

export default function Profile({ role }: ProfileProps) {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'info' | 'security' | 'preferences'>('info');
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        address: '',
        gender: false
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [showImageModal, setShowImageModal] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            setError(null);
            let data = await getUserProfile();
            data = {
                ...data,
                firstName: data.lastName,
                lastName: data.firstName
            };
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
            processFile(e.target.files[0]);
        }
    };

    const processFile = (file: File) => {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError('Vui lòng chọn file hình ảnh');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError('Kích thước file không được vượt quá 5MB');
            return;
        }

        setSelectedFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);

        const files = e.dataTransfer.files;
        if (files && files[0]) {
            processFile(files[0]);
        }
    };

    const handleEditClick = () => {
        setIsEditing(true);
        setSelectedFile(null);
        setImagePreview(null);
        setError(null);
        setSuccess(null);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setSelectedFile(null);
        setImagePreview(null);
        setError(null);
        setSuccess(null);
        // Reset form data
        if (profile) {
            setFormData({
                firstName: profile.firstName,
                lastName: profile.lastName,
                phoneNumber: profile.phoneNumber || '',
                address: profile.address || '',
                gender: profile.gender || false
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setError(null);
            setSuccess(null);
            setUploadProgress(0);

            // Upload image first if selected
            if (selectedFile) {
                setUploadProgress(30);
                await uploadProfileImage(selectedFile);
                setUploadProgress(70);
            }

            // Update profile data
            await updateUserProfile(formData);
            setUploadProgress(100);

            // Refresh profile data
            await fetchProfile();
            setSuccess('Cập nhật thông tin thành công');
            setIsEditing(false);
            setSelectedFile(null);
            setImagePreview(null);
            setUploadProgress(0);

            // Auto hide success message after 3 seconds
            setTimeout(() => setSuccess(null), 3000);
        } catch (error: unknown) {
            const err = error as Error;
            setError(err.message || 'Cập nhật thông tin thất bại');
            setUploadProgress(0);
        }
    };

    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'admin':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                );
            case 'doctor':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                );
            case 'patient':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                );
            default:
                return null;
        }
    };

    const getProfileCompleteness = () => {
        if (!profile) return 0;

        const fields = [
            profile.firstName,
            profile.lastName,
            profile.email,
            profile.phoneNumber,
            profile.address,
            profile.image
        ];

        const completedFields = fields.filter(field => field && field.trim() !== '').length;
        return Math.round((completedFields / fields.length) * 100);
    };

    if (loading) {
        return <LoadingPage text="Đang tải thông tin hồ sơ..." />;
    }

    const completeness = getProfileCompleteness();

    return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary-50/30">
            <div className="container py-4">
                {/* Enhanced Header with Profile Stats */}
                <div className="m-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div>
                            <h1 className="text-4xl font-bold text-neutral-900 mb-2 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                                Hồ sơ cá nhân
                            </h1>
                            <p className="text-neutral-600 text-lg">
                                Quản lý thông tin cá nhân và cài đặt tài khoản của bạn
                            </p>
                        </div>

                        {/* Profile Completeness Card */}
                        <div className="bg-white rounded-2xl p-6 shadow-medium border border-neutral-200/50 min-w-[280px]">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-sm font-medium text-neutral-600">Độ hoàn thiện hồ sơ</span>
                                <span className="text-2xl font-bold text-primary-600">{completeness}%</span>
                            </div>
                            <div className="w-full bg-neutral-200 rounded-full h-3 mb-2">
                                <div
                                    className="bg-gradient-to-r from-primary-500 to-secondary-500 h-3 rounded-full transition-all duration-1000 ease-out"
                                    style={{ width: `${completeness}%` }}
                                ></div>
                            </div>
                            <p className="text-xs text-neutral-500">
                                {completeness < 70 ? 'Hãy hoàn thiện thêm thông tin' : 'Hồ sơ của bạn đã đầy đủ!'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Enhanced Alerts with Animation */}
                {error && (
                    <div className="mb-6 p-4 bg-error-50 border border-error-200 text-error-700 rounded-2xl shadow-medium animate-in slide-in-from-top-2 duration-300">
                        <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-error-100 rounded-full flex items-center justify-center">
                                    <svg className="w-4 h-4 text-error-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                            <div className="flex-1">
                                <p className="font-medium">{error}</p>
                            </div>
                            <button
                                onClick={() => setError(null)}
                                className="flex-shrink-0 text-error-400 hover:text-error-600 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}

                {success && (
                    <div className="mb-6 p-4 bg-success-50 border border-success-200 text-success-700 rounded-2xl shadow-medium animate-in slide-in-from-top-2 duration-300">
                        <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-success-100 rounded-full flex items-center justify-center">
                                    <svg className="w-4 h-4 text-success-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                            <div className="flex-1">
                                <p className="font-medium">{success}</p>
                            </div>
                            <button
                                onClick={() => setSuccess(null)}
                                className="flex-shrink-0 text-success-400 hover:text-success-600 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Enhanced Profile Card */}
                    <div className="lg:col-span-1">
                        <Card className="overflow-hidden bg-gradient-to-br from-white to-primary-50/30 border-0 shadow-large">
                            <CardBody className="text-center p-8 relative">
                                {/* Background Pattern */}
                                <div className="absolute inset-0 opacity-5">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500 rounded-full -translate-y-16 translate-x-16"></div>
                                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-secondary-500 rounded-full translate-y-12 -translate-x-12"></div>
                                </div>

                                {/* Avatar Section with Drag & Drop */}
                                <div className="relative z-10">
                                    <div
                                        className={cn(
                                            "relative w-36 h-36 mx-auto mb-6 group",
                                            isEditing && "cursor-pointer"
                                        )}
                                        onDragOver={isEditing ? handleDragOver : undefined}
                                        onDragLeave={isEditing ? handleDragLeave : undefined}
                                        onDrop={isEditing ? handleDrop : undefined}
                                        onClick={isEditing ? () => fileInputRef.current?.click() : () => setShowImageModal(true)}
                                    >
                                        <div className={cn(
                                            "w-36 h-36 rounded-full border-4 border-white shadow-large overflow-hidden transition-all duration-300",
                                            isEditing && "group-hover:scale-105",
                                            isDragOver && "border-primary-500 scale-105"
                                        )}>
                                            <img
                                                src={imagePreview || (profile?.image ? (profile.image.startsWith('http') ? profile.image : `http://localhost:8080${profile.image}?${Date.now()}`) : "/images/default-avatar.png")}
                                                alt="Profile"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        {isEditing && (
                                            <>
                                                <input
                                                    ref={fileInputRef}
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleFileChange}
                                                    className="hidden"
                                                />
                                                <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                    <div className="text-white text-center">
                                                        <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        </svg>
                                                        <p className="text-xs">Thay đổi ảnh</p>
                                                    </div>
                                                </div>
                                                <div className="absolute -bottom-2 -right-2 bg-primary-600 text-white p-3 rounded-full shadow-medium">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                    </svg>
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {/* Upload Progress */}
                                    {uploadProgress > 0 && uploadProgress < 100 && (
                                        <div className="mb-4">
                                            <div className="w-full bg-neutral-200 rounded-full h-2">
                                                <div
                                                    className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                                                    style={{ width: `${uploadProgress}%` }}
                                                ></div>
                                            </div>
                                            <p className="text-xs text-neutral-500 mt-1">Đang tải lên... {uploadProgress}%</p>
                                        </div>
                                    )}

                                    {/* User Info */}
                                    <div className="space-y-3 mb-6">
                                        <h2 className="text-2xl font-bold text-neutral-900">
                                            {profile?.firstName} {profile?.lastName}
                                        </h2>

                                        <div className="flex items-center justify-center space-x-2 text-primary-600 bg-primary-50 rounded-full px-4 py-2 mx-auto w-fit">
                                            {getRoleIcon(role)}
                                            <span className="font-medium">{getRoleText(role)}</span>
                                        </div>

                                        {profile?.email && (
                                            <div className="flex items-center justify-center space-x-2 text-sm text-neutral-500">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                                </svg>
                                                <span>{profile.email}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Button */}
                                    {!isEditing && (
                                        <Button onClick={handleEditClick} className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 border-0 shadow-medium">
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                            </svg>
                                            Chỉnh sửa hồ sơ
                                        </Button>
                                    )}
                                </div>
                            </CardBody>
                        </Card>
                    </div>

                    {/* Enhanced Information Card with Tabs */}
                    <div className="lg:col-span-2">
                        <Card className="border-0 shadow-large bg-white">
                            <CardHeader className="border-b border-neutral-100 bg-gradient-to-r from-neutral-50 to-primary-50/20">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <CardTitle className="text-2xl font-bold text-neutral-900">
                                        {isEditing ? (
                                            <div className="flex items-center space-x-2">
                                                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                                                    <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                    </svg>
                                                </div>
                                                <span>Chỉnh sửa thông tin</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center space-x-2">
                                                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                                                    <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                </div>
                                                <span>Thông tin cá nhân</span>
                                            </div>
                                        )}
                                    </CardTitle>

                                    {/* Tab Navigation */}
                                    {!isEditing && (
                                        <div className="flex bg-neutral-100 rounded-xl p-1">
                                            <button
                                                onClick={() => setActiveTab('info')}
                                                className={cn(
                                                    "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                                                    activeTab === 'info'
                                                        ? "bg-white text-primary-600 shadow-sm"
                                                        : "text-neutral-600 hover:text-neutral-900"
                                                )}
                                            >
                                                Thông tin
                                            </button>
                                            <button
                                                onClick={() => setActiveTab('security')}
                                                className={cn(
                                                    "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                                                    activeTab === 'security'
                                                        ? "bg-white text-primary-600 shadow-sm"
                                                        : "text-neutral-600 hover:text-neutral-900"
                                                )}
                                            >
                                                Bảo mật
                                            </button>
                                            <button
                                                onClick={() => setActiveTab('preferences')}
                                                className={cn(
                                                    "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                                                    activeTab === 'preferences'
                                                        ? "bg-white text-primary-600 shadow-sm"
                                                        : "text-neutral-600 hover:text-neutral-900"
                                                )}
                                            >
                                                Tùy chọn
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </CardHeader>
                            <CardBody className="p-8">
                                {isEditing ? (
                                    <form onSubmit={handleSubmit} className="space-y-8">
                                        {/* Personal Information Section */}
                                        <div className="space-y-6">
                                            <div className="flex items-center space-x-2 pb-4 border-b border-neutral-100">
                                                <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center">
                                                    <svg className="w-3 h-3 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                </div>
                                                <h3 className="text-lg font-semibold text-neutral-900">Thông tin cá nhân</h3>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <Input
                                                    label="Họ"
                                                    name="lastName"
                                                    value={formData.lastName}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="transition-all duration-200 focus:scale-[1.02]"
                                                />

                                                <Input
                                                    label="Tên"
                                                    name="firstName"
                                                    value={formData.firstName}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="transition-all duration-200 focus:scale-[1.02]"
                                                />
                                            </div>

                                            <Input
                                                label="Email"
                                                type="email"
                                                value={profile?.email || ''}
                                                disabled
                                                helperText="Email không thể thay đổi"
                                                className="bg-neutral-50"
                                            />

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <Input
                                                    label="Số điện thoại"
                                                    type="tel"
                                                    name="phoneNumber"
                                                    value={formData.phoneNumber}
                                                    onChange={handleInputChange}
                                                    placeholder="Nhập số điện thoại"
                                                    className="transition-all duration-200 focus:scale-[1.02]"
                                                />

                                                <div className="form-group">
                                                    <label className="form-label">Giới tính</label>
                                                    <div className="flex space-x-6 mt-3">
                                                        <label className="flex items-center cursor-pointer group">
                                                            <input
                                                                type="radio"
                                                                name="gender"
                                                                value="true"
                                                                checked={formData.gender === true}
                                                                onChange={handleGenderChange}
                                                                className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500 focus:ring-2"
                                                            />
                                                            <span className="ml-3 text-neutral-700 group-hover:text-neutral-900 transition-colors">Nam</span>
                                                        </label>
                                                        <label className="flex items-center cursor-pointer group">
                                                            <input
                                                                type="radio"
                                                                name="gender"
                                                                value="false"
                                                                checked={formData.gender === false}
                                                                onChange={handleGenderChange}
                                                                className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500 focus:ring-2"
                                                            />
                                                            <span className="ml-3 text-neutral-700 group-hover:text-neutral-900 transition-colors">Nữ</span>
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
                                                className="transition-all duration-200 focus:scale-[1.01]"
                                            />
                                        </div>

                                        {/* Professional Information Section (Doctor only) */}
                                        {role === 'doctor' && (
                                            <div className="space-y-6">
                                                <div className="flex items-center space-x-2 pb-4 border-b border-neutral-100">
                                                    <div className="w-6 h-6 bg-secondary-100 rounded-full flex items-center justify-center">
                                                        <svg className="w-3 h-3 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                        </svg>
                                                    </div>
                                                    <h3 className="text-lg font-semibold text-neutral-900">Thông tin chuyên môn</h3>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <Input
                                                        label="Chuyên khoa"
                                                        value={profile?.Specialty?.name || ''}
                                                        disabled
                                                        helperText="Thông tin này không thể thay đổi"
                                                        className="bg-neutral-50"
                                                    />

                                                    <Input
                                                        label="Vị trí"
                                                        value={profile?.positionData?.valueVi || ''}
                                                        disabled
                                                        helperText="Thông tin này không thể thay đổi"
                                                        className="bg-neutral-50"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {/* Action Buttons */}
                                        <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-8 border-t border-neutral-200">
                                            <Button
                                                type="button"
                                                variant="secondary"
                                                onClick={handleCancelEdit}
                                                className="sm:order-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border-0"
                                            >
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                                Hủy
                                            </Button>
                                            <Button
                                                type="submit"
                                                className="sm:order-2 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 border-0 shadow-medium"
                                                disabled={uploadProgress > 0 && uploadProgress < 100}
                                            >
                                                {uploadProgress > 0 && uploadProgress < 100 ? (
                                                    <>
                                                        <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                        Đang lưu...
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                        Lưu thay đổi
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="space-y-8">
                                        {/* Tab Content */}
                                        {activeTab === 'info' && (
                                            <div className="space-y-8 animate-in fade-in-50 duration-300">
                                                {/* Personal Information */}
                                                <div className="space-y-6">
                                                    <div className="flex items-center space-x-2 pb-4 border-b border-neutral-100">
                                                        <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center">
                                                            <svg className="w-3 h-3 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                            </svg>
                                                        </div>
                                                        <h3 className="text-lg font-semibold text-neutral-900">Thông tin cá nhân</h3>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        <div className="space-y-2">
                                                            <label className="text-sm font-medium text-neutral-500 uppercase tracking-wide">Họ</label>
                                                            <p className="text-lg font-medium text-neutral-900 bg-neutral-50 rounded-lg px-4 py-3">
                                                                {profile?.lastName || <span className="text-neutral-400 italic font-normal">Chưa cập nhật</span>}
                                                            </p>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-sm font-medium text-neutral-500 uppercase tracking-wide">Tên</label>
                                                            <p className="text-lg font-medium text-neutral-900 bg-neutral-50 rounded-lg px-4 py-3">
                                                                {profile?.firstName || <span className="text-neutral-400 italic font-normal">Chưa cập nhật</span>}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium text-neutral-500 uppercase tracking-wide">Email</label>
                                                        <div className="flex items-center space-x-3 bg-neutral-50 rounded-lg px-4 py-3">
                                                            <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                                            </svg>
                                                            <p className="text-lg font-medium text-neutral-900">{profile?.email}</p>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        <div className="space-y-2">
                                                            <label className="text-sm font-medium text-neutral-500 uppercase tracking-wide">Số điện thoại</label>
                                                            <div className="flex items-center space-x-3 bg-neutral-50 rounded-lg px-4 py-3">
                                                                <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                                </svg>
                                                                <p className="text-lg font-medium text-neutral-900">
                                                                    {profile?.phoneNumber || <span className="text-neutral-400 italic font-normal">Chưa cập nhật</span>}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-sm font-medium text-neutral-500 uppercase tracking-wide">Giới tính</label>
                                                            <div className="flex items-center space-x-3 bg-neutral-50 rounded-lg px-4 py-3">
                                                                <div className={cn(
                                                                    "w-5 h-5 rounded-full flex items-center justify-center",
                                                                    profile?.gender ? "bg-blue-100 text-blue-600" : "bg-pink-100 text-pink-600"
                                                                )}>
                                                                    {profile?.gender ? (
                                                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                                            <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM8 10a2 2 0 114 0 2 2 0 01-4 0z" clipRule="evenodd" />
                                                                        </svg>
                                                                    ) : (
                                                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                                                                        </svg>
                                                                    )}
                                                                </div>
                                                                <p className="text-lg font-medium text-neutral-900">{profile?.gender ? 'Nam' : 'Nữ'}</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium text-neutral-500 uppercase tracking-wide">Địa chỉ</label>
                                                        <div className="flex items-start space-x-3 bg-neutral-50 rounded-lg px-4 py-3">
                                                            <svg className="w-5 h-5 text-neutral-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            </svg>
                                                            <p className="text-lg font-medium text-neutral-900 leading-relaxed">
                                                                {profile?.address || <span className="text-neutral-400 italic font-normal">Chưa cập nhật</span>}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Professional Information (Doctor only) */}
                                                {role === 'doctor' && (
                                                    <div className="space-y-6">
                                                        <div className="flex items-center space-x-2 pb-4 border-b border-neutral-100">
                                                            <div className="w-6 h-6 bg-secondary-100 rounded-full flex items-center justify-center">
                                                                <svg className="w-3 h-3 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                                </svg>
                                                            </div>
                                                            <h3 className="text-lg font-semibold text-neutral-900">Thông tin chuyên môn</h3>
                                                        </div>

                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                            <div className="space-y-2">
                                                                <label className="text-sm font-medium text-neutral-500 uppercase tracking-wide">Chuyên khoa</label>
                                                                <div className="flex items-center space-x-3 bg-secondary-50 rounded-lg px-4 py-3">
                                                                    <div className="w-5 h-5 bg-secondary-100 rounded-full flex items-center justify-center">
                                                                        <svg className="w-3 h-3 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                                        </svg>
                                                                    </div>
                                                                    <p className="text-lg font-medium text-neutral-900">
                                                                        {profile?.Specialty?.name || <span className="text-neutral-400 italic font-normal">Chưa cập nhật</span>}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="space-y-2">
                                                                <label className="text-sm font-medium text-neutral-500 uppercase tracking-wide">Vị trí</label>
                                                                <div className="flex items-center space-x-3 bg-secondary-50 rounded-lg px-4 py-3">
                                                                    <div className="w-5 h-5 bg-secondary-100 rounded-full flex items-center justify-center">
                                                                        <svg className="w-3 h-3 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                                                        </svg>
                                                                    </div>
                                                                    <p className="text-lg font-medium text-neutral-900">
                                                                        {profile?.positionData?.valueVi || <span className="text-neutral-400 italic font-normal">Chưa cập nhật</span>}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {activeTab === 'security' && (
                                            <div className="space-y-8 animate-in fade-in-50 duration-300">
                                                <div className="text-center py-12">
                                                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                        <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                        </svg>
                                                    </div>
                                                    <h3 className="text-xl font-semibold text-neutral-900 mb-2">Cài đặt bảo mật</h3>
                                                    <p className="text-neutral-600 mb-6">Tính năng này sẽ được cập nhật trong phiên bản tiếp theo</p>
                                                    <div className="bg-primary-50 rounded-lg p-4 text-sm text-primary-700">
                                                        Bạn có thể thay đổi mật khẩu và cài đặt xác thực hai yếu tố tại đây
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {activeTab === 'preferences' && (
                                            <div className="space-y-8 animate-in fade-in-50 duration-300">
                                                <div className="text-center py-12">
                                                    <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                        <svg className="w-8 h-8 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        </svg>
                                                    </div>
                                                    <h3 className="text-xl font-semibold text-neutral-900 mb-2">Tùy chọn cá nhân</h3>
                                                    <p className="text-neutral-600 mb-6">Tính năng này sẽ được cập nhật trong phiên bản tiếp theo</p>
                                                    <div className="bg-secondary-50 rounded-lg p-4 text-sm text-secondary-700">
                                                        Bạn có thể cài đặt ngôn ngữ, múi giờ và thông báo tại đây
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </CardBody>
                        </Card>
                    </div>
                </div>

                {/* Image Modal */}
                {showImageModal && profile?.image && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setShowImageModal(false)}>
                        <div className="relative max-w-2xl max-h-[80vh]">
                            <img
                                src={profile.image.startsWith('http') ? profile.image : `http://localhost:8080${profile.image}`}
                                alt="Profile"
                                className="max-w-full max-h-full object-contain rounded-lg"
                            />
                            <button
                                onClick={() => setShowImageModal(false)}
                                className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}