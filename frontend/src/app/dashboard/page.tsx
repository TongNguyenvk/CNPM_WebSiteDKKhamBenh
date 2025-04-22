"use client";
import { useRouter } from "next/navigation";
import { useUser } from "../lib/UserContext";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function DashboardPage() {
    const router = useRouter();
    const { roleId, loading, user } = useUser();
    const [ready, setReady] = useState(false);

    useEffect(() => {
        if (!loading) {
            if (!roleId) {
                router.replace("/login?redirect=/dashboard");
                return;
            }
            if (roleId === "R2") {
                router.replace("/dashboard/bacsi");
                return;
            }
            if (roleId === "R3") {
                router.replace("/dashboard/admin");
                return;
            }
            if (roleId === "R4") {
                router.replace("/dashboard/staff");
                return;
            }
            if (roleId === "R1") {
                router.replace("/dashboard/patient");
                return;
            }
            setReady(true); // Chỉ R1 (bệnh nhân) mới được render dashboard này
        }
    }, [roleId, loading, router]);

    if (loading || !ready) {
        return <div className="p-6 text-center">Đang tải dashboard...</div>;
    }

    // Chỉ render UI cho bệnh nhân (R1)
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
                        <button onClick={() => router.push("/contact")} className="hover:text-blue-600 transition-colors duration-200 bg-transparent border-none">Liên hệ</button>
                    </li>
                    <li>
                        <button onClick={() => router.push("/profile")} className="hover:text-blue-600 transition-colors duration-200 bg-transparent border-none">Tôi</button>
                    </li>

                    <li>
                        <div className="flex items-center space-x-2">
                            <Image src={user?.image ? `/${user.image}` : "/default-avatar.png"} alt="avatar" width={40} height={40} className="rounded-full border" />
                            <span className="text-base font-semibold">{user?.firstName || "User"}</span>
                        </div>
                    </li>
                </ul>
            </nav>
            {/* Khoảng trống cho nav */}
            <div style={{ marginTop: "100px" }}></div>

            <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
                <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-2xl text-center">
                    <h1 className="text-3xl font-bold mb-8 text-blue-700">Dashboard</h1>
                    <button
                        className="p-6 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold text-lg shadow hover:scale-105 transition-transform mb-6"
                        onClick={() => router.push("/home")}
                    >
                        Trang chủ (Bệnh nhân)
                    </button>
                    <button
                        className="w-full p-3 mt-4 rounded-lg bg-gray-200 text-gray-800 font-medium hover:bg-gray-300"
                        onClick={() => router.push("/logout")}
                    >
                        Đăng xuất
                    </button>
                </div>
            </div>
        </div>
    );
} 