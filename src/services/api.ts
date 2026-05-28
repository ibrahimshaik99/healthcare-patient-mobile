import axios, {AxiosError, InternalAxiosRequestConfig} from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_CONFIG} from '../config/api';
import {
  ApiResponse,
  PaginatedResponse,
  LoginRequest,
  RegisterRequest,
  OTPVerifyRequest,
  CreateAppointmentRequest,
  DoctorFilters,
  Patient,
  Doctor,
  Appointment,
  Slot,
  Prescription,
  Payment,
  Notification,
  Review,
} from '../types';

const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await AsyncStorage.getItem('auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      await AsyncStorage.multiRemove(['auth_token', 'user_data']);
    }
    return Promise.reject(error);
  },
);

export const authApi = {
  register: async (data: RegisterRequest): Promise<ApiResponse<{verificationId: string}>> => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  login: async (data: LoginRequest): Promise<ApiResponse<{token: string; user: Patient}>> => {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  },

  verifyOTP: async (data: OTPVerifyRequest): Promise<ApiResponse<{token: string; user: Patient}>> => {
    const response = await apiClient.post('/auth/verify-otp', data);
    return response.data;
  },

  resendOTP: async (verificationId: string): Promise<ApiResponse<{verificationId: string}>> => {
    const response = await apiClient.post('/auth/resend-otp', {verificationId});
    return response.data;
  },

  forgotPassword: async (email: string): Promise<ApiResponse<{verificationId: string}>> => {
    const response = await apiClient.post('/auth/forgot-password', {email});
    return response.data;
  },

  resetPassword: async (data: {verificationId: string; otp: string; password: string}): Promise<ApiResponse<null>> => {
    const response = await apiClient.post('/auth/reset-password', data);
    return response.data;
  },
};

export const patientApi = {
  getProfile: async (): Promise<ApiResponse<Patient>> => {
    const response = await apiClient.get('/patient/profile');
    return response.data;
  },

  updateProfile: async (data: Partial<Patient>): Promise<ApiResponse<Patient>> => {
    const response = await apiClient.put('/patient/profile', data);
    return response.data;
  },

  uploadPhoto: async (photoUri: string): Promise<ApiResponse<{photoUrl: string}>> => {
    const formData = new FormData();
    formData.append('photo', {
      uri: photoUri,
      type: 'image/jpeg',
      name: 'profile.jpg',
    } as any);
    const response = await apiClient.post('/patient/photo', formData, {
      headers: {'Content-Type': 'multipart/form-data'},
      timeout: API_CONFIG.UPLOAD_TIMEOUT,
    });
    return response.data;
  },

  getMedicalHistory: async (): Promise<ApiResponse<{appointments: Appointment[]; prescriptions: Prescription[]}>> => {
    const response = await apiClient.get('/patient/medical-history');
    return response.data;
  },

  addMedicalRecord: async (data: FormData): Promise<ApiResponse<{recordId: string}>> => {
    const response = await apiClient.post('/patient/medical-records', data, {
      headers: {'Content-Type': 'multipart/form-data'},
      timeout: API_CONFIG.UPLOAD_TIMEOUT,
    });
    return response.data;
  },
};

export const doctorApi = {
  getDoctors: async (filters?: DoctorFilters): Promise<PaginatedResponse<Doctor>> => {
    const response = await apiClient.get('/doctors', {params: filters});
    return response.data;
  },

  getDoctorById: async (id: string): Promise<ApiResponse<Doctor>> => {
    const response = await apiClient.get(`/doctors/${id}`);
    return response.data;
  },

  getNearbyDoctors: async (latitude: number, longitude: number, maxDistance?: number): Promise<ApiResponse<Doctor[]>> => {
    const response = await apiClient.get('/doctors/nearby', {
      params: {latitude, longitude, maxDistance: maxDistance || 10},
    });
    return response.data;
  },

  getDoctorReviews: async (doctorId: string): Promise<PaginatedResponse<Review>> => {
    const response = await apiClient.get(`/doctors/${doctorId}/reviews`);
    return response.data;
  },
};

export const appointmentApi = {
  createAppointment: async (data: CreateAppointmentRequest): Promise<ApiResponse<Appointment>> => {
    const response = await apiClient.post('/appointments', data);
    return response.data;
  },

  getAppointments: async (status?: string): Promise<ApiResponse<Appointment[]>> => {
    const response = await apiClient.get('/appointments', {params: {status}});
    return response.data;
  },

  getAppointmentById: async (id: string): Promise<ApiResponse<Appointment>> => {
    const response = await apiClient.get(`/appointments/${id}`);
    return response.data;
  },

  cancelAppointment: async (id: string, reason?: string): Promise<ApiResponse<Appointment>> => {
    const response = await apiClient.post(`/appointments/${id}/cancel`, {reason});
    return response.data;
  },

  rescheduleAppointment: async (id: string, slotId: string, date: string): Promise<ApiResponse<Appointment>> => {
    const response = await apiClient.post(`/appointments/${id}/reschedule`, {slotId, date});
    return response.data;
  },

  getAvailableSlots: async (doctorId: string, date: string): Promise<ApiResponse<Slot[]>> => {
    const response = await apiClient.get(`/doctors/${doctorId}/slots`, {params: {date}});
    return response.data;
  },

  getAppointmentStatus: async (id: string): Promise<ApiResponse<{status: string; timeline: any[]}>> => {
    const response = await apiClient.get(`/appointments/${id}/status`);
    return response.data;
  },

  rateAppointment: async (appointmentId: string, rating: number, comment?: string): Promise<ApiResponse<Review>> => {
    const response = await apiClient.post(`/appointments/${appointmentId}/review`, {rating, comment});
    return response.data;
  },
};

export const prescriptionApi = {
  getPrescriptions: async (): Promise<ApiResponse<Prescription[]>> => {
    const response = await apiClient.get('/prescriptions');
    return response.data;
  },

  getPrescriptionById: async (id: string): Promise<ApiResponse<Prescription>> => {
    const response = await apiClient.get(`/prescriptions/${id}`);
    return response.data;
  },

  downloadPrescription: async (id: string): Promise<string> => {
    const response = await apiClient.get(`/prescriptions/${id}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },
};

export const paymentApi = {
  createOrder: async (appointmentId: string, amount: number): Promise<ApiResponse<Payment>> => {
    const response = await apiClient.post('/payments/create-order', {appointmentId, amount});
    return response.data;
  },

  verifyPayment: async (data: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }): Promise<ApiResponse<Payment>> => {
    const response = await apiClient.post('/payments/verify', data);
    return response.data;
  },
};

export const notificationApi = {
  getNotifications: async (): Promise<ApiResponse<Notification[]>> => {
    const response = await apiClient.get('/notifications');
    return response.data;
  },

  markAsRead: async (id: string): Promise<ApiResponse<Notification>> => {
    const response = await apiClient.put(`/notifications/${id}/read`);
    return response.data;
  },

  markAllAsRead: async (): Promise<ApiResponse<null>> => {
    const response = await apiClient.put('/notifications/read-all');
    return response.data;
  },

  getUnreadCount: async (): Promise<ApiResponse<{count: number}>> => {
    const response = await apiClient.get('/notifications/unread-count');
    return response.data;
  },
};

export default apiClient;
