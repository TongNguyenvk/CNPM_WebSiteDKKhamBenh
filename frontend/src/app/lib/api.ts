// src/app/lib/api.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api', // Base URL cho API
  headers: {
    'Content-Type': 'application/json',
  },
}); // Thay đổi URL backend của bạn

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

interface Schedule {
  id: number;
  date: string; // Giữ định dạng YYYY-MM-DD hoặc kiểu dữ liệu phù hợp từ DB
  doctorId: number;
  timeType: string; // Key của Allcode
  maxNumber: number;
  currentNumber?: number; // Thêm nếu có
  createdAt?: string;
  updatedAt?: string;
  timeTypeData?: { // Include từ Sequelize
    valueVi: string;
    valueEn?: string; // Thêm nếu cần
  };
}

interface Specialty { // Thêm interface nếu cần chi tiết hơn
  id?: number;
  name: string;
  // Thêm các thuộc tính khác nếu có
}


interface Doctor {
  id: number;
  email?: string; // Thêm nếu có
  password?: string; // Thường không trả về password
  firstName: string;
  lastName: string;
  address?: string; // Thêm nếu có
  phonenumber?: string; // Thêm nếu có
  gender?: string; // Key của Allcode
  roleId?: string; // Key của Allcode
  positionId?: string; // Key của Allcode
  image: string; // Đường dẫn hoặc tên file ảnh
  description?: string; // Markdown
  contentHTML?: string; // Markdown
  contentMarkdown?: string; // Markdown
  clinicId?: number; // Thêm nếu có
  specialtyId?: number; // Thêm nếu có
  createdAt?: string;
  updatedAt?: string;
  Specialty?: Specialty; // Include từ Sequelize
  // Thêm các includes khác nếu có: positionData, genderData,...
}

export interface BookingData {
  statusId: string;
  doctorId: number;
  patientId: number;
  date: string;      // ISO format, ví dụ: "2025-04-08"
  timeType: string;  // ví dụ: "T1", "T2", tùy vào cách bạn định nghĩa khung giờ
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface CreateBookingPayload {
  doctorId: number;
  patientId: number; // ID người dùng đang đăng nhập (Backend sẽ lấy từ token, nhưng để đây cho rõ)
  scheduleId: number; // ID của lịch trình cụ thể (khung giờ)
  date: string;       // Ngày khám (YYYY-MM-DD)
  timeType: string;   // Key của khung giờ (ví dụ: T1, T2)
  reason?: string;     // Lý do khám (tùy chọn)
  // Thêm các trường khác nếu backend yêu cầu (ví dụ: token xác thực nếu cần)
  statusId: string;   // Trạng thái ban đầu, ví dụ: 'S1' (Chờ xác nhận)
}

// --- Interface cho dữ liệu Booking trả về từ API (ví dụ) ---
export interface Booking {
  booking_id: number;
  patient_id: number;
  date: string;
  timeType?: string;
  doctorId?: number;
  status?: string;
}

export interface BookingPayload {
  doctorId: number;
  patientId: number;
  date: string;
  timeType: string;
  reason?: string;
}

interface ApiError { // Di chuyển interface ApiError vào đây
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

export const getDoctorById = async (id: number): Promise<Doctor> => {
  try {
    const response = await apiClient.get<Doctor>(`/doctor/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching doctor with id ${id}:`, error);
    // Ném lỗi để component có thể bắt và xử lý
    if (axios.isAxiosError(error)) {
      throw new Error(`API Error: ${error.response?.status} - ${error.response?.data?.message || error.message}`);
    }
    throw new Error('An unexpected error occurred while fetching doctor details.');
  }
};

export const getDoctorSchedules = async (doctorId: number, date: string): Promise<Schedule[]> => {
  try {
    // Sử dụng params để Axios tự động thêm vào query string
    const response = await apiClient.get<Schedule[]>(`/schedule/doctor/${doctorId}`, {
      params: { date } // Sẽ tạo ra URL: /schedule/doctor/:doctorId?date=YYYY-MM-DD
    });
    // Đảm bảo luôn trả về một mảng
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error(`Error fetching schedules for doctor ${doctorId} on ${date}:`, error);
    // Có thể trả về mảng rỗng thay vì ném lỗi để UI không bị vỡ nếu chỉ là không tìm thấy lịch
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      console.warn(`No schedules found (404) for doctor ${doctorId} on ${date}. Returning empty array.`);
      return []; // Trả về mảng rỗng nếu 404 nghĩa là không có lịch
    }
    // Ném lỗi cho các trường hợp lỗi khác
    if (axios.isAxiosError(error)) {
      throw new Error(`API Error: ${error.response?.status} - ${error.response?.data?.message || error.message}`);
    }
    throw new Error('An unexpected error occurred while fetching schedules.');
  }
};


const loginUser = async (userData: UserData): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post<LoginResponse>(`/auth/login`, userData);
    return response.data;
  } catch (error: unknown) { // Vẫn cần any ở đây, nhưng đã có ApiError
    const err = error as ApiError; // Ép kiểu error về ApiError
    throw err;
  }
};

const getUserProfile = async (token: string) => {
  try {
    const response = await apiClient.get(`/auth/me`, {
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
    const response = await apiClient.put(`/users/${userId}`, userData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi cập nhật người dùng:", error);
    throw error; // Có thể hiển thị thông báo lỗi trên giao diện
  }
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getAuthToken = (): string | null => {
  // Thay thế bằng logic lấy token của bạn (localStorage, sessionStorage, context,...)
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
};

// --- Các hàm API đã có (getDoctorById, getDoctorSchedules) ---
// ... giữ nguyên getDoctorById, getDoctorSchedules ...

// --- Hàm mới: Tạo Booking ---


export async function getDoctorScheduleById(scheduleId: number) {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Bạn chưa đăng nhập");
  }

  try {
    const response = await fetch(`http://localhost:8080/api/schedule/${scheduleId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Không thể lấy thông tin lịch khám");
    }

    return await response.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Lỗi khi lấy thông tin lịch khám:", error);
    throw error;
  }
}

export const createBooking = async (bookingData: BookingData) => {
  const response = await apiClient.post('/bookings', bookingData);
  return response.data;
};

export const getBookingsByPatientId = async (patientId: number): Promise<Booking[]> => {
  try {
    // Kiểm tra patientId hợp lệ
    if (!Number.isInteger(patientId) || patientId <= 0) {
      throw new Error('Patient ID không hợp lệ');
    }

    console.log('Gọi API với patientId:', patientId); // Log để kiểm tra

    const response = await apiClient.get(`/bookings/patient/${patientId}`);

    console.log('Response từ API:', response.data); // Log để kiểm tra

    // Kiểm tra response
    if (response.data.success && Array.isArray(response.data.data)) {
      return response.data.data;
    }

    // Nếu không có dữ liệu, trả về mảng rỗng
    return [];
  } catch (error) {
    console.error(`Lỗi khi lấy danh sách đặt lịch của bệnh nhân có ID ${patientId}:`, error);

    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message = error.response?.data?.message || error.message;
      throw new Error(`API Error: ${status} - ${message}`);
    }

    throw new Error('Đã xảy ra lỗi không xác định khi lấy danh sách đặt lịch.');
  }
};

export async function getUserBookings(userId: number, token: string) {
  const res = await fetch(`/bookings/patient/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Không thể lấy lịch hẹn của bạn");
  return res.json();
}

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
//export {
//   // loginUser, // Đã export ở trên
//     // getUserProfile, // Đã export ở trên
//     // updateUserProfile, // Đã export ở trên
//     // getAllDoctors, // Đã export ở trên
//     // getDoctorSchedules, // Đã export ở trên
//     // createBooking, // Đã export ở trên
//     // getAllSpecialties, // Đã export ở trên
//     // getSpecialtyDetails, // Đã export ở trên
//     // getDoctorsBySpecialty, // Đã export ở trên
// };