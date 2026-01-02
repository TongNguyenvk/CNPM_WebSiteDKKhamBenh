import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import './globals.css'

const inter = Inter({ subsets: ['latin', 'vietnamese'] })

export const metadata: Metadata = {
  title: 'Medical Booking - Đặt lịch khám bệnh trực tuyến',
  description: 'Hệ thống đặt lịch khám bệnh trực tuyến',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  )
}
