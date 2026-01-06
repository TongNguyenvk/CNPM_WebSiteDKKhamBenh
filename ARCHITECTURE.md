# Kiến Trúc Hệ Thống - Medical Booking System

## 1. Kiến Trúc Tổng Thể (System Architecture)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              PRODUCTION ENVIRONMENT                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│    ┌──────────────┐                                                         │
│    │   Internet   │                                                         │
│    │   (Users)    │                                                         │
│    └──────┬───────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│    ┌──────────────────────────────────────────┐                             │
│    │           NGINX (Reverse Proxy)          │                             │
│    │         Port: 80/443 (HTTP/HTTPS)        │                             │
│    │    - SSL Termination (Let's Encrypt)     │                             │
│    │    - Load Balancing                      │                             │
│    │    - Static File Serving                 │                             │
│    └──────────────┬───────────────────────────┘                             │
│                   │                                                          │
│         ┌─────────┴─────────┐                                               │
│         │                   │                                                │
│         ▼                   ▼                                                │
│  ┌─────────────────┐  ┌─────────────────┐                                   │
│  │    FRONTEND     │  │    BACKEND      │                                   │
│  │   (Next.js)     │  │   (Express.js)  │                                   │
│  │   Port: 3000    │  │   Port: 8080    │                                   │
│  │                 │  │                 │                                   │
│  │ - React 18      │  │ - REST API      │                                   │
│  │ - TypeScript    │  │ - JWT Auth      │                                   │
│  │ - Tailwind CSS  │  │ - Sequelize ORM │                                   │
│  │ - SSR/SSG       │  │ - Swagger Docs  │                                   │
│  └─────────────────┘  └────────┬────────┘                                   │
│                                │                                             │
│                                ▼                                             │
│                    ┌─────────────────────┐                                  │
│                    │      MySQL 8.0      │                                  │
│                    │     Port: 3306      │                                  │
│                    │                     │                                  │
│                    │  Database:          │                                  │
│                    │  DBDKKHAMBENH       │                                  │
│                    │                     │                                  │
│                    │  Volume: db_data    │                                  │
│                    └─────────────────────┘                                  │
│                                                                              │
│    ┌────────────────────────────────────────────────────────────────────┐   │
│    │                     Docker Network: cnpm_network                    │   │
│    └────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```


## 2. Kiến Trúc Development (Docker Compose)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          DEVELOPMENT ENVIRONMENT                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│    ┌─────────────────┐         ┌─────────────────┐                          │
│    │    FRONTEND     │ ──────► │    BACKEND      │                          │
│    │   Port: 3000    │  HTTP   │   Port: 8080    │                          │
│    │                 │         │                 │                          │
│    │ NEXT_PUBLIC_    │         │ DB_HOST=db-mysql│                          │
│    │ API_URL=        │         │ DB_PORT=3306    │                          │
│    │ localhost:8080  │         │ DB_NAME=        │                          │
│    │                 │         │ DBDKKHAMBENH    │                          │
│    └─────────────────┘         └────────┬────────┘                          │
│           │                             │                                    │
│           │                             ▼                                    │
│           │                  ┌─────────────────────┐                        │
│           │                  │     DB-MYSQL        │                        │
│           │                  │   Port: 3307:3306   │                        │
│           │                  │                     │                        │
│           │                  │ MYSQL_DATABASE=     │                        │
│           │                  │ DBDKKHAMBENH        │                        │
│           │                  │                     │                        │
│           │                  │ Volume: db_data     │                        │
│           │                  └─────────────────────┘                        │
│           │                                                                  │
│    ┌──────┴─────────────────────────────────────────────────────────────┐   │
│    │                    Docker Network: app-network                      │   │
│    └────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│    Volumes:                                                                  │
│    - db_data: MySQL persistent data                                         │
│    - ./backend/uploads: File uploads                                        │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```


## 3. Kiến Trúc Chi Tiết Backend (Backend Architecture)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           BACKEND - Express.js                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                         Entry Point                                  │    │
│  │                                                                      │    │
│  │   server.js ──► app.js                                              │    │
│  │                   │                                                  │    │
│  │                   ├── CORS Configuration                            │    │
│  │                   ├── JSON Body Parser                              │    │
│  │                   ├── Static Files (/uploads)                       │    │
│  │                   └── Swagger API Docs (/api-docs)                  │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    │                                         │
│                                    ▼                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                          ROUTES LAYER                                │    │
│  │                                                                      │    │
│  │   /api/auth      ──► authRoute.js      (Login, Register)            │    │
│  │   /api/users     ──► userRoute.js      (CRUD Users)                 │    │
│  │   /api/doctors   ──► doctorRoute.js    (Doctor Management)          │    │
│  │   /api/bookings  ──► bookingRoute.js   (Appointment Booking)        │    │
│  │   /api/schedules ──► scheduleRoute.js  (Doctor Schedules)           │    │
│  │   /api/specialty ──► specialtyRoute.js (Medical Specialties)        │    │
│  │   /api/allcode   ──► allcodeRoute.js   (System Codes/Enums)         │    │
│  │                                                                      │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    │                                         │
│                                    ▼                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                        MIDDLEWARE LAYER                              │    │
│  │                                                                      │    │
│  │   ┌─────────────────┐    ┌─────────────────┐                        │    │
│  │   │ authMiddleware  │    │  verifyToken    │                        │    │
│  │   │                 │    │                 │                        │    │
│  │   │ - Role Check    │    │ - JWT Verify    │                        │    │
│  │   │ - Permission    │    │ - Token Decode  │                        │    │
│  │   │ - Admin/Doctor  │    │ - User Extract  │                        │    │
│  │   └─────────────────┘    └─────────────────┘                        │    │
│  │                                                                      │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    │                                         │
│                                    ▼                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                       CONTROLLERS LAYER                              │    │
│  │                                                                      │    │
│  │   ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐  │    │
│  │   │ authController   │  │ userController   │  │ doctorController │  │    │
│  │   │                  │  │                  │  │                  │  │    │
│  │   │ - login()        │  │ - getAllUsers()  │  │ - getDoctors()   │  │    │
│  │   │ - register()     │  │ - getUserById()  │  │ - getDoctorById()│  │    │
│  │   │ - logout()       │  │ - createUser()   │  │ - getBySpecialty │  │    │
│  │   │ - refreshToken() │  │ - updateUser()   │  │                  │  │    │
│  │   └──────────────────┘  │ - deleteUser()   │  └──────────────────┘  │    │
│  │                         └──────────────────┘                         │    │
│  │   ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐  │    │
│  │   │bookingController │  │scheduleController│  │specialtyController│ │    │
│  │   │                  │  │                  │  │                  │  │    │
│  │   │ - createBooking()│  │ - getSchedules() │  │ - getSpecialties │  │    │
│  │   │ - getBookings()  │  │ - createSchedule │  │ - createSpecialty│  │    │
│  │   │ - updateStatus() │  │ - updateSchedule │  │ - updateSpecialty│  │    │
│  │   │ - cancelBooking()│  │ - deleteSchedule │  │ - deleteSpecialty│  │    │
│  │   └──────────────────┘  └──────────────────┘  └──────────────────┘  │    │
│  │                                                                      │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    │                                         │
│                                    ▼                                         │
└─────────────────────────────────────────────────────────────────────────────┘
```


```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        BACKEND - Data Layer (Continued)                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                         MODELS LAYER (Sequelize ORM)                 │    │
│  │                                                                      │    │
│  │   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                 │    │
│  │   │    User     │  │   Booking   │  │  Schedule   │                 │    │
│  │   │             │  │             │  │             │                 │    │
│  │   │ - id        │  │ - id        │  │ - id        │                 │    │
│  │   │ - email     │  │ - patientId │  │ - doctorId  │                 │    │
│  │   │ - password  │  │ - doctorId  │  │ - date      │                 │    │
│  │   │ - firstName │  │ - scheduleId│  │ - timeType  │                 │    │
│  │   │ - lastName  │  │ - status    │  │ - maxNumber │                 │    │
│  │   │ - roleId    │  │ - reason    │  │ - status    │                 │    │
│  │   │ - phone     │  │ - createdAt │  │ - createdAt │                 │    │
│  │   │ - address   │  │             │  │             │                 │    │
│  │   │ - gender    │  │             │  │             │                 │    │
│  │   │ - image     │  │             │  │             │                 │    │
│  │   └─────────────┘  └─────────────┘  └─────────────┘                 │    │
│  │                                                                      │    │
│  │   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                 │    │
│  │   │  Specialty  │  │DoctorDetail │  │   Allcode   │                 │    │
│  │   │             │  │             │  │             │                 │    │
│  │   │ - id        │  │ - doctorId  │  │ - id        │                 │    │
│  │   │ - name      │  │ - specialtyId│ │ - keyMap    │                 │    │
│  │   │ - description│ │ - priceId   │  │ - type      │                 │    │
│  │   │ - image     │  │ - paymentId │  │ - valueVi   │                 │    │
│  │   │             │  │ - provinceId│  │ - valueEn   │                 │    │
│  │   │             │  │ - note      │  │             │                 │    │
│  │   │             │  │ - description│ │             │                 │    │
│  │   └─────────────┘  └─────────────┘  └─────────────┘                 │    │
│  │                                                                      │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    │                                         │
│                                    ▼                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                         DATABASE CONFIG                              │    │
│  │                                                                      │    │
│  │   config/database.js                                                 │    │
│  │   ┌─────────────────────────────────────────────────────────────┐   │    │
│  │   │  Sequelize Instance                                          │   │    │
│  │   │                                                              │   │    │
│  │   │  - Dialect: mysql                                            │   │    │
│  │   │  - Host: DB_HOST (db-mysql in Docker)                        │   │    │
│  │   │  - Port: DB_PORT (3306)                                      │   │    │
│  │   │  - Database: DB_NAME (DBDKKHAMBENH)                          │   │    │
│  │   │  - Pool: { max: 5, min: 0, acquire: 30000, idle: 10000 }     │   │    │
│  │   │                                                              │   │    │
│  │   └─────────────────────────────────────────────────────────────┘   │    │
│  │                                                                      │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    │                                         │
│                                    ▼                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                           MySQL 8.0                                  │    │
│  │                                                                      │    │
│  │   Database: DBDKKHAMBENH                                            │    │
│  │   Tables: Users, Bookings, Schedules, Specialties,                  │    │
│  │           DoctorDetails, Allcodes                                   │    │
│  │                                                                      │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```


## 4. Database Schema (Entity Relationship)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          DATABASE SCHEMA                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌─────────────┐         ┌─────────────┐         ┌─────────────┐           │
│   │   Allcode   │         │    User     │         │  Specialty  │           │
│   │─────────────│         │─────────────│         │─────────────│           │
│   │ PK: id      │◄────────│ FK: roleId  │         │ PK: id      │           │
│   │ keyMap      │◄────────│ FK: genderId│         │ name        │           │
│   │ type        │◄────────│ FK: positionId        │ description │           │
│   │ valueVi     │         │─────────────│         │ image       │           │
│   │ valueEn     │         │ PK: id      │         └──────┬──────┘           │
│   └─────────────┘         │ email       │                │                  │
│                           │ password    │                │                  │
│                           │ firstName   │                │                  │
│                           │ lastName    │                │                  │
│                           │ phone       │                │                  │
│                           │ address     │                │                  │
│                           │ image       │                │                  │
│                           └──────┬──────┘                │                  │
│                                  │                       │                  │
│              ┌───────────────────┼───────────────────────┘                  │
│              │                   │                                          │
│              ▼                   ▼                                          │
│   ┌─────────────────┐    ┌─────────────┐                                   │
│   │  DoctorDetail   │    │  Schedule   │                                   │
│   │─────────────────│    │─────────────│                                   │
│   │ PK: id          │    │ PK: id      │                                   │
│   │ FK: doctorId    │────│ FK: doctorId│                                   │
│   │ FK: specialtyId │    │ date        │                                   │
│   │ FK: priceId     │    │ FK: timeType│──────► Allcode                    │
│   │ FK: paymentId   │    │ maxNumber   │                                   │
│   │ FK: provinceId  │    │ status      │                                   │
│   │ note            │    │ currentNumber│                                  │
│   │ description     │    └──────┬──────┘                                   │
│   └─────────────────┘           │                                          │
│                                 │                                          │
│                                 ▼                                          │
│                        ┌─────────────┐                                     │
│                        │   Booking   │                                     │
│                        │─────────────│                                     │
│                        │ PK: id      │                                     │
│                        │ FK: patientId│──────► User (Patient)              │
│                        │ FK: doctorId │──────► User (Doctor)               │
│                        │ FK: scheduleId│                                   │
│                        │ FK: statusId │──────► Allcode                     │
│                        │ reason       │                                    │
│                        │ createdAt    │                                    │
│                        └─────────────┘                                     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```


## 5. API Endpoints Summary

| Module | Endpoint | Methods | Description |
|--------|----------|---------|-------------|
| Auth | `/api/auth/login` | POST | Đăng nhập |
| Auth | `/api/auth/register` | POST | Đăng ký tài khoản |
| Users | `/api/users` | GET, POST | Danh sách & tạo user |
| Users | `/api/users/:id` | GET, PUT, DELETE | Chi tiết, cập nhật, xóa user |
| Doctors | `/api/doctors` | GET | Danh sách bác sĩ |
| Doctors | `/api/doctors/:id` | GET | Chi tiết bác sĩ |
| Doctors | `/api/doctors/specialty/:id` | GET | Bác sĩ theo chuyên khoa |
| Bookings | `/api/bookings` | GET, POST | Danh sách & tạo lịch hẹn |
| Bookings | `/api/bookings/:id` | GET, PUT, DELETE | Chi tiết, cập nhật, hủy lịch hẹn |
| Schedules | `/api/schedules` | GET, POST | Danh sách & tạo lịch khám |
| Schedules | `/api/schedules/:id` | GET, PUT, DELETE | Chi tiết, cập nhật, xóa lịch khám |
| Specialties | `/api/specialty` | GET, POST | Danh sách & tạo chuyên khoa |
| Specialties | `/api/specialty/:id` | GET, PUT, DELETE | Chi tiết, cập nhật, xóa chuyên khoa |
| Allcode | `/api/allcode` | GET | Danh sách mã hệ thống |

## 6. Technology Stack

### Frontend
- **Framework**: Next.js 15 (React 18)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hook Form
- **HTTP Client**: Axios
- **UI Components**: Lucide React, Framer Motion

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **ORM**: Sequelize
- **Database**: MySQL 8.0
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **File Upload**: Multer
- **API Documentation**: Swagger

### DevOps
- **Containerization**: Docker & Docker Compose
- **Reverse Proxy**: Nginx
- **SSL**: Let's Encrypt
- **Testing**: Jest, Supertest, Playwright
