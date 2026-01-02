'use client';

import { useState, useEffect, useMemo } from 'react';
import { getAllUsersByRole, createDoctor, createAdmin, updateUser, deleteUser, getAllSpecialties } from '@/lib/api';
import { SlidePanel, DataTable } from '@/components/ui';
import { toast } from 'react-hot-toast';

interface Specialty { id: number; name: string; }
interface User {
    id: number; email: string; firstName: string; lastName: string; roleId: string;
    phoneNumber?: string; address?: string; gender?: boolean; image?: string;
    specialtyData?: { id: number; name: string }; positionData?: { keyMap: string; valueVi: string };
}
interface UsersByRole { R1: User[]; R2: User[]; R3: User[]; }

const roleConfig: Record<string, { label: string; bg: string; color: string }> = {
    R1: { label: 'Bệnh nhân', bg: 'bg-blue-100', color: 'text-blue-700' },
    R2: { label: 'Bác sĩ', bg: 'bg-green-100', color: 'text-green-700' },
    R3: { label: 'Admin', bg: 'bg-purple-100', color: 'text-purple-700' },
};

const positions = [
    { key: 'P0', label: 'Bác sĩ' }, { key: 'P1', label: 'Thạc sĩ' }, { key: 'P2', label: 'Tiến sĩ' },
    { key: 'P3', label: 'Phó giáo sư' }, { key: 'P4', label: 'Giáo sư' },
];

export default function UsersPage() {
    const [usersByRole, setUsersByRole] = useState<UsersByRole>({ R1: [], R2: [], R3: [] });
    const [specialties, setSpecialties] = useState<Specialty[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRole, setSelectedRole] = useState<'R1' | 'R2' | 'R3'>('R1');
    const [searchTerm, setSearchTerm] = useState('');
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        email: '', password: '', firstName: '', lastName: '', roleId: 'R2',
        phoneNumber: '', address: '', gender: true, positionId: 'P0', specialtyId: 0, description: ''
    });

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [users, specs] = await Promise.all([getAllUsersByRole(), getAllSpecialties()]);
            setUsersByRole(users);
            const validSpecs = specs.filter((s: { id?: number; name?: string }) => s.id && s.name).map((s: { id?: number; name?: string }) => ({ id: s.id as number, name: s.name as string }));
            setSpecialties(validSpecs);
        } catch (error: unknown) {
            toast.error(error instanceof Error ? error.message : 'Lỗi khi tải dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = useMemo(() => {
        return usersByRole[selectedRole].filter(u => {
            if (!searchTerm) return true;
            const search = searchTerm.toLowerCase();
            return `${u.firstName} ${u.lastName}`.toLowerCase().includes(search) || u.email.toLowerCase().includes(search);
        });
    }, [usersByRole, selectedRole, searchTerm]);

    const openCreatePanel = () => {
        setEditingUser(null);
        const newRoleId = selectedRole === 'R1' ? 'R2' : selectedRole;
        setFormData({ 
            email: '', password: '', firstName: '', lastName: '', roleId: newRoleId, 
            phoneNumber: '', address: '', gender: true, positionId: 'P0', specialtyId: 0, description: '' 
        });
        setIsPanelOpen(true);
    };

    const openEditPanel = (user: User) => {
        setEditingUser(user);
        setFormData({
            email: user.email, password: '', firstName: user.firstName, lastName: user.lastName, roleId: user.roleId,
            phoneNumber: user.phoneNumber || '', address: user.address || '', gender: user.gender ?? true,
            positionId: user.positionData?.keyMap || 'P0', specialtyId: user.specialtyData?.id || 0, description: ''
        });
        setIsPanelOpen(true);
    };

    const handleSave = async () => {
        if (!formData.email || !formData.firstName || !formData.lastName) {
            toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
            return;
        }
        setSubmitting(true);
        try {
            if (editingUser) {
                await updateUser(editingUser.id, formData);
                toast.success('Cập nhật thành công');
            } else {
                if (!formData.password) { toast.error('Vui lòng nhập mật khẩu'); setSubmitting(false); return; }
                if (formData.roleId === 'R2') {
                    if (!formData.specialtyId) { toast.error('Vui lòng chọn chuyên khoa'); setSubmitting(false); return; }
                    await createDoctor({ ...formData, specialtyId: formData.specialtyId, descriptionMarkdown: formData.description, descriptionHTML: formData.description });
                } else if (formData.roleId === 'R3') {
                    await createAdmin(formData);
                }
                toast.success('Tạo người dùng thành công');
            }
            loadData();
            setIsPanelOpen(false);
        } catch (error: unknown) {
            toast.error(error instanceof Error ? error.message : 'Lỗi');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm('Xác nhận xóa người dùng này?')) return;
        try { 
            await deleteUser(id); 
            toast.success('Đã xóa'); 
            // Cập nhật state trực tiếp để UI refresh ngay
            setUsersByRole(prev => ({
                ...prev,
                [selectedRole]: prev[selectedRole].filter(u => u.id !== id)
            }));
        }
        catch (error: unknown) { toast.error(error instanceof Error ? error.message : 'Lỗi'); }
    };

    const columns = useMemo(() => {
        const base = [
            {
                key: 'name', header: 'Người dùng',
                render: (u: User) => (
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {u.firstName.charAt(0)}{u.lastName.charAt(0)}
                        </div>
                        <div>
                            <div className="font-medium text-gray-900">{u.firstName} {u.lastName}</div>
                            <div className="text-xs text-gray-500">{u.email}</div>
                        </div>
                    </div>
                )
            },
            { key: 'phoneNumber', header: 'SĐT', render: (u: User) => u.phoneNumber || '-' },
        ];

        if (selectedRole === 'R2') {
            base.push({
                key: 'specialty', header: 'Chuyên khoa',
                render: (u: User) => (
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                        {u.specialtyData?.name || '-'}
                    </span>
                )
            });
        }

        base.push({
            key: 'actions', header: '',
            render: (u: User) => (
                <div className="flex justify-end gap-1">
                    <button onClick={() => openEditPanel(u)} className="p-1.5 hover:bg-gray-100 rounded-lg transition" title="Sửa">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </button>
                    <button onClick={(e) => handleDelete(u.id, e)} className="p-1.5 hover:bg-red-50 rounded-lg transition" title="Xóa">
                        <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            )
        });

        return base;
    }, [selectedRole]);

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    const tabs: { key: 'R1' | 'R2' | 'R3'; label: string; count: number }[] = [
        { key: 'R1', label: 'Bệnh nhân', count: usersByRole.R1.length },
        { key: 'R2', label: 'Bác sĩ', count: usersByRole.R2.length },
        { key: 'R3', label: 'Admin', count: usersByRole.R3.length },
    ];

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b bg-white flex-shrink-0">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Quản lý người dùng</h1>
                    <p className="text-sm text-gray-500">{filteredUsers.length} {roleConfig[selectedRole].label.toLowerCase()}</p>
                </div>
                {selectedRole !== 'R1' && (
                    <button onClick={openCreatePanel} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Thêm {roleConfig[selectedRole].label.toLowerCase()}
                    </button>
                )}
            </div>

            {/* Toolbar */}
            <div className="flex items-center gap-4 px-6 py-3 border-b bg-white flex-shrink-0">
                {/* Tabs */}
                <div className="flex bg-gray-100 p-1 rounded-lg">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setSelectedRole(tab.key)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                                selectedRole === tab.key
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            <span>{tab.label}</span>
                            <span className={`px-1.5 py-0.5 rounded text-xs ${selectedRole === tab.key ? 'bg-gray-100' : 'bg-gray-200'}`}>
                                {tab.count}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Search */}
                <div className="relative flex-1 max-w-xs">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Tìm kiếm..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-hidden bg-white">
                <DataTable
                    columns={columns}
                    data={filteredUsers}
                    keyField="id"
                    compact
                    pageSize={15}
                    emptyMessage={`Không có ${roleConfig[selectedRole].label.toLowerCase()} nào`}
                />
            </div>

            {/* Slide Panel */}
            <SlidePanel
                isOpen={isPanelOpen}
                onClose={() => setIsPanelOpen(false)}
                title={editingUser ? 'Chỉnh sửa thông tin' : `Thêm ${roleConfig[formData.roleId as keyof typeof roleConfig]?.label.toLowerCase() || 'người dùng'}`}
                width="md"
            >
                <div className="space-y-4">
                    {!editingUser && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Loại tài khoản</label>
                            <div className="flex gap-3">
                                <label className={`flex-1 p-3 border-2 rounded-xl cursor-pointer transition text-center ${formData.roleId === 'R2' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                    <input type="radio" name="roleId" value="R2" checked={formData.roleId === 'R2'}
                                        onChange={(e) => setFormData({ ...formData, roleId: e.target.value })} className="sr-only" />
                                    <div className="text-sm font-medium">Bác sĩ</div>
                                </label>
                                <label className={`flex-1 p-3 border-2 rounded-xl cursor-pointer transition text-center ${formData.roleId === 'R3' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                    <input type="radio" name="roleId" value="R3" checked={formData.roleId === 'R3'}
                                        onChange={(e) => setFormData({ ...formData, roleId: e.target.value })} className="sr-only" />
                                    <div className="text-sm font-medium">Admin</div>
                                </label>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Họ <span className="text-red-500">*</span></label>
                            <input type="text" value={formData.firstName}
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tên <span className="text-red-500">*</span></label>
                            <input type="text" value={formData.lastName}
                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
                        <input type="email" value={formData.email} disabled={!!editingUser}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100" />
                    </div>

                    {!editingUser && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu <span className="text-red-500">*</span></label>
                            <input type="password" value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500" />
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                            <input type="tel" value={formData.phoneNumber}
                                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Giới tính</label>
                            <select value={formData.gender ? 'true' : 'false'}
                                onChange={(e) => setFormData({ ...formData, gender: e.target.value === 'true' })}
                                className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500">
                                <option value="true">Nam</option>
                                <option value="false">Nữ</option>
                            </select>
                        </div>
                    </div>

                    {(formData.roleId === 'R2' || editingUser?.roleId === 'R2') && (
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Chuyên khoa {!editingUser && <span className="text-red-500">*</span>}</label>
                                <select value={formData.specialtyId}
                                    onChange={(e) => setFormData({ ...formData, specialtyId: Number(e.target.value) })}
                                    className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500">
                                    <option value={0}>Chọn chuyên khoa</option>
                                    {specialties.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Học vị</label>
                                <select value={formData.positionId}
                                    onChange={(e) => setFormData({ ...formData, positionId: e.target.value })}
                                    className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500">
                                    {positions.map(p => <option key={p.key} value={p.key}>{p.label}</option>)}
                                </select>
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                        <input type="text" value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500" />
                    </div>

                    <div className="flex gap-3 pt-4 border-t">
                        <button onClick={() => setIsPanelOpen(false)}
                            className="flex-1 px-4 py-2 text-sm font-medium border rounded-lg hover:bg-gray-50 transition">
                            Hủy
                        </button>
                        <button onClick={handleSave} disabled={submitting}
                            className="flex-1 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50">
                            {submitting ? 'Đang lưu...' : (editingUser ? 'Cập nhật' : 'Tạo mới')}
                        </button>
                    </div>
                </div>
            </SlidePanel>
        </div>
    );
}
