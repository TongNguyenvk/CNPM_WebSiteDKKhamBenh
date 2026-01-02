'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface Column<T> {
  key: string
  header: string
  width?: string
  render?: (item: T) => ReactNode
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  keyField: keyof T
  onRowClick?: (item: T) => void
  selectedId?: number | string | null
  emptyMessage?: string
  compact?: boolean
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  keyField,
  onRowClick,
  selectedId,
  emptyMessage = 'Không có dữ liệu',
  compact = false,
}: DataTableProps<T>) {
  return (
    <div className="overflow-auto flex-1 scrollbar-thin">
      <table className="w-full">
        <thead className="bg-gray-50 sticky top-0 z-10">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  'text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b',
                  compact ? 'px-3 py-2' : 'px-4 py-3',
                  col.width
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center text-gray-400 py-12"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item) => (
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
                      compact ? 'px-3 py-2' : 'px-4 py-3'
                    )}
                  >
                    {col.render ? col.render(item) : item[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
