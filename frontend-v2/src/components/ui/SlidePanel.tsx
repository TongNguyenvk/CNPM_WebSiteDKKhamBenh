'use client'

import { Fragment, ReactNode, useEffect } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SlidePanelProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  width?: 'sm' | 'md' | 'lg' | 'xl'
}

export function SlidePanel({ isOpen, onClose, title, children, width = 'md' }: SlidePanelProps) {
  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const widths = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  }

  return (
    <Fragment>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 bg-black/30 z-40 transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />
      
      {/* Panel */}
      <div
        className={cn(
          'fixed inset-y-0 right-0 z-50 w-full bg-white shadow-2xl transform transition-transform duration-300 ease-out flex flex-col',
          widths[width],
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b bg-gray-50 flex-shrink-0">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        
        {/* Content - scrollable if needed */}
        <div className="flex-1 overflow-y-auto p-5">
          {children}
        </div>
      </div>
    </Fragment>
  )
}
