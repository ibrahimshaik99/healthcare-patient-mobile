import {useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {RootState, AppDispatch} from '../store';
import {
  fetchAppointments,
  createAppointment,
  cancelAppointment,
  rescheduleAppointment,
  fetchAvailableSlots,
  setCurrentAppointment,
  clearSlots,
} from '../store/slices/appointmentSlice';
import {CreateAppointmentRequest} from '../types';

export const useAppointments = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {appointments, currentAppointment, availableSlots, isLoading, isCreating, error} = useSelector(
    (state: RootState) => state.appointments,
  );

  const getAppointments = useCallback(
    async (status?: string) => {
      return dispatch(fetchAppointments(status)).unwrap();
    },
    [dispatch],
  );

  const bookAppointment = useCallback(
    async (data: CreateAppointmentRequest) => {
      return dispatch(createAppointment(data)).unwrap();
    },
    [dispatch],
  );

  const cancel = useCallback(
    async (id: string, reason?: string) => {
      return dispatch(cancelAppointment({id, reason})).unwrap();
    },
    [dispatch],
  );

  const reschedule = useCallback(
    async (id: string, slotId: string, date: string) => {
      return dispatch(rescheduleAppointment({id, slotId, date})).unwrap();
    },
    [dispatch],
  );

  const getSlots = useCallback(
    async (doctorId: string, date: string) => {
      return dispatch(fetchAvailableSlots({doctorId, date})).unwrap();
    },
    [dispatch],
  );

  const selectAppointment = useCallback(
    (appointment: any) => {
      dispatch(setCurrentAppointment(appointment));
    },
    [dispatch],
  );

  const resetSlots = useCallback(() => {
    dispatch(clearSlots());
  }, [dispatch]);

  return {
    appointments,
    upcomingAppointments: appointments.filter(a => a.status === 'pending' || a.status === 'confirmed'),
    completedAppointments: appointments.filter(a => a.status === 'completed'),
    cancelledAppointments: appointments.filter(a => a.status === 'cancelled'),
    currentAppointment,
    availableSlots,
    isLoading,
    isCreating,
    error,
    getAppointments,
    bookAppointment,
    cancel,
    reschedule,
    getSlots,
    selectAppointment,
    resetSlots,
  };
};
