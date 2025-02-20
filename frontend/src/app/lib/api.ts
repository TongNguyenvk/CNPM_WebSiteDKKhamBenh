// src/app/lib/api.ts
import axios from 'axios';

const API_URL = 'http://localhost:8080/api'; // Thay đổi URL backend của bạn

interface UserData {
    email: string;
    password: string;
}

interface LoginResponse {
    token: string;
    userId: number;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
}

interface ApiError { // Di chuyển interface ApiError vào đây
    response?: {
        data?: {
            message?: string;
        };
    };
    message?: string;
}

const loginUser = async (userData: UserData): Promise<LoginResponse> => {
    try {
        const response = await axios.post<LoginResponse>(`${API_URL}/auth/login`, userData);
        return response.data;
    } catch (error: unknown) { // Vẫn cần any ở đây, nhưng đã có ApiError
        const err = error as ApiError; // Ép kiểu error về ApiError
        throw err;
    }
};

export { loginUser };