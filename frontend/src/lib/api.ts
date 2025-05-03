import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:8080/api/',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Types
interface LoginData {
    email: string;
    password: string;
}

interface RegisterData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    roleId?: string;
}

interface ApiError extends Error {
    status?: number;
    data?: unknown;
}

export interface LoginResponse {
    message: string;
    token: string;
    userId: number;
    email: string;
    firstName: string;
    lastName: string;
    role: string;  // roleId từ database
}

interface Appointment {
    id: number;
    date: string;
    timeType: string;
    statusId: string;
    patientId: number;
    doctorId: number;
    patientData?: {
        firstName: string;
        lastName: string;
        email: string;
    };
    doctorData?: {
        firstName: string;
        lastName: string;
        email: string;
        image: string;
        specialtyData?: {
            name: string;
        };
    };
    statusData?: {
        keyMap: string;
        valueVi: string;
        valueEn: string;
    };
}

interface Schedule {
    id: number;
    date: string;
    doctorId: number;
    timeType: string;
    maxNumber: number;
    currentNumber?: number;
    createdAt?: string;
    updatedAt?: string;
    timeTypeData?: {
        valueVi: string;
        valueEn?: string;
        keyMap: string;
    };
}

interface Doctor {
    id: number;
    email?: string;
    firstName: string;
    lastName: string;
    address?: string;
    phoneNumber?: string;
    gender?: boolean;
    roleId?: string;
    positionId?: string;
    image?: string;
    specialtyId?: number;
    createdAt?: string;
    updatedAt?: string;
    doctorDetail?: {
        descriptionMarkdown?: string;
        descriptionHTML?: string;
    };
    Specialty?: {
        id: number;
        name: string;
    };
    positionData?: {
        keyMap: string;
        valueVi: string;
        valueEn: string;
    };
}

interface Specialty {
    id?: number;
    name: string;
}

interface ApiResponse<T> {
    message: string;
    data: T;
    error?: string;
    errorCode?: string;
}

// User Profile Types
interface UserProfile {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    address?: string;
    gender?: boolean;
    roleId: string;
    image?: string;
    createdAt?: string;
    updatedAt?: string;
}

interface UpdateUserProfileData {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    address?: string;
    gender?: boolean;
}

// API Functions
export const loginUser = async (data: LoginData): Promise<LoginResponse> => {
    try {
        console.log('Login attempt with:', { email: data.email });
        const response = await apiClient.post<LoginResponse>('/auth/login', data);
        console.log('Login response:', response.data);

        // Lưu token và user info vào localStorage
        if (typeof window !== 'undefined') {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify({
                userId: response.data.userId,
                email: response.data.email,
                firstName: response.data.firstName,
                lastName: response.data.lastName,
                role: response.data.role
            }));
        }
        return response.data;
    } catch (error: any) {
        console.error('Login error details:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw new Error('Đăng nhập thất bại');
    }
};

export const registerUser = async (data: RegisterData): Promise<LoginResponse> => {
    try {
        const response = await apiClient.post<LoginResponse>('/auth/register', data);
        // Lưu token và user info vào localStorage
        if (typeof window !== 'undefined') {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify({
                userId: response.data.userId,
                email: response.data.email,
                firstName: response.data.firstName,
                lastName: response.data.lastName,
                role: response.data.role
            }));
        }
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Đăng ký thất bại');
    }
};

export const logoutUser = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
};

export const getCurrentUser = (): LoginResponse | null => {
    if (typeof window !== 'undefined') {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            return JSON.parse(userStr);
        }
    }
    return null;
};

// API cho bác sĩ
export const getDoctorAppointments = async (doctorId: number): Promise<Appointment[]> => {
    try {
        const token = localStorage.getItem('token');
        const response = await apiClient.get(`/bookings/doctor/${doctorId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data.data || [];
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Lỗi khi lấy lịch khám');
    }
};

export const getDoctorSchedulesPT = async (doctorId: number, date: string): Promise<Schedule[]> => {
    try {
        const response = await apiClient.get<Schedule[]>(`/schedule/doctor/${doctorId}`, {
            params: { date }
        });
        return response.data || [];
    } catch (error) {
        console.error(`Error fetching schedules for doctor ${doctorId} on ${date}:`, error);
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            console.warn(`No schedules found (404) for doctor ${doctorId} on ${date}. Returning empty array.`);
            return [];
        }
        if (axios.isAxiosError(error)) {
            throw new Error(`API Error: ${error.response?.status} - ${error.response?.data?.message || error.message}`);
        }
        throw new Error('An unexpected error occurred while fetching schedules.');
    }
};

export const getDoctorSchedules = async (doctorId: number, date: string): Promise<Schedule[]> => {
    try {
        const token = localStorage.getItem('token');
        console.log('Fetching schedules with token:', token ? 'Token exists' : 'No token');
        console.log('Doctor ID:', doctorId, 'Date:', date);

        const response = await apiClient.get(`/schedule/doctor/${doctorId}`, {
            params: { date },
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        console.log('Schedule API Response:', response.data);

        // Kiểm tra cấu trúc response và trả về dữ liệu phù hợp
        if (response.data && response.data.data) {
            return response.data.data.map((schedule: any) => ({
                ...schedule,
                timeTypeData: schedule.timeTypeData || {
                    valueVi: schedule.timeType === 'T1' ? 'Buổi sáng' :
                        schedule.timeType === 'T2' ? 'Buổi chiều' :
                            schedule.timeType === 'T3' ? 'Buổi tối' : schedule.timeType
                }
            }));
        } else if (Array.isArray(response.data)) {
            return response.data.map((schedule: any) => ({
                ...schedule,
                timeTypeData: schedule.timeTypeData || {
                    valueVi: schedule.timeType === 'T1' ? 'Buổi sáng' :
                        schedule.timeType === 'T2' ? 'Buổi chiều' :
                            schedule.timeType === 'T3' ? 'Buổi tối' : schedule.timeType
                }
            }));
        }
        return [];
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

export const getTodayAppointments = async (doctorId: number): Promise<Appointment[]> => {
    try {
        const token = localStorage.getItem('token');
        const today = new Date().toISOString().split('T')[0];
        const response = await apiClient.get(`/bookings/doctor/${doctorId}?date=${today}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data.data || [];
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Lỗi khi lấy lịch khám hôm nay');
    }
};

// API cho bệnh nhân
export const getPatientAppointments = async (patientId: number): Promise<Appointment[]> => {
    try {
        const token = localStorage.getItem('token');
        const response = await apiClient.get(`/bookings/patient/${patientId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data.data || [];
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Lỗi khi lấy lịch khám');
    }
};

export const getBookingsByPatientId = async (patientId: number): Promise<Appointment[]> => {
    try {
        const token = localStorage.getItem('token');
        const response = await apiClient.get(`/bookings/patient/${patientId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data.data || [];
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Lỗi khi lấy lịch khám');
    }
};

// Thêm token vào header cho mọi request
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Booking APIs
export const createBooking = async (data: {
    statusId: string;
    doctorId: number;
    patientId: number;
    date: string;
    timeType: string;
}): Promise<Appointment> => {
    try {
        const token = localStorage.getItem('token');
        const response = await apiClient.post('/bookings', data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Lỗi khi đặt lịch khám');
    }
};

export const getBookingById = async (id: number): Promise<Appointment> => {
    try {
        const token = localStorage.getItem('token');
        const response = await apiClient.get(`/bookings/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Lỗi khi lấy thông tin lịch khám');
    }
};

export const cancelBooking = async (bookingId: number): Promise<Appointment> => {
    try {
        const token = localStorage.getItem('token');
        const response = await apiClient.put(`/bookings/cancel/${bookingId}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Lỗi khi hủy lịch khám');
    }
};

// Schedule APIs
export const createSchedule = async (data: {
    doctorId: number;
    date: string;
    timeType: string;
    maxNumber: number;
}): Promise<Schedule> => {
    try {
        const token = localStorage.getItem('token');
        const response = await apiClient.post('/schedule', data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Lỗi khi tạo lịch phân công');
    }
};

export const getScheduleById = async (id: number): Promise<Schedule> => {
    try {
        const response = await apiClient.get<Schedule>(`/schedule/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching schedule ${id}:`, error);
        if (axios.isAxiosError(error)) {
            throw new Error(`API Error: ${error.response?.status} - ${error.response?.data?.message || error.message}`);
        }
        throw new Error('An unexpected error occurred while fetching schedule details.');
    }
};

// Doctor APIs
export const getAllDoctors = async (): Promise<Doctor[]> => {
    try {
        const response = await apiClient.get('/doctor');
        return response.data || [];
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Lỗi khi lấy danh sách bác sĩ');
    }
};

export const getDoctorById = async (id: number): Promise<Doctor> => {
    try {
        const token = localStorage.getItem('token');
        console.log('Fetching doctor with id:', id);
        console.log('Using token:', token ? 'Token exists' : 'No token');

        const response = await apiClient.get<Doctor>(`/doctor/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        console.log('API Response:', response.data);

        if (!response.data) {
            console.error('No data in response:', response.data);
            throw new Error('Không tìm thấy thông tin bác sĩ');
        }

        return response.data;
    } catch (error) {
        console.error(`Error fetching doctor with id ${id}:`, error);
        if (axios.isAxiosError(error)) {
            console.error('Axios error details:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            });

            if (error.response?.status === 404) {
                throw new Error('Không tìm thấy thông tin bác sĩ');
            }
            if (error.response?.status === 401) {
                throw new Error('Vui lòng đăng nhập để xem thông tin');
            }
            throw new Error(error.response?.data?.message || 'Lỗi khi lấy thông tin bác sĩ');
        }
        throw new Error('Có lỗi xảy ra khi lấy thông tin bác sĩ');
    }
};

export const getDoctorsBySpecialty = async (specialtyId: number): Promise<Doctor[]> => {
    try {
        const response = await apiClient.get(`/doctor/specialty/${specialtyId}`);
        return response.data || [];
    } catch (error: unknown) {
        const err = error as ApiError;
        throw new Error(err.message || 'Failed to fetch doctors');
    }
};

// Specialty APIs
export const getAllSpecialties = async (): Promise<Specialty[]> => {
    try {
        const response = await apiClient.get('/specialties');
        return response.data || [];
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Lỗi khi lấy danh sách chuyên khoa');
    }
};

export const getSpecialtyById = async (id: number): Promise<Specialty> => {
    try {
        const response = await apiClient.get(`/specialties/${id}`);
        return response.data;
    } catch (error: unknown) {
        const err = error as ApiError;
        throw new Error(err.message || 'Failed to fetch specialty');
    }
};

// User Profile APIs
export const getUserProfile = async (): Promise<UserProfile> => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Vui lòng đăng nhập để xem thông tin cá nhân');
        }

        // Lấy userId từ localStorage
        const userStr = localStorage.getItem('user');
        if (!userStr) {
            throw new Error('Không tìm thấy thông tin người dùng');
        }
        const user = JSON.parse(userStr);
        const userId = user.userId;

        const response = await apiClient.get<UserProfile>(`/users/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error: any) {
        console.error('Error fetching user profile:', error);
        if (error.response?.status === 401) {
            throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        }
        throw new Error(error.response?.data?.message || 'Lỗi khi lấy thông tin cá nhân');
    }
};

export const updateUserProfile = async (data: UpdateUserProfileData): Promise<UserProfile> => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Vui lòng đăng nhập để cập nhật thông tin');
        }

        const response = await apiClient.put<UserProfile>('/users/profile', data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error: any) {
        console.error('Error updating user profile:', error);
        if (error.response?.status === 401) {
            throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        }
        throw new Error(error.response?.data?.message || 'Lỗi khi cập nhật thông tin cá nhân');
    }
};

export const uploadProfileImage = async (file: File): Promise<{ imageUrl: string }> => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Vui lòng đăng nhập để tải lên ảnh');
        }

        const formData = new FormData();
        formData.append('image', file);

        const response = await apiClient.post<{ imageUrl: string }>('/users/profile/image', formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error: any) {
        console.error('Error uploading profile image:', error);
        if (error.response?.status === 401) {
            throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        }
        throw new Error(error.response?.data?.message || 'Lỗi khi tải lên ảnh đại diện');
    }
};

export const updateBookingStatus = async (bookingId: number, statusId: string): Promise<Appointment> => {
    try {
        const token = localStorage.getItem('token');
        const response = await apiClient.put(`/bookings/${bookingId}/status`, { statusId }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data.data;
    } catch (error: any) {
        console.error('Error updating booking status:', error);
        throw new Error(error.response?.data?.message || 'Lỗi khi cập nhật trạng thái lịch khám');
    }
};

export const updateDoctorSchedule = async (id: number, data: any) => {
    const response = await apiClient.put(`/schedule/${id}`, data);
    return response.data;
  };
  
  export const deleteDoctorSchedule = async (id: number) => {
    const response = await apiClient.delete(`/schedule/${id}`);
    return response.data;
  };

  // ✅ Thêm const updatedSchedules đảm bảo kiểu Schedule đúng định dạng
export const getUpdatedSchedules = (schedules: any[]): Schedule[] => {
    return schedules.map((schedule: any): Schedule => ({
        ...schedule,
        timeTypeData: {
            keyMap: schedule?.timeTypeData?.keyMap || schedule?.timeType || 'UNKNOWN',
            valueVi: schedule?.timeTypeData?.valueVi || 'Không rõ',
            valueEn: schedule?.timeTypeData?.valueEn || 'Unknown',
        }
    }));
};