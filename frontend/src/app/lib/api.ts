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
  id: number;
  date: string;
  timeType?: string;
  doctorData?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    image?: string;
    doctorDetail?: {
      descriptionMarkdown?: string;
      descriptionHTML?: string;
    };
    Specialty?: {
      id: number;
      name: string;
      image?: string;
      description?: string;
    };
  };
  patientData?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    image?: string;
  };
  statusData?: {
    keyMap: string;
    valueVi: string;
    valueEn: string;
  };
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
    const token = localStorage.getItem('token');
    console.log('Fetching schedules with token:', token ? 'Token exists' : 'No token');
    console.log('Doctor ID:', doctorId, 'Date:', date);

    const response = await apiClient.get<{ success: boolean; data: Schedule[] }>(`/schedule/doctor/${doctorId}`, {
      params: { date },
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log('Schedule API Response:', response.data);

    if (!response.data.success) {
      throw new Error(response.data.message || 'Lỗi khi lấy lịch phân công');
    }

    return response.data.data || [];
  } catch (error) {
    console.error(`Error fetching schedules for doctor ${doctorId} on ${date}:`, error);
    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });

      if (error.response?.status === 404) {
        console.warn(`No schedules found (404) for doctor ${doctorId} on ${date}. Returning empty array.`);
        return [];
      }
      throw new Error(error.response?.data?.message || 'Lỗi khi lấy lịch phân công');
    }
    throw new Error('Có lỗi xảy ra khi lấy lịch phân công');
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

export const getBookingById = async (id: number, token?: string): Promise<Booking> => {
  if (!id) throw new Error("Thiếu id lịch khám");
  try {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const response = await axios.get(`http://localhost:8080/api/bookings/${id}`, { headers });
    // Nếu backend trả về { success, data }, lấy data; nếu trả về trực tiếp object thì lấy luôn
    return response.data.data || response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message = error.response?.data?.message || error.message;
      throw new Error(`API Error: ${status} - ${message}`);
    }
    throw new Error('Đã xảy ra lỗi khi lấy chi tiết lịch khám.');
  }
};

export const getBookingsByDoctorId = async (doctorId: number, token?: string) => {
  if (!doctorId) throw new Error("Thiếu doctorId");
  try {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const response = await apiClient.get(`/bookings/doctor/${doctorId}`, { headers });
    if (response.data.success && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    return [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message = error.response?.data?.message || error.message;
      throw new Error(`API Error: ${status} - ${message}`);
    }
    throw new Error('Đã xảy ra lỗi khi lấy danh sách lịch khám của bác sĩ.');
  }
};

export const registerUser = async (userData: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
}) => {
  try {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error;
    }
    throw new Error('Đã có lỗi xảy ra trong quá trình đăng ký');
  }
};

export const createSchedule = async (data: {
  doctorId: number;
  date: string;
  timeType: string;
  maxNumber: number;
}): Promise<Schedule> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Vui lòng đăng nhập để thực hiện chức năng này');
    }

    // Validate input data
    if (!data.doctorId) {
      throw new Error('Vui lòng chọn bác sĩ');
    }

    if (!data.date) {
      throw new Error('Vui lòng chọn ngày khám');
    }

    if (!data.timeType || data.timeType.trim() === '') {
      throw new Error('Vui lòng chọn khung giờ khám');
    }

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(data.date)) {
      throw new Error('Định dạng ngày không hợp lệ. Vui lòng sử dụng YYYY-MM-DD');
    }

    // Validate maxNumber
    if (!data.maxNumber || data.maxNumber < 1) {
      throw new Error('Số lượng bệnh nhân tối đa phải lớn hơn 0');
    }

    const response = await apiClient.post<{ success: boolean; message: string; data: Schedule }>('/schedule', data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.data.success) {
      throw new Error(response.data.message || 'Lỗi khi tạo lịch khám');
    }

    return response.data.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Error creating schedule:', error);
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Lỗi khi tạo lịch khám');
    }
    throw error;
  }
};

export async function getMedicalRecords() {
  const res = await fetch('/api/medical-records'); 
  if (!res.ok) {
    throw new Error('Failed to fetch medical records');
  }
  return res.json();
}

// src/lib/api.ts

export async function getDoctorPatients() {
  const res = await fetch('/api/doctor/patients'); 
  if (!res.ok) {
    throw new Error('Failed to fetch doctor patients');
  }
  return res.json(); // trả về data JSON
}
