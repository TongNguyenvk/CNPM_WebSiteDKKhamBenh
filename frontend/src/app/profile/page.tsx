"use client";
import { useEffect, useState } from "react";
import { getUserProfile, updateUserProfile } from "@/app/lib/api";
import { jwtDecode } from "jwt-decode";


interface UserProfile {
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
}

const UserProfilePage = () => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<UserProfile>({
        userId: 0,
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
    });

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const decoded: any = jwtDecode(token);
            const userId = decoded.userId; // Lấy userId từ token

            getUserProfile(token, userId)
                .then((data) => {
                    setUser(data);
                    setFormData(data);
                })
                .catch((err) => console.error("Lỗi khi lấy thông tin người dùng:", err));
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        const token = localStorage.getItem("token");
        if (token && user) {
            try {
                await updateUserProfile(token, user.userId, formData);
                setUser(formData); // Cập nhật UI
                setIsEditing(false);
                alert("Cập nhật thành công!");
            } catch (err) {
                console.error("Lỗi cập nhật:", err);
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-xl rounded-lg p-6 w-full max-w-md">
                <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
                    Thông tin cá nhân
                </h2>

                {user ? (
                    <>
                        <div className="mb-4">
                            <label className="block text-gray-600 font-medium">Họ</label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className={`w-full p-3 border rounded-lg text-black ${isEditing ? "bg-white" : "bg-gray-200"
                                    }`}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-600 font-medium">Tên</label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className={`w-full p-3 border rounded-lg text-black ${isEditing ? "bg-white" : "bg-gray-200"
                                    }`}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-600 font-medium">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                disabled
                                className="w-full p-3 border rounded-lg bg-gray-300 text-gray-700 cursor-not-allowed"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-600 font-medium">Số điện thoại</label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phoneNumber || ""}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className={`w-full p-3 border rounded-lg text-black ${isEditing ? "bg-white" : "bg-gray-200"
                                    }`}
                            />
                        </div>

                        <button
                            onClick={isEditing ? handleSave : () => setIsEditing(true)}
                            className={`w-full p-3 mt-4 rounded-lg text-white font-medium transition-all ${isEditing
                                ? "bg-blue-500 hover:bg-blue-600"
                                : "bg-gray-500 hover:bg-gray-600"
                                }`}
                        >
                            {isEditing ? "Lưu" : "Chỉnh sửa"}
                        </button>
                    </>
                ) : (
                    <p className="text-center text-gray-500">Đang tải thông tin...</p>
                )}
            </div>
        </div>
    );
};

export default UserProfilePage;
