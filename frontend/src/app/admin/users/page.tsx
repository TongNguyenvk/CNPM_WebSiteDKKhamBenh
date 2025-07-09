'use client';

import { useState, useEffect, useRef } from 'react';
import { getAllUsersByRole, createDoctor, createAdmin, updateUser, deleteUser, getAllSpecialties } from '@/lib/api';
import { toast } from 'react-hot-toast';
import SimpleEditor from './components/SimpleEditor';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input, Select } from '@/components/ui/input';
import { LoadingPage } from '@/components/ui/loading';
import { Modal, ModalBody, ModalFooter } from '@/components/ui/modal';
import { cn } from '@/lib/utils';

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
    specialtyData?: {
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
    const [usersByRole, setUsersByRole] = useState<UsersByRole>({
        R1: [],
        R2: [],
        R3: []
    });
    const [selectedRole, setSelectedRole] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [sortBy, setSortBy] = useState<string>('firstName');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage] = useState<number>(10);
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
    const [loading, setLoading] = useState(true);
  
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        loadUsers();
        loadSpecialties();
    }, []);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const data = await getAllUsersByRole();
            console.log('DATA USERS BY ROLE:', data);
            setUsersByRole(data);
        } catch (error) {
            toast.error('Lỗi khi tải danh sách người dùng');
        } finally {
            setLoading(false);
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
            setFormData({
                email: '',
                password: '',
                firstName: '',
                lastName: '',
                roleId: '',
                phoneNumber: '',
                address: '',
                gender: true
            });
            loadUsers();
        } catch (error) {
            toast.error('Lỗi khi tạo người dùng');
        }
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
            loadUsers();
        } catch (error) {
            toast.error('Lỗi khi cập nhật người dùng');
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

    const getUsersToDisplay = () => {
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

        // Filter by search term
        if (searchTerm) {
            usersToDisplay = usersToDisplay.filter(user =>
                `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (user.specialtyData?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (user.phoneNumber || '').includes(searchTerm)
            );
        }

        // Sort users
        usersToDisplay.sort((a, b) => {
            let aValue: string | number = '';
            let bValue: string | number = '';

            switch (sortBy) {
                case 'firstName':
                    aValue = a.firstName || '';
                    bValue = b.firstName || '';
                    break;
                case 'lastName':
                    aValue = a.lastName || '';
                    bValue = b.lastName || '';
                    break;
                case 'email':
                    aValue = a.email || '';
                    bValue = b.email || '';
                    break;
                case 'createdAt':
                    aValue = new Date(a.createdAt || '').getTime();
                    bValue = new Date(b.createdAt || '').getTime();
                    break;
                default:
                    aValue = a.firstName || '';
                    bValue = b.firstName || '';
            }

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return sortOrder === 'asc'
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            } else {
                return sortOrder === 'asc'
                    ? (aValue as number) - (bValue as number)
                    : (bValue as number) - (aValue as number);
            }
        });

        return usersToDisplay;
    };

    const getPaginatedUsers = () => {
        const allUsers = getUsersToDisplay();
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return allUsers.slice(startIndex, endIndex);
    };

    const getTotalPages = () => {
        const allUsers = getUsersToDisplay();
        return Math.ceil(allUsers.length / itemsPerPage);
    };

    const getRoleBadge = (roleId: string) => {
        const roleMap: Record<string, { variant: any; text: string }> = {
            R1: { variant: 'primary', text: 'Bệnh nhân' },
            R2: { variant: 'success', text: 'Bác sĩ' },
            R3: { variant: 'warning', text: 'Admin' }
        };

        const role = roleMap[roleId] || { variant: 'neutral', text: 'Không xác định' };
        return (
            <Badge variant={role.variant} size="sm">
                {role.text}
            </Badge>
        );
    };

    const handleEditUser = (user: UserProfile) => {
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
            specialtyId: user.specialtyData?.id || 1,
            image: ''
        });
        setIsEditModalOpen(true);
    };

    if (loading) {
        return <LoadingPage text="Đang tải danh sách người dùng..." />;
    }

    const usersToDisplay = getPaginatedUsers();
    const totalUsers = getUsersToDisplay().length;
    const totalPages = getTotalPages();

    return (
        <div className="min-h-screen bg-neutral-50">
            <div className="container py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-neutral-900 mb-2">
                        Quản Lý Người Dùng
                    </h1>
                    <p className="text-neutral-600">
                        Quản lý tài khoản bác sĩ, admin và theo dõi hoạt động người dùng
                    </p>
                </div>

                {/* Filters and Actions */}
                <Card className="mb-6">
                    <CardBody className="p-6">
                        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                            <div className="flex flex-col sm:flex-row gap-4 flex-1">
                                {/* Search */}
                                <div className="relative flex-1 max-w-md">
                                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    <input
                                        type="text"
                                        placeholder="Tìm kiếm theo tên, email, chuyên khoa..."
                                        className="form-input pl-10"
                                        value={searchTerm}
                                        onChange={(e) => {
                                            setSearchTerm(e.target.value);
                                            setCurrentPage(1); // Reset to first page when searching
                                        }}
                                    />
                                </div>

                                {/* Role Filter */}
                                <select
                                    value={selectedRole}
                                    onChange={(e) => {
                                        setSelectedRole(e.target.value);
                                        setCurrentPage(1); // Reset to first page when filtering
                                    }}
                                    className="form-select min-w-[150px]"
                                >
                                    <option value="all">Tất cả quyền</option>
                                    <option value="R1">Bệnh nhân</option>
                                    <option value="R2">Bác sĩ</option>
                                    <option value="R3">Admin</option>
                                </select>

                                {/* Sort By */}
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="form-select min-w-[150px]"
                                >
                                    <option value="firstName">Sắp xếp theo tên</option>
                                    <option value="lastName">Sắp xếp theo họ</option>
                                    <option value="email">Sắp xếp theo email</option>
                                    <option value="createdAt">Sắp xếp theo ngày tạo</option>
                                </select>

                                {/* Sort Order */}
                                <button
                                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                    className="btn-secondary px-3 py-2 min-w-[100px]"
                                >
                                    {sortOrder === 'asc' ? '↑ Tăng dần' : '↓ Giảm dần'}
                                </button>
                            </div>

                            {/* Add User Button */}
                            <Button onClick={() => setIsCreateModalOpen(true)}>
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Thêm người dùng
                            </Button>
                        </div>
                    </CardBody>
                </Card>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                    <Card>
                        <CardBody className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-neutral-900">{usersByRole.R1.length}</p>
                                <p className="text-sm text-neutral-600">Bệnh nhân</p>
                            </div>
                        </CardBody>
                    </Card>

                    <Card>
                        <CardBody className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-success-100 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-neutral-900">{usersByRole.R2.length}</p>
                                <p className="text-sm text-neutral-600">Bác sĩ</p>
                            </div>
                        </CardBody>
                    </Card>

                    <Card>
                        <CardBody className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-warning-100 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-neutral-900">{usersByRole.R3.length}</p>
                                <p className="text-sm text-neutral-600">Admin</p>
                            </div>
                        </CardBody>
                    </Card>

                    <Card>
                        <CardBody className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-neutral-900">{usersToDisplay.length}</p>
                                <p className="text-sm text-neutral-600">Hiển thị</p>
                            </div>
                        </CardBody>
                    </Card>
                </div>

                {/* Users Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Danh sách người dùng ({usersToDisplay.length})
                        </CardTitle>
                    </CardHeader>
                    <CardBody className="p-0">
                        {usersToDisplay.length === 0 ? (
                            <div className="text-center py-16">
                                <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-12 h-12 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                                    Không tìm thấy người dùng nào
                                </h3>
                                <p className="text-neutral-600 mb-6">
                                    {searchTerm ? 'Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc.' : 'Chưa có người dùng nào trong hệ thống.'}
                                </p>
                                {searchTerm && (
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setSearchTerm('');
                                            setSelectedRole('all');
                                        }}
                                    >
                                        Xóa bộ lọc
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead className="bg-neutral-50 border-b border-neutral-200">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">ID</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Người dùng</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Email</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Quyền</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Chuyên khoa</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-neutral-200">
                                        {usersToDisplay.map((user) => (
                                            <tr key={user.id} className="hover:bg-neutral-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                                                    #{user.id}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                                                            <span className="text-primary-600 font-medium text-sm">
                                                                {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-neutral-900">
                                                                {user.firstName} {user.lastName}
                                                            </p>
                                                            {user.phoneNumber && (
                                                                <p className="text-xs text-neutral-500">
                                                                    {user.phoneNumber}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                                                    {user.email}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {getRoleBadge(user.roleId)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                                                    {user.specialtyData?.name || (
                                                        <span className="text-neutral-400 italic">-</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center space-x-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleEditUser(user)}
                                                        >
                                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                            </svg>
                                                            Sửa
                                                        </Button>
                                                        <Button
                                                            variant="error"
                                                            size="sm"
                                                            onClick={() => handleDeleteUser(user.id)}
                                                        >
                                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                            Xóa
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardBody>
                </Card>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-6">
                        <div className="text-sm text-neutral-600">
                            Hiển thị {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, totalUsers)} trong tổng số {totalUsers} người dùng
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                            >
                                Trước
                            </Button>

                            {/* Page numbers */}
                            <div className="flex items-center space-x-1">
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    let pageNum;
                                    if (totalPages <= 5) {
                                        pageNum = i + 1;
                                    } else if (currentPage <= 3) {
                                        pageNum = i + 1;
                                    } else if (currentPage >= totalPages - 2) {
                                        pageNum = totalPages - 4 + i;
                                    } else {
                                        pageNum = currentPage - 2 + i;
                                    }

                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => setCurrentPage(pageNum)}
                                            className={cn(
                                                "px-3 py-1 text-sm rounded-md transition-colors",
                                                currentPage === pageNum
                                                    ? "bg-primary-600 text-white"
                                                    : "text-neutral-600 hover:bg-neutral-100"
                                            )}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                            </div>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                            >
                                Sau
                            </Button>
                        </div>
                    </div>
                )}

                {/* Create User Modal */}
                <Modal
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    title="Thêm người dùng mới"
                    size="lg"
                >
                    <ModalBody>
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    label="Email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    placeholder="Nhập địa chỉ email"
                                />

                                <Input
                                    label="Mật khẩu"
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                    placeholder="Nhập mật khẩu"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    label="Họ"
                                    type="text"
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    required
                                    placeholder="Nhập họ"
                                />

                                <Input
                                    label="Tên"
                                    type="text"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    required
                                    placeholder="Nhập tên"
                                />
                            </div>

                            <Select
                                label="Vai trò"
                                value={formData.roleId}
                                onChange={(e) => setFormData({ ...formData, roleId: e.target.value })}
                                options={[
                                    { value: '', label: 'Chọn vai trò' },
                                    { value: 'R2', label: 'Bác sĩ' },
                                    { value: 'R3', label: 'Admin' }
                                ]}
                                required
                            />
                            {/* Image Upload */}
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-3">Ảnh đại diện</label>
                                <div className="flex items-center space-x-6">
                                    <div className="w-20 h-20 rounded-full overflow-hidden bg-neutral-100 flex items-center justify-center">
                                        {imagePreview ? (
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        )}
                                    </div>
                                    <div>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            {imagePreview ? 'Đổi ảnh' : 'Chọn ảnh'}
                                        </Button>
                                        <p className="text-xs text-neutral-500 mt-1">
                                            PNG, JPG tối đa 5MB
                                        </p>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleImageChange}
                                            accept="image/*"
                                            className="hidden"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Doctor specific fields */}
                            {formData.roleId === "R2" && (
                                <>
                                    <Select
                                        label="Chuyên khoa"
                                        value={formData.specialtyId?.toString() || ''}
                                        onChange={(e) => setFormData({ ...formData, specialtyId: Number(e.target.value) })}
                                        options={[
                                            { value: '', label: 'Chọn chuyên khoa' },
                                            ...specialties.map(specialty => ({
                                                value: specialty.id.toString(),
                                                label: specialty.name
                                            }))
                                        ]}
                                        required
                                    />

                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-3">Mô tả bác sĩ</label>
                                        <div className="border border-neutral-300 rounded-lg">
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

                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsCreateModalOpen(false)}
                        >
                            Hủy
                        </Button>
                        <Button onClick={handleCreateUser}>
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Tạo người dùng
                        </Button>
                    </ModalFooter>
                </Modal>

                {/* Edit User Modal */}
                <Modal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    title="Cập nhật người dùng"
                    size="md"
                >
                    <ModalBody>
                        <div className="space-y-6">
                            <Input
                                label="Email"
                                type="email"
                                value={formData.email}
                                disabled
                                helperText="Email không thể thay đổi"
                            />

                            <Input
                                label="Mật khẩu mới"
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder="Để trống nếu không đổi mật khẩu"
                                helperText="Chỉ nhập nếu muốn thay đổi mật khẩu"
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    label="Họ"
                                    type="text"
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    placeholder="Nhập họ"
                                />

                                <Input
                                    label="Tên"
                                    type="text"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    placeholder="Nhập tên"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    label="Số điện thoại"
                                    type="text"
                                    value={formData.phoneNumber}
                                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                    placeholder="Nhập số điện thoại"
                                />

                                <Input
                                    label="Địa chỉ"
                                    type="text"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    placeholder="Nhập địa chỉ"
                                />
                            </div>

                            {formData.roleId === 'R2' && (
                                <Select
                                    label="Chuyên khoa"
                                    value={formData.specialtyId?.toString() || ''}
                                    onChange={(e) => setFormData({ ...formData, specialtyId: Number(e.target.value) })}
                                    options={[
                                        { value: '', label: 'Chọn chuyên khoa' },
                                        ...specialties.map(specialty => ({
                                            value: specialty.id.toString(),
                                            label: specialty.name
                                        }))
                                    ]}
                                />
                            )}
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsEditModalOpen(false)}
                        >
                            Hủy
                        </Button>
                        <Button onClick={handleUpdateUser}>
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Cập nhật
                        </Button>
                    </ModalFooter>
                </Modal>
            </div>
        </div>
    );
}