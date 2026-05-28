import {io, Socket} from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_CONFIG} from '../config/api';

let socket: Socket | null = null;
const MAX_RETRIES = 5;
let retryCount = 0;
let retryTimeout: NodeJS.Timeout | null = null;

const getRetryDelay = (attempt: number): number => {
  return Math.min(1000 * Math.pow(2, attempt), 30000);
};

export const connectSocket = async (): Promise<Socket> => {
  if (socket?.connected) {
    return socket;
  }

  const token = await AsyncStorage.getItem('auth_token');
  const patientId = await AsyncStorage.getItem('patient_id');

  if (!token) {
    throw new Error('No auth token available');
  }

  socket = io(API_CONFIG.SOCKET_URL, {
    auth: {token},
    transports: ['websocket'],
    forceNew: true,
    reconnection: false,
  });

  socket.on('connect', () => {
    retryCount = 0;
    if (patientId) {
      socket?.emit('join_room', {room: `patient:${patientId}`});
    }
  });

  socket.on('disconnect', (reason: string) => {
    if (reason === 'io server disconnect') {
      return;
    }
    handleReconnect();
  });

  socket.on('connect_error', () => {
    handleReconnect();
  });

  return socket;
};

const handleReconnect = () => {
  if (retryCount >= MAX_RETRIES) {
    disconnectSocket();
    return;
  }

  const delay = getRetryDelay(retryCount);
  retryCount++;

  if (retryTimeout) {
    clearTimeout(retryTimeout);
  }

  retryTimeout = setTimeout(async () => {
    try {
      await connectSocket();
    } catch {
      handleReconnect();
    }
  }, delay);
};

export const disconnectSocket = () => {
  if (retryTimeout) {
    clearTimeout(retryTimeout);
    retryTimeout = null;
  }
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }
  retryCount = 0;
};

export const getSocket = (): Socket | null => {
  return socket;
};

export const joinPatientRoom = (patientId: string) => {
  socket?.emit('join_room', {room: `patient:${patientId}`});
};

export const appointmentEvents = {
  onBooked: (callback: (data: any) => void) => {
    socket?.on('appointment_booked', callback);
    return () => socket?.off('appointment_booked', callback);
  },
  onCancelled: (callback: (data: any) => void) => {
    socket?.on('appointment_cancelled', callback);
    return () => socket?.off('appointment_cancelled', callback);
  },
  onRescheduled: (callback: (data: any) => void) => {
    socket?.on('appointment_rescheduled', callback);
    return () => socket?.off('appointment_rescheduled', callback);
  },
};

export const prescriptionEvents = {
  onGenerated: (callback: (data: any) => void) => {
    socket?.on('prescription_generated', callback);
    return () => socket?.off('prescription_generated', callback);
  },
};

export const reportEvents = {
  onUploaded: (callback: (data: any) => void) => {
    socket?.on('report_uploaded', callback);
    return () => socket?.off('report_uploaded', callback);
  },
};

export const medicineEvents = {
  onReady: (callback: (data: any) => void) => {
    socket?.on('medicine_ready', callback);
    return () => socket?.off('medicine_ready', callback);
  },
};

export const paymentEvents = {
  onSuccess: (callback: (data: any) => void) => {
    socket?.on('payment_success', callback);
    return () => socket?.off('payment_success', callback);
  },
};
