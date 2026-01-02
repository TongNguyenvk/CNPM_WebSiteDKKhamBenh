'use client';

import { useState, useEffect, useRef } from 'react';
import { getUserProfile, updateUserProfile, uploadProfileImage } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { getAvatarUrl } from '@/lib/utils';

interface Profile {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    address?: string;
    gender?: boolean;
    image?: string;
    createdAt?: string;
}

export default function PatientProfilePage() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', phoneNumber: '', address: '', gender: true
    });

    useEffect(() => { fetchProfile(); }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const data = await getUserProfile();
            setProfile(data);
            setFormData({
                firstName: data.firstName || '',
                lastName: data.lastName || '',
                phoneNumber: data.phoneNumber || '',
                address: data.address || '',
                gender: data.gender ?? true,
            });
        } catch (error) {
            console.error('Error:', error);
            toast.error('Không thể tải thông tin');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSubmitting(true);
        try {
            if (selectedFile) await uploadProfileImage(selectedFile);
            await updateUserProfile(formData);
            toast.success('Cập nhật thành công!');
            setEditing(false);
            setSelectedFile(null);
            setImagePreview(null);
            fetchProfile();
        } catch (error: unknown) {
            toast.error(error instanceof Error ? error.message : 'Lỗi cập nhật');
        } finally {
            setSubmitting(false);
        }
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) { toast.error('Vui lòng chọn file hình ảnh'); return; }
        if (file.size > 5 * 1024 * 1024) { toast.error('File quá lớn (tối đa 5MB)'); return; }
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
            toast.success('Đã chọn ảnh. Nhấn "Lưu" để cập nhật.');
        };
        reader.readAsDataURL(file);
    };

    const handleCancel = () => {
        setEditing(false);
        setSelectedFile(null);
        setImagePreview(null);
        if (profile) {
            setFormData({
                firstName: profile.firstName || '',
                lastName: profile.lastName || '',
                phoneNumber: profile.phoneNumber || '',
                address: profile.address || '',
                gender: profile.gender ?? true,
            });
        }
    };

    const getProfileCompleteness = () => {
        if (!profile) return 0;
        const fields = [profile.firstName, profile.lastName, profile.email, profile.phoneNumber, profile.address, profile.image];
        const completed = fields.filter(f => f && String(f).trim() !== '').length;
        return Math.round((completed / fields.length) * 100);
    };

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    const avatarSrc = imagePreview || (profile?.image ? getAvatarUrl(profile.image) : null);
    const completeness = getProfileCompleteness();

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b bg-white flex-shrink-0">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Hồ sơ cá nhân</h1>
                    <p className="text-sm text-gray-500">Quản lý thông tin cá nhân</p>
                </div>
                {!editing ? (
                    <button onClick={() => setEditing(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Chỉnh sửa
                    </button>
                ) : (
                    <div className="flex gap-2">
                        <button onClick={handleCancel} className="px-4 py-2 font-medium border rounded-lg hover:bg-gray-50">Hủy</button>
                        <button onClick={handleSave} disabled={submitting} className="px-4 py-2 font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
                            {submitting ? 'Đang lưu...' : 'Lưu'}
                        </button>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 p-4 bg-gray-50">
                <div className="bg-white rounded-xl border p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Avatar */}
                        <div className="flex flex-col items-center lg:w-48 flex-shrink-0">
                            <div className="relative group mb-3">
                                {avatarSrc ? (
                                    /* eslint-disable-next-line @next/next/no-img-element */
                                    <img src={avatarSrc} alt="Avatar" className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg" />
                                ) : (
                                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                                        {profile?.firstName?.charAt(0)}{profile?.lastName?.charAt(0)}
                                    </div>
                                )}
                                {editing && (
                                    <label className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="text-white text-center">
                                            <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
                                    </label>
                                )}
                            </div>
                            <h2 className="text-lg font-bold text-gray-900 text-center">{profile?.firstName} {profile?.lastName}</h2>
                            <p className="text-gray-500 text-sm mb-3">{profile?.email}</p>
                            
                            {/* Profile Completeness */}
                            <div className="w-full max-w-[160px]">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs text-gray-500">Hoàn thiện</span>
                                    <span className="text-xs font-bold text-blue-600">{completeness}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-1.5">
                                    <div className="bg-blue-600 h-1.5 rounded-full transition-all" style={{ width: `${completeness}%` }}></div>
                                </div>
                            </div>
                        </div>

                        {/* Info Grid */}
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Họ</label>
                                {editing ? (
                                    <input type="text" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                                ) : (
                                    <p className="text-gray-900 font-medium">{profile?.firstName || '-'}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Tên</label>
                                {editing ? (
                                    <input type="text" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                                ) : (
                                    <p className="text-gray-900 font-medium">{profile?.lastName || '-'}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Giới tính</label>
                                {editing ? (
                                    <select value={formData.gender ? 'true' : 'false'} onChange={(e) => setFormData({ ...formData, gender: e.target.value === 'true' })}
                                        className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
                                        <option value="true">Nam</option>
                                        <option value="false">Nữ</option>
                                    </select>
                                ) : (
                                    <p className="text-gray-900 font-medium">{profile?.gender ? 'Nam' : 'Nữ'}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Số điện thoại</label>
                                {editing ? (
                                    <input type="tel" value={formData.phoneNumber} onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                                ) : (
                                    <p className="text-gray-900 font-medium">{profile?.phoneNumber || '-'}</p>
                                )}
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-medium text-gray-500 mb-1">Địa chỉ</label>
                                {editing ? (
                                    <input type="text" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                                ) : (
                                    <p className="text-gray-900 font-medium">{profile?.address || '-'}</p>
                                )}
                            </div>
                        </div>
                    </div>
                    {profile?.createdAt && (
                        <p className="text-xs text-gray-400 mt-4 pt-4 border-t">
                            Tham gia từ: {new Date(profile.createdAt).toLocaleDateString('vi-VN')}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
