// src/app/lib/api.ts
import axios from 'axios';

const API_URL = 'http://localhost:8080/api'; // Thay đổi URL backend của bạn

const loginUser = async (userData: any) => {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, userData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export { loginUser };