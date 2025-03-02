import axios from 'axios';

const API_URL = 'http://localhost:8080/api/'; // Thay đổi URL backend của bạn nếu cần

interface UserData {
  username: string;
  password: string;
}

interface LoginResponse {
  token: string;
  role: 'benhnhan' | 'bacsi' | 'admin'; // Đảm bảo khớp với backend
  firstName?: string; // Thêm optional nếu backend có thể không trả về
  lastName?: string; // Thêm optional nếu backend có thể không trả về
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

export const loginUser = async (userData: UserData): Promise<LoginResponse> => {
  try {
    const response = await axios.post<LoginResponse>(`${API_URL}/auth/login`, userData);
    return response.data;
  } catch (err: unknown) {
    const error = err as ApiError;
    throw error.response?.data?.message || error.message || 'Đăng nhập thất bại';
  }
};

export type { LoginResponse }; // Xuất LoginResponse để sử dụng trong page.tsx
export default { loginUser }; // Xuất default để dễ import





















// // src/app/lib/api.ts
// import axios from 'axios';

// const API_URL = 'http://localhost:8080/api'; // Thay đổi URL backend của bạn

// interface UserData {
//     email: string;
//     password: string;
// }

// interface LoginResponse {
//     token: string;
//     userId: number;
//     email: string;
//     firstName: string;
//     lastName: string;
//     role: string;
// }

// interface ApiError { // Di chuyển interface ApiError vào đây
//     response?: {
//         data?: {
//             message?: string;
//         };
//     };
//     message?: string;
// }

// const loginUser = async (userData: UserData): Promise<LoginResponse> => {
//     try {
//         const response = await axios.post<LoginResponse>(`${API_URL}/auth/login`, userData);
//         return response.data;
//     } catch (error: unknown) { // Vẫn cần any ở đây, nhưng đã có ApiError
//         const err = error as ApiError; // Ép kiểu error về ApiError
//         throw err;
//     }
// };

// export { loginUser };