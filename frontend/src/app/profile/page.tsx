"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserProfile, updateUserProfile } from "@/app/lib/api";
import { jwtDecode } from "jwt-decode";
import { Pencil, Check } from "lucide-react"; // Thêm icon

interface UserProfile {
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
}
interface DecodedToken {
    userId: number;
    email: string;
    exp: number; // Thời gian hết hạn của token
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

    const router = useRouter(); // ✅ Sử dụng router để quay lại trang trước

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const decoded = jwtDecode<DecodedToken>(token);
            const userId = decoded.userId;

            getUserProfile(token)
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
        console.log("Bắt đầu lưu thông tin..."); // Kiểm tra xem hàm có chạy không

        const token = localStorage.getItem("token");

        if (token && user) {
            const decoded = jwtDecode<DecodedToken>(token);
            const userId = decoded.userId;
            try {
                console.log("Dữ liệu gửi đi:", formData);
                const response = await updateUserProfile(token, userId, formData);
                console.log("Cập nhật thành công:", response);

                setUser(formData);
                setIsEditing(false);
                alert("Cập nhật thành công!");
            } catch (err) {
                console.error("Lỗi cập nhật:", err);
                alert("Có lỗi xảy ra khi cập nhật thông tin.");
            }
        } else {
            console.error("Không có token hoặc user!");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-xl rounded-lg p-6 w-full max-w-md">
                <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
                    Thông tin cá nhân
                </h2>

                {user ? (
                    <>
                        {[
                            { label: "Họ", name: "firstName" },
                            { label: "Tên", name: "lastName" },
                            { label: "Số điện thoại", name: "phoneNumber" },
                        ].map((field) => (
                            <div key={field.name} className="mb-4">
                                <label className="block text-gray-600 font-medium">{field.label}</label>
                                <input
                                    type="text"
                                    name={field.name}
                                    value={formData[field.name as keyof UserProfile] || ""}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className={`w-full p-3 border rounded-lg text-black ${isEditing ? "bg-white" : "bg-gray-200"}`}
                                />
                            </div>
                        ))}

                        {/* Email (Không chỉnh sửa được) */}
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

                        {/* 📝 Nút Chỉnh sửa / ✅ Nút Lưu */}
                        <button
                            onClick={isEditing ? handleSave : () => setIsEditing(true)}
                            className={`w-full p-3 mt-4 rounded-lg text-white font-medium flex items-center justify-center gap-2 transition-all ${isEditing
                                ? "bg-green-500 hover:bg-green-600"
                                : "bg-blue-500 hover:bg-blue-600"
                                }`}
                        >
                            {isEditing ? <Check size={20} /> : <Pencil size={20} />}
                            {isEditing ? "Lưu" : "Chỉnh sửa"}
                        </button>
                    </>
                ) : (
                    <p className="text-center text-gray-500">Đang tải thông tin...</p>
                )}
            </div>

            {/* 🔙 Nút Quay lại */}
            <button style={{ color: "black", padding: "10px 20px ", borderRadius: "100px", border: "2px solid cyan", cursor: "pointer", marginBottom: "20px", marginTop: "30px" }}
                onClick={() => router.back()} > ← Quay lại
            </button>

        </div>
    );
};

export default UserProfilePage;
