import {Department} from '../types';

export const DEPARTMENTS: Department[] = [
  {id: '1', name: 'General', icon: 'medical', color: '#2563EB'},
  {id: '2', name: 'Cardiologist', icon: 'heart', color: '#EF4444'},
  {id: '3', name: 'Dentist', icon: 'tooth', color: '#8B5CF6'},
  {id: '4', name: 'Dermatologist', icon: 'skin', color: '#F59E0B'},
  {id: '5', name: 'ENT', icon: 'ear', color: '#10B981'},
  {id: '6', name: 'Eye', icon: 'eye', color: '#3B82F6'},
  {id: '7', name: 'Gynecologist', icon: 'mother', color: '#EC4899'},
  {id: '8', name: 'Neurologist', icon: 'brain', color: '#6366F1'},
  {id: '9', name: 'Orthopedic', icon: 'bone', color: '#F97316'},
  {id: '10', name: 'Pediatrician', icon: 'child', color: '#14B8A6'},
];

export const SPECIALIZATIONS = [
  'General Physician',
  'Cardiologist',
  'Dentist',
  'Dermatologist',
  'ENT Specialist',
  'Ophthalmologist',
  'Gynecologist',
  'Neurologist',
  'Orthopedic Surgeon',
  'Pediatrician',
  'Psychiatrist',
  'Pulmonologist',
  'Endocrinologist',
  'Gastroenterologist',
  'Nephrologist',
  'Oncologist',
  'Rheumatologist',
  'Urologist',
];

export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const GENDERS = [
  {label: 'Male', value: 'male'},
  {label: 'Female', value: 'female'},
  {label: 'Other', value: 'other'},
];

export const CONSULTATION_TYPES = [
  {id: 'online', label: 'Online Consultation', description: 'Video call with doctor', icon: 'video'},
  {id: 'opd', label: 'OPD Consultation', description: 'Visit clinic in person', icon: 'hospital'},
];

export const APPOINTMENT_STATUS_COLORS: Record<string, string> = {
  pending: '#F59E0B',
  confirmed: '#10B981',
  cancelled: '#EF4444',
  completed: '#3B82F6',
  missed: '#6B7280',
  rescheduled: '#8B5CF6',
};
