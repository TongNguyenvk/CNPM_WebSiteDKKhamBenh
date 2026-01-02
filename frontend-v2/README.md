# Medical Booking Frontend

Frontend mới cho hệ thống đặt lịch khám bệnh, xây dựng với Next.js 14 App Router.

## Cài đặt

```bash
cd frontend-v2
npm install
```

## Chạy development

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000)

## Cấu trúc thư mục

```
src/
├── app/                    # App Router pages
│   ├── (auth)/            # Auth pages (login, register)
│   ├── (main)/            # Protected pages
│   │   ├── admin/         # Admin dashboard
│   │   ├── doctor/        # Doctor dashboard
│   │   └── patient/       # Patient dashboard
│   ├── layout.tsx
│   └── page.tsx
├── components/            # Reusable components
│   ├── layout/           # Header, Sidebar
│   └── ui/               # Button, Input, Modal, etc.
├── hooks/                # Custom hooks (useAuth)
├── lib/                  # Utilities
│   ├── api.ts           # Axios instance
│   ├── services/        # API services
│   └── utils.ts         # Helper functions
└── types/               # TypeScript types
```

## Tính năng

### Bệnh nhân (R1)
- Xem danh sách chuyên khoa
- Xem danh sách bác sĩ
- Đặt lịch khám
- Quản lý lịch hẹn

### Bác sĩ (R2)
- Đăng ký lịch làm việc
- Xem lịch hẹn của bệnh nhân
- Xác nhận/Hủy/Hoàn thành lịch hẹn

### Admin (R3)
- Quản lý người dùng
- Quản lý chuyên khoa
- Quản lý lịch khám
- Duyệt lịch làm việc của bác sĩ

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Zustand (State management)
- Axios (HTTP client)
- React Hot Toast (Notifications)
- Lucide React (Icons)
