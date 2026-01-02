'use client';

import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';

interface Column<T> {
    key: string;
    header: string;
    width?: string;
    render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    keyField: keyof T;
    onRowClick?: (item: T) => void;
    selectedId?: number | string | null;
    emptyMessage?: string;
    emptyIcon?: React.ReactNode;
    compact?: boolean;
    pageSize?: number; // Items per page, default 10
    showPagination?: boolean; // Show pagination controls
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function DataTable<T extends Record<string, any>>({
    columns,
    data,
    keyField,
    onRowClick,
    selectedId,
    emptyMessage = 'Không có dữ liệu',
    emptyIcon,
    compact = false,
    pageSize = 10,
    showPagination = true,
}: DataTableProps<T>) {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(data.length / pageSize);
    
    const paginatedData = useMemo(() => {
        if (!showPagination) return data;
        const start = (currentPage - 1) * pageSize;
        return data.slice(start, start + pageSize);
    }, [data, currentPage, pageSize, showPagination]);

    // Reset to page 1 when data changes
    React.useEffect(() => {
        setCurrentPage(1);
    }, [data.length]);

    const goToPage = (page: number) => {
        setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    };

    const renderPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisible = 5;
        
        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (currentPage <= 3) {
                pages.push(1, 2, 3, 4, '...', totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
            }
        }
        
        return pages;
    };

    return (
        <div className="flex flex-col h-full">
            {/* Table container with scroll */}
            <div className="flex-1 overflow-auto min-h-0">
                <table className="w-full">
                    <thead className="bg-gray-50 sticky top-0 z-10">
                        <tr>
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    className={cn(
                                        'text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b',
                                        compact ? 'px-4 py-2.5' : 'px-6 py-3',
                                        col.width
                                    )}
                                >
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                        {paginatedData.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="text-center py-12">
                                    <div className="flex flex-col items-center text-gray-400">
                                        {emptyIcon || (
                                            <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                            </svg>
                                        )}
                                        <p className="text-sm">{emptyMessage}</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            paginatedData.map((item) => (
                                <tr
                                    key={String(item[keyField])}
                                    onClick={() => onRowClick?.(item)}
                                    className={cn(
                                        'transition-colors',
                                        onRowClick && 'cursor-pointer hover:bg-blue-50',
                                        selectedId === item[keyField] && 'bg-blue-50 border-l-2 border-l-blue-500'
                                    )}
                                >
                                    {columns.map((col) => (
                                        <td
                                            key={col.key}
                                            className={cn(
                                                'text-sm text-gray-700',
                                                compact ? 'px-4 py-2.5' : 'px-6 py-4'
                                            )}
                                        >
                                            {col.render ? col.render(item) : (item[col.key] as React.ReactNode)}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {showPagination && data.length > 0 && totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t bg-white flex-shrink-0">
                    <div className="text-sm text-gray-500">
                        Hiển thị {((currentPage - 1) * pageSize) + 1} - {Math.min(currentPage * pageSize, data.length)} / {data.length}
                    </div>
                    
                    <div className="flex items-center gap-1">
                        {/* Previous */}
                        <button
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>

                        {/* Page numbers */}
                        {renderPageNumbers().map((page, idx) => (
                            typeof page === 'number' ? (
                                <button
                                    key={idx}
                                    onClick={() => goToPage(page)}
                                    className={cn(
                                        'min-w-[32px] h-8 px-2 text-sm rounded transition-colors',
                                        currentPage === page
                                            ? 'bg-blue-600 text-white'
                                            : 'hover:bg-gray-100 text-gray-700'
                                    )}
                                >
                                    {page}
                                </button>
                            ) : (
                                <span key={idx} className="px-1 text-gray-400">...</span>
                            )
                        ))}

                        {/* Next */}
                        <button
                            onClick={() => goToPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
