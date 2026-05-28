import {useState, useCallback} from 'react';
import {doctorApi} from '../services/api';
import {Doctor, DoctorFilters, Review} from '../types';

export const useDoctors = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);

  const searchDoctors = useCallback(async (filters?: DoctorFilters, pageNum: number = 1) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await doctorApi.getDoctors({...filters, page: pageNum} as any);
      if (response.success) {
        if (pageNum === 1) {
          setDoctors(response.data);
        } else {
          setDoctors(prev => [...prev, ...response.data]);
        }
        setTotalPages(response.totalPages);
        setPage(pageNum);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to fetch doctors');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getDoctor = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await doctorApi.getDoctorById(id);
      if (response.success) {
        setSelectedDoctor(response.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to fetch doctor');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getReviews = useCallback(async (doctorId: string) => {
    try {
      const response = await doctorApi.getDoctorReviews(doctorId);
      if (response.success) {
        setReviews(response.data);
      }
    } catch {
      // Reviews fetch failed silently
    }
  }, []);

  const getNearby = useCallback(async (latitude: number, longitude: number, maxDistance?: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await doctorApi.getNearbyDoctors(latitude, longitude, maxDistance);
      if (response.success) {
        setDoctors(response.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to fetch nearby doctors');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    doctors,
    selectedDoctor,
    reviews,
    isLoading,
    error,
    totalPages,
    page,
    searchDoctors,
    getDoctor,
    getReviews,
    getNearby,
    setSelectedDoctor,
  };
};
