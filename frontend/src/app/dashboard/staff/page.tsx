"use client";
import { useRouter } from 'next/navigation';
import { useUser } from '../../lib/UserContext';
import Image from "next/image";
import { useEffect, useState } from "react";

interface Booking {
    id: number;
    patientName: string;
    date: string;
    time: string;
    status: string;
}

export default function DashboardStaffPage() {
    const router = useRouter();
    const { roleId, loading, user } = useUser();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [pageLoading, setPageLoading] = useState(true);

    useEffect(() => {
        if (!loading) {
            if (roleId !== 'R4') {
                router.replace('/dashboard');
                return;
            }
            // Giả lập fetch danh sách lịch khám
            setTimeout(() => {
                setBookings([
                    { id: 1, patientName: 'Nguyễn Văn A', date: '2024-06-01', time: '08:00', status: 'Chờ xác nhận' },
                    { id: 2, patientName: 'Trần Thị B', date: '2024-06-02', time: '09:30', status: 'Chờ xác nhận' },
                ]);
                setPageLoading(false);
            }, 800);
        }
    }, [roleId, loading, router]);

    if (loading || pageLoading) return <div className="p-6 text-center">Đang tải trang nhân viên...</div>;

    return (
        <div style={{ fontFamily: "Montserrat, sans-serif", minHeight: "100vh", background: "#f5f7fa" }}>
            {/* NavBar */}
            <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50 px-6 py-4 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center">
                    <Image src="https://phuongnamvina.com/img_data/images/logo-benh-vien.jpg" alt="Logo" width={100} height={50} className="rounded-md shadow-sm" />
                </div>
                {/* Menu */}
                <ul className="flex space-x-12 text-lg font-medium items-center">
                    <li>
                        <button onClick={() => router.push("/dashboard")} className="hover:text-blue-600 transition-colors duration-200 bg-transparent border-none">Dashboard</button>
                    </li>
                    <li>
                        <button onClick={() => router.push("/profile")} className="hover:text-blue-600 transition-colors duration-200 bg-transparent border-none">Tôi</button>
                    </li>
                    <li>
                        <button onClick={() => router.push("/contact")} className="hover:text-blue-600 transition-colors duration-200 bg-transparent border-none">Liên hệ</button>
                    </li>
                    <li>
                        <div className="flex items-center space-x-2">
                            <Image src={user?.image ? `/${user.image}` : "/default-avatar.png"} alt="avatar" width={40} height={40} className="rounded-full border" />
                            <span className="text-base font-semibold">{user?.firstName || "Nhân viên"}</span>
                        </div>
                    </li>
                </ul>
            </nav>
            {/* Khoảng trống cho nav */}
            <div style={{ marginTop: "100px" }}></div>

            <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
                <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-3xl text-center">
                    <h1 className="text-3xl font-bold mb-8 text-blue-700">Xác nhận lịch khám</h1>
                    <table className="w-full mb-8 border rounded-xl overflow-hidden">
                        <thead className="bg-blue-100">
                            <tr>
                                <th className="py-3 px-4">Mã lịch</th>
                                <th className="py-3 px-4">Bệnh nhân</th>
                                <th className="py-3 px-4">Ngày</th>
                                <th className="py-3 px-4">Giờ</th>
                                <th className="py-3 px-4">Trạng thái</th>
                                <th className="py-3 px-4">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((b) => (
                                <tr key={b.id} className="border-b hover:bg-blue-50">
                                    <td className="py-2 px-4">{b.id}</td>
                                    <td className="py-2 px-4">{b.patientName}</td>
                                    <td className="py-2 px-4">{b.date}</td>
                                    <td className="py-2 px-4">{b.time}</td>
                                    <td className="py-2 px-4">{b.status}</td>
                                    <td className="py-2 px-4">
                                        <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-700 transition mr-2">Xác nhận</button>
                                        <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 transition">Huỷ</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button onClick={() => router.push('/dashboard')} className="w-full p-3 mt-4 rounded-lg bg-gray-200 text-gray-800 font-medium hover:bg-gray-300">Quay lại Dashboard</button>
                </div>
            </div>
        </div>
    );
} 