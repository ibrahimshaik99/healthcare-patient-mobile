export interface User {
  id: string;
  email: string;
  phone: string;
  role: 'patient' | 'doctor' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface Patient {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  photo?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  bloodGroup?: string;
  allergies?: string[];
  chronicDiseases?: string[];
  emergencyContact?: EmergencyContact;
  insurance?: Insurance;
  address?: Address;
  createdAt: string;
  updatedAt: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface Insurance {
  provider: string;
  policyNumber: string;
  expiryDate: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Doctor {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  photo?: string;
  specializations: string[];
  qualifications: Qualification[];
  experience: number;
  certifications: string[];
  about: string;
  rating: number;
  reviewCount: number;
  consultationFee: number;
  onlineFee: number;
  clinic?: Clinic;
  availability: Availability[];
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Qualification {
  degree: string;
  institution: string;
  year: number;
}

export interface Clinic {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  phone: string;
  timings: string;
}

export interface Availability {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface Department {
  id: string;
  name: string;
  icon: string;
  description?: string;
  color: string;
}

export type AppointmentStatus =
  | 'pending'
  | 'confirmed'
  | 'cancelled'
  | 'completed'
  | 'missed'
  | 'rescheduled';

export type ConsultationType = 'online' | 'opd';

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  doctor?: Doctor;
  department?: Department;
  slotId: string;
  consultationType: ConsultationType;
  status: AppointmentStatus;
  date: string;
  startTime: string;
  endTime: string;
  reason?: string;
  symptoms?: string;
  notes?: string;
  paymentId?: string;
  payment?: Payment;
  prescription?: Prescription;
  meetingLink?: string;
  cancellationReason?: string;
  rescheduledFrom?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Slot {
  id: string;
  doctorId: string;
  date: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
  isAvailable: boolean;
}

export interface Payment {
  id: string;
  appointmentId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'success' | 'failed' | 'refunded';
  method?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Prescription {
  id: string;
  appointmentId: string;
  doctorId: string;
  patientId: string;
  diagnosis: string;
  medicines: MedicineRecord[];
  pathologyTests: PathologyTest[];
  notes?: string;
  pdfUrl?: string;
  createdAt: string;
}

export interface MedicineRecord {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
  beforeFood: boolean;
}

export interface PathologyTest {
  id: string;
  name: string;
  instructions?: string;
  isCompleted: boolean;
  reportUrl?: string;
}

export interface PharmacyOrder {
  id: string;
  patientId: string;
  appointmentId?: string;
  prescriptionId?: string;
  medicines: MedicineOrder[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  deliveryAddress: Address;
  paymentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MedicineOrder {
  medicineId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  category: string;
  manufacturer: string;
  price: number;
  requiresPrescription: boolean;
  stock: number;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type:
    | 'appointment_booked'
    | 'appointment_confirmed'
    | 'appointment_cancelled'
    | 'appointment_rescheduled'
    | 'appointment_reminder'
    | 'prescription_generated'
    | 'report_uploaded'
    | 'medicine_ready'
    | 'payment_success'
    | 'payment_failed'
    | 'general';
  data?: Record<string, any>;
  isRead: boolean;
  createdAt: string;
}

export interface Review {
  id: string;
  doctorId: string;
  patientId: string;
  appointmentId: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  appointmentId?: string;
  message: string;
  messageType: 'text' | 'image' | 'file';
  fileUrl?: string;
  isRead: boolean;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface LoginRequest {
  email?: string;
  phone?: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

export interface OTPVerifyRequest {
  otp: string;
  verificationId: string;
}

export interface CreateAppointmentRequest {
  doctorId: string;
  slotId: string;
  consultationType: ConsultationType;
  date: string;
  reason?: string;
  symptoms?: string;
}

export interface DoctorFilters {
  search?: string;
  specialization?: string;
  departmentId?: string;
  experienceMin?: number;
  experienceMax?: number;
  feeMin?: number;
  feeMax?: number;
  ratingMin?: number;
  sortBy?: 'rating' | 'experience' | 'fees';
  sortOrder?: 'asc' | 'desc';
  latitude?: number;
  longitude?: number;
  maxDistance?: number;
}

export interface NearbyDoctor {
  doctor: Doctor;
  distance: number;
}
