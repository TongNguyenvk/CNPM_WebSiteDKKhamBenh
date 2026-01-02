'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface PageLayoutProps {
  children: ReactNode
  className?: string
}

// Full-height page layout that prevents scrolling
export function PageLayout({ children, className }: PageLayoutProps) {
  return (
    <div className={cn('h-[calc(100vh-4rem)] flex flex-col overflow-hidden', className)}>
      {children}
    </div>
  )
}

interface PageHeaderProps {
  title: string
  subtitle?: string
  actions?: ReactNode
}

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b bg-white flex-shrink-0">
      <div>
        <h1 className="text-xl font-bold text-gray-900">{title}</h1>
        {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  )
}

interface PageContentProps {
  children: ReactNode
  className?: string
  noPadding?: boolean
}

export function PageContent({ children, className, noPadding }: PageContentProps) {
  return (
    <div className={cn('flex-1 overflow-hidden', !noPadding && 'p-6', className)}>
      {children}
    </div>
  )
}

interface SplitViewProps {
  left: ReactNode
  right: ReactNode
  leftWidth?: string
  showRight?: boolean
}

// Split view for master-detail pattern
export function SplitView({ left, right, leftWidth = 'w-1/2', showRight = true }: SplitViewProps) {
  return (
    <div className="flex h-full gap-4">
      <div className={cn('flex flex-col', showRight ? leftWidth : 'w-full')}>
        {left}
      </div>
      {showRight && (
        <div className="flex-1 flex flex-col">
          {right}
        </div>
      )}
    </div>
  )
}
