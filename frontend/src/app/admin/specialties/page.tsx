'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { getAllSpecialties, createSpecialty, updateSpecialty, deleteSpecialty } from '@/lib/api';
import { SlidePanel, DataTable } from '@/components/ui';
import { toast } from 'react-hot-toast';
import { getSpecialtyImageUrl } from '@/lib/utils';

interface Specialty {
    id?: number;
    name: string;
    description?: string;
    image?: string;
}

export default function SpecialtiesPage() {
    const [specialties, setSpecialties] = useState<Specialty[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [editingSpecialty, setEditingSpecialty] = useState<Specialty | null>(null);
    const [formData, setFormData] = useState({ name: '', description: '', image: '' });
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => { loadSpecialties(); }, []);

    const loadSpecialties = async () => {
        try {
            setLoading(true);
            const data = await getAllSpecialties();
            setSpecialties(data);
        } catch (error: unknown) {
            toast.error(error instanceof Error ? error.message : 'Lỗi khi tải danh sách');
        } finally {
            setLoading(false);
        }
    };

    const filteredSpecialties = useMemo(() => {
        return specialties.filter(s =>
            s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (s.description || '').toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [specialties, searchTerm]);

    const openCreatePanel = () => {
        setEditingSpecialty(null);
        setFormData({ name: '', description: '', image: '' });
        setImagePreview(null);
        setIsPanelOpen(true);
    };

    const openEditPanel = (specialty: Specialty) => {
        setEditingSpecialty(specialty);
        setFormData({ name: specialty.name, description: specialty.description || '', image: specialty.image || '' });
        // Use helper to get full URL for preview
        setImagePreview(specialty.image ? getSpecialtyImageUrl(specialty.image) : null);
        setIsPanelOpen(true);
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            toast.error('Kích thước file không được vượt quá 5MB');
            return;
        }

        // Upload file to backend
        setUploading(true);
        try {
            const uploadData = new FormData();
            uploadData.append('image', file);

            const token = localStorage.getItem('token');
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
            
            const response = await fetch(`${apiUrl}/specialties/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: uploadData,
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Upload failed');
            }

            const { url } = await response.json();
            // url từ backend dạng /uploads/specialties/xxx.png
            // Lưu path tương đối vào database, frontend sẽ thêm base URL khi hiển thị
            const baseUrl = apiUrl.replace('/api', '');
            setImagePreview(`${baseUrl}${url}`); // Preview dùng full URL
            setFormData(prev => ({ ...prev, image: url })); // Lưu path tương đối
            toast.success('Upload ảnh thành công');
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Lỗi upload ảnh');
        } finally {
            setUploading(false);
        }
    };

    const removeImage = () => {
        setImagePreview(null);
        setFormData({ ...formData, image: '' });
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSave = async () => {
        if (!formData.name.trim()) {
            toast.error('Vui lòng nhập tên chuyên khoa');
            return;
        }
        setSubmitting(true);
        try {
            if (editingSpecialty?.id) {
                await updateSpecialty(editingSpecialty.id, formData);
                toast.success('Cập nhật thành công');
            } else {
                await createSpecialty(formData);
                toast.success('Tạo chuyên khoa thành công');
            }
            loadSpecialties();
            setIsPanelOpen(false);
        } catch (error: unknown) {
            toast.error(error instanceof Error ? error.message : 'Lỗi khi lưu');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm('Bạn có chắc chắn muốn xóa chuyên khoa này?')) return;
        try {
            await deleteSpecialty(id);
            toast.success('Xóa thành công');
            loadSpecialties();
        } catch (error: unknown) {
            toast.error(error instanceof Error ? error.message : 'Lỗi khi xóa');
        }
    };

    const columns = useMemo(() => [
        {
            key: 'id', header: 'ID', width: 'w-16',
            render: (s: Specialty) => <span className="text-gray-500 text-xs">#{s.id}</span>
        },
        {
            key: 'name', header: 'Chuyên khoa',
            render: (s: Specialty) => {
                // Use helper function to get proper image URL
                const imageUrl = s.image ? getSpecialtyImageUrl(s.image) : null;
                return (
                    <div className="flex items-center gap-3">
                        {imageUrl ? (
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img 
                                    src={imageUrl} 
                                    alt={s.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                />
                            </div>
                        ) : (
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                        )}
                        <span className="font-medium text-gray-900">{s.name}</span>
                    </div>
                );
            }
        },
        {
            key: 'description', header: 'Mô tả',
            render: (s: Specialty) => (
                <span className="text-gray-500 text-sm line-clamp-1">
                    {s.description ? s.description.substring(0, 60) + (s.description.length > 60 ? '...' : '') : '-'}
                </span>
            )
        },
        {
            key: 'actions', header: '', width: 'w-24',
            render: (s: Specialty) => (
                <div className="flex justify-end gap-1">
                    <button onClick={() => openEditPanel(s)} className="p-1.5 hover:bg-gray-100 rounded-lg transition" title="Sửa">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </button>
                    <button onClick={(e) => s.id && handleDelete(s.id, e)} className="p-1.5 hover:bg-red-50 rounded-lg transition" title="Xóa">
                        <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            )
        },
    ], []);

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b bg-white flex-shrink-0">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Quản lý chuyên khoa</h1>
                    <p className="text-sm text-gray-500">{filteredSpecialties.length} chuyên khoa</p>
                </div>
                <button onClick={openCreatePanel} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Thêm chuyên khoa
                </button>
            </div>

            {/* Toolbar */}
            <div className="flex items-center gap-4 px-6 py-3 border-b bg-white flex-shrink-0">
                <div className="relative flex-1 max-w-xs">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Tìm kiếm chuyên khoa..."
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
                    data={filteredSpecialties}
                    keyField="id"
                    compact
                    pageSize={15}
                    emptyMessage="Chưa có chuyên khoa nào"
                />
            </div>

            {/* Slide Panel */}
            <SlidePanel
                isOpen={isPanelOpen}
                onClose={() => setIsPanelOpen(false)}
                title={editingSpecialty ? 'Chỉnh sửa chuyên khoa' : 'Thêm chuyên khoa mới'}
                width="md"
            >
                <div className="space-y-4">
                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Hình ảnh</label>
                        <div className="flex items-start gap-4">
                            {/* Preview */}
                            <div className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 overflow-hidden flex items-center justify-center bg-gray-50 flex-shrink-0">
                                {imagePreview ? (
                                    /* eslint-disable-next-line @next/next/no-img-element */
                                    <img 
                                        src={imagePreview} 
                                        alt="Preview" 
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = '';
                                            (e.target as HTMLImageElement).style.display = 'none';
                                        }}
                                    />
                                ) : (
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                )}
                            </div>
                            
                            {/* Upload controls */}
                            <div className="flex-1">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    disabled={uploading}
                                    className="hidden"
                                    id="image-upload"
                                />
                                <div className="flex flex-col gap-2">
                                    <label
                                        htmlFor="image-upload"
                                        className={`inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg cursor-pointer transition w-fit ${
                                            uploading 
                                                ? 'text-gray-400 bg-gray-100 cursor-not-allowed' 
                                                : 'text-blue-600 bg-blue-50 hover:bg-blue-100'
                                        }`}
                                    >
                                        {uploading ? (
                                            <>
                                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Đang upload...
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                                </svg>
                                                Chọn ảnh
                                            </>
                                        )}
                                    </label>
                                    {imagePreview && (
                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition w-fit"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                            Xóa ảnh
                                        </button>
                                    )}
                                    <p className="text-xs text-gray-500">PNG, JPG tối đa 5MB</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tên chuyên khoa <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="VD: Tim mạch, Nội khoa..."
                            className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Mô tả ngắn về chuyên khoa..."
                            rows={4}
                            className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                        />
                    </div>

                    <div className="flex gap-3 pt-4 border-t">
                        <button
                            onClick={() => setIsPanelOpen(false)}
                            className="flex-1 px-4 py-2 text-sm font-medium border rounded-lg hover:bg-gray-50 transition"
                        >
                            Hủy
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={submitting || uploading}
                            className="flex-1 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                        >
                            {submitting ? 'Đang lưu...' : (editingSpecialty ? 'Cập nhật' : 'Tạo mới')}
                        </button>
                    </div>
                </div>
            </SlidePanel>
        </div>
    );
}
