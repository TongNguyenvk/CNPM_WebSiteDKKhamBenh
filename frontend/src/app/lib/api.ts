// src/app/lib/api.ts
import axios from 'axios';

const API_URL = 'http://localhost:8080/api'; // Thay đổi URL backend của bạn

interface UserData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  phone?: string;
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

const getUserProfile = async (token: string, userId: number) => {
  try {
    const response = await axios.get(`${API_URL}/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    const err = error as ApiError;
    throw err;
  }
};

const updateUserProfile = async (token: string, userId: number, userData: UpdateUserData) => {
  if (!token) {
      console.error("Lỗi: Không tìm thấy token xác thực");
      return;
  }

  if (!userId) {
      console.error("Lỗi: userId không hợp lệ");
      return;
  }

  try {
      const response = await axios.put(`${API_URL}/users/${userId}`, userData, {
          headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
  } catch (error) {
      console.error("Lỗi cập nhật người dùng:", error);
      throw error; // Có thể hiển thị thông báo lỗi trên giao diện
  }
};


export { loginUser, getUserProfile, updateUserProfile };


// // src/app/lib/api.ts
// import axios, { AxiosError } from 'axios'; // Import thêm AxiosError

// // --- Định nghĩa các Interfaces (Nên đặt trong file types.ts riêng) ---
// // Giả sử các interface này đã được định nghĩa ở đâu đó (ví dụ: src/app/types.ts)
// import type {
//     Doctor,
//     Schedule,
//     Booking,
//     Specialty,
//     UserProfile,
//     LoginResponse,
//     UserData, // Dùng cho login/register
//     UpdateUserData, // Dùng cho update profile
//     CreateBookingData // Dữ liệu để tạo booking
// } from '@/app/types'; // Thay đổi đường dẫn nếu cần

// // Kiểu dữ liệu chuẩn hóa cho lỗi API trả về
// interface ApiErrorResponse {
//   message: string;
//   // Có thể thêm các trường khác từ backend nếu cần
// }

// // Kiểu dữ liệu cho đối tượng lỗi được xử lý
// export interface HandledApiError {
//   message: string;
//   status?: number; // Thêm status code nếu có
//   data?: ApiErrorResponse | any; // Dữ liệu lỗi gốc từ backend
// }

// // --- Cấu hình API ---

// // Lấy API URL từ biến môi trường, có fallback cho development
// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// // Tạo một Axios instance với cấu hình mặc định
// const apiClient = axios.create({
//   baseURL: API_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // --- Hàm Helper Xử lý Lỗi API ---

// /**
//  * Xử lý lỗi từ Axios hoặc các lỗi khác và chuẩn hóa thành HandledApiError.
//  * @param error Lỗi gốc (thường từ Axios).
//  * @param defaultMessage Thông báo lỗi mặc định nếu không lấy được từ response.
//  * @returns Đối tượng HandledApiError.
//  */
// const handleApiError = (error: unknown, defaultMessage = 'Đã có lỗi xảy ra'): HandledApiError => {
//   if (axios.isAxiosError(error)) {
//     // Lỗi từ Axios (có response từ server hoặc lỗi mạng)
//     const responseData = error.response?.data as ApiErrorResponse | undefined;
//     console.error('API Error:', error.response?.status, responseData);
//     return {
//       message: responseData?.message || error.message || defaultMessage,
//       status: error.response?.status,
//       data: responseData,
//     };
//   } else if (error instanceof Error) {
//     // Lỗi JavaScript thông thường
//     console.error('Unexpected Error:', error);
//     return { message: error.message || defaultMessage };
//   } else {
//     // Trường hợp lỗi không xác định
//     console.error('Unknown Error:', error);
//     return { message: defaultMessage };
//   }
// };

// // --- Các hàm gọi API ---

// /**
//  * Đăng nhập người dùng.
//  */
// export const loginUser = async (userData: Pick<UserData, 'email' | 'password'>): Promise<LoginResponse> => {
//   try {
//     const response = await apiClient.post<LoginResponse>('/auth/login', userData);
//     return response.data;
//   } catch (error) {
//     const handledError = handleApiError(error, 'Đăng nhập thất bại');
//     throw new Error(handledError.message); // Ném lỗi với message đã xử lý
//   }
// };

// /**
//  * Lấy thông tin hồ sơ người dùng.
//  */
// export const getUserProfile = async (token: string, userId: number): Promise<UserProfile> => {
//   if (!token || !userId) {
//       throw new Error("Token hoặc User ID không hợp lệ để lấy hồ sơ.");
//   }
//   try {
//     const response = await apiClient.get<UserProfile>(`/users/${userId}`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     return response.data;
//   } catch (error) {
//     const handledError = handleApiError(error, 'Không thể lấy thông tin hồ sơ');
//     throw new Error(handledError.message);
//   }
// };

// /**
//  * Cập nhật thông tin hồ sơ người dùng.
//  */
// export const updateUserProfile = async (token: string, userId: number, userData: UpdateUserData): Promise<UserProfile> => {
//   if (!token) {
//     throw new Error("Lỗi cập nhật: Không tìm thấy token xác thực");
//   }
//   if (!userId) {
//     throw new Error("Lỗi cập nhật: userId không hợp lệ");
//   }
//   try {
//     // Sử dụng PATCH sẽ hợp lý hơn nếu chỉ cập nhật một phần thông tin
//     const response = await apiClient.put<UserProfile>(`/users/${userId}`, userData, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     return response.data;
//   } catch (error) {
//     const handledError = handleApiError(error, 'Cập nhật hồ sơ thất bại');
//     throw new Error(handledError.message);
//   }
// };

// /**
//  * Lấy danh sách tất cả bác sĩ (role R2).
//  */
// export const getAllDoctors = async (): Promise<Doctor[]> => {
//     try {
//         // Giả sử endpoint lấy tất cả doctors là '/doctors'
//         const response = await apiClient.get<Doctor[]>('/doctors');
//         return response.data;
//     } catch (error) {
//         const handledError = handleApiError(error, 'Không thể tải danh sách bác sĩ');
//         throw new Error(handledError.message);
//     }
// };

// /**
//  * Lấy lịch trình của một bác sĩ cho một ngày cụ thể (hoặc phạm vi ngày).
//  * @param doctorId ID của bác sĩ.
//  * @param date Ngày cần lấy lịch (định dạng YYYY-MM-DD).
//  */
// export const getDoctorSchedules = async (doctorId: number, date: string): Promise<Schedule[]> => {
//     if (!doctorId || !date) {
//         throw new Error("Cần cung cấp Doctor ID và Ngày để lấy lịch trình.");
//     }
//     try {
//         // Endpoint dựa trên controller đã phân tích
//         const response = await apiClient.get<Schedule[]>(`/schedules/doctor/${doctorId}`, {
//             params: { date } // Gửi ngày dưới dạng query parameter
//         });
//         return response.data;
//     } catch (error) {
//         const handledError = handleApiError(error, 'Không thể tải lịch trình của bác sĩ');
//         throw new Error(handledError.message);
//     }
// };

// /**
//  * Tạo một lịch đặt khám mới.
//  * Cần token để xác thực người dùng đặt lịch.
//  */
// export const createBooking = async (bookingData: CreateBookingData, token: string): Promise<Booking> => {
//     if (!token) {
//         throw new Error("Cần token xác thực để tạo lịch đặt khám.");
//     }
//      if (!bookingData.patientId) {
//         throw new Error("Thiếu thông tin bệnh nhân (patientId).");
//     }
//     try {
//         const response = await apiClient.post<Booking>('/bookings', bookingData, {
//              headers: { Authorization: `Bearer ${token}` }, // Thêm token xác thực
//         });
//         return response.data;
//     } catch (error) {
//         const handledError = handleApiError(error, 'Tạo lịch đặt khám thất bại');
//         throw new Error(handledError.message);
//     }
// };

// /**
//  * Lấy danh sách tất cả chuyên khoa.
//  */
// export const getAllSpecialties = async (): Promise<Specialty[]> => {
//     try {
//         const response = await apiClient.get<Specialty[]>('/specialties');
//         return response.data;
//     } catch (error) {
//         const handledError = handleApiError(error, 'Không thể tải danh sách chuyên khoa');
//         throw new Error(handledError.message);
//     }
// };

// /**
//  * Lấy chi tiết một chuyên khoa theo ID.
//  */
// export const getSpecialtyDetails = async (id: number): Promise<Specialty> => {
//     if (!id) {
//         throw new Error("Cần cung cấp ID chuyên khoa.");
//     }
//     try {
//         const response = await apiClient.get<Specialty>(`/specialties/${id}`);
//         return response.data;
//     } catch (error) {
//         const handledError = handleApiError(error, 'Không thể tải chi tiết chuyên khoa');
//         throw new Error(handledError.message);
//     }
// };

// /**
//  * Lấy danh sách bác sĩ theo chuyên khoa ID.
//  */
// export const getDoctorsBySpecialty = async (id: number): Promise<Doctor[]> => {
//     if (!id) {
//         throw new Error("Cần cung cấp ID chuyên khoa.");
//     }
//     try {
//         // Giả sử endpoint là '/doctors/specialty/:id' dựa trên doctorController
//         const response = await apiClient.get<Doctor[]>(`/doctors/specialty/${id}`);
//         return response.data;
//     } catch (error) {
//         const handledError = handleApiError(error, 'Không thể tải danh sách bác sĩ theo chuyên khoa');
//         throw new Error(handledError.message);
//     }
// };


// // Có thể thêm các hàm API khác ở đây (register, getBookings, cancelBooking, etc.)

// // Export tất cả các hàm cần thiết
// export {
//     // loginUser, // Đã export ở trên
//     // getUserProfile, // Đã export ở trên
//     // updateUserProfile, // Đã export ở trên
//     // getAllDoctors, // Đã export ở trên
//     // getDoctorSchedules, // Đã export ở trên
//     // createBooking, // Đã export ở trên
//     // getAllSpecialties, // Đã export ở trên
//     // getSpecialtyDetails, // Đã export ở trên
//     // getDoctorsBySpecialty, // Đã export ở trên
// };