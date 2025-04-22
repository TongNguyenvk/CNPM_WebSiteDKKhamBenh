"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserProfile } from "../lib/api";

export default function DashboardPage() {
    const router = useRouter();
    const [roleId, setRoleId] = useState<string>("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login?redirect=/dashboard");
            return;
        }
        getUserProfile(token).then(profile => {
            setRoleId(profile.roleId);
            setLoading(false);
        }).catch(() => {
            router.push("/login?redirect=/dashboard");
        });
    }, [router]);

    if (loading) return <div className="p-6 text-center">Đang tải dashboard...</div>;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-lg text-center">
                <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
                {roleId === 'R3' && (
                    <button
                        className="w-full p-3 mb-4 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700"
                        onClick={() => router.push("/dashboard/admin")}
                    >
                        Quản lý hệ thống (Admin)
                    </button>
                )}
                {roleId === 'R2' && (
                    <button
                        className="w-full p-3 mb-4 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700"
                        onClick={() => router.push("/dashboard/bacsi")}
                    >
                        Quản lý lịch hẹn (Bác sĩ)
                    </button>
                )}
                {roleId === 'R1' && (
                    <>
                        <button
                            className="w-full p-3 mb-4 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700"
                            onClick={() => router.push("/book_appointment")}
                        >
                            Xem lịch khám của bạn
                        </button>
                        <button
                            className="w-full p-3 mb-4 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700"
                            onClick={() => router.push("/bookingcare")}
                        >
                            Đặt lịch khám mới
                        </button>
                    </>
                )}
                {roleId === 'R4' && (
                    <button
                        className="w-full p-3 mb-4 rounded-lg bg-yellow-600 text-white font-medium hover:bg-yellow-700"
                        onClick={() => router.push("/dashboard/staff")}
                    >
                        Xác nhận lịch khám (Nhân viên)
                    </button>
                )}
                <button
                    className="w-full p-3 mt-4 rounded-lg bg-gray-200 text-gray-800 font-medium hover:bg-gray-300"
                    onClick={() => router.push("/home")}
                >
                    Quay lại trang chủ
                </button>
            </div>
        </div>
    );
} 