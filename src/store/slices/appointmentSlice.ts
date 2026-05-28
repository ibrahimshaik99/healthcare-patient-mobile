import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import {appointmentApi} from '../../services/api';
import {Appointment, CreateAppointmentRequest, Slot} from '../../types';

interface AppointmentState {
  appointments: Appointment[];
  currentAppointment: Appointment | null;
  availableSlots: Slot[];
  isLoading: boolean;
  isCreating: boolean;
  error: string | null;
}

const initialState: AppointmentState = {
  appointments: [],
  currentAppointment: null,
  availableSlots: [],
  isLoading: false,
  isCreating: false,
  error: null,
};

export const fetchAppointments = createAsyncThunk(
  'appointments/fetchAll',
  async (status: string | undefined, {rejectWithValue}) => {
    try {
      const response = await appointmentApi.getAppointments(status);
      if (response.success) {
        return response.data;
      }
      return rejectWithValue(response.error || 'Failed to fetch appointments');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.message || 'Failed to fetch appointments');
    }
  },
);

export const createAppointment = createAsyncThunk(
  'appointments/create',
  async (data: CreateAppointmentRequest, {rejectWithValue}) => {
    try {
      const response = await appointmentApi.createAppointment(data);
      if (response.success) {
        return response.data;
      }
      return rejectWithValue(response.error || 'Failed to create appointment');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.message || 'Failed to create appointment');
    }
  },
);

export const cancelAppointment = createAsyncThunk(
  'appointments/cancel',
  async ({id, reason}: {id: string; reason?: string}, {rejectWithValue}) => {
    try {
      const response = await appointmentApi.cancelAppointment(id, reason);
      if (response.success) {
        return response.data;
      }
      return rejectWithValue(response.error || 'Failed to cancel appointment');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.message || 'Failed to cancel appointment');
    }
  },
);

export const rescheduleAppointment = createAsyncThunk(
  'appointments/reschedule',
  async ({id, slotId, date}: {id: string; slotId: string; date: string}, {rejectWithValue}) => {
    try {
      const response = await appointmentApi.rescheduleAppointment(id, slotId, date);
      if (response.success) {
        return response.data;
      }
      return rejectWithValue(response.error || 'Failed to reschedule appointment');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.message || 'Failed to reschedule appointment');
    }
  },
);

export const fetchAvailableSlots = createAsyncThunk(
  'appointments/fetchSlots',
  async ({doctorId, date}: {doctorId: string; date: string}, {rejectWithValue}) => {
    try {
      const response = await appointmentApi.getAvailableSlots(doctorId, date);
      if (response.success) {
        return response.data;
      }
      return rejectWithValue(response.error || 'Failed to fetch slots');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.message || 'Failed to fetch slots');
    }
  },
);

const appointmentSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    setCurrentAppointment: (state, action: PayloadAction<Appointment | null>) => {
      state.currentAppointment = action.payload;
    },
    clearAppointments: (state) => {
      state.appointments = [];
      state.currentAppointment = null;
      state.availableSlots = [];
    },
    updateAppointmentInList: (state, action: PayloadAction<Appointment>) => {
      const index = state.appointments.findIndex(a => a.id === action.payload.id);
      if (index !== -1) {
        state.appointments[index] = action.payload;
      }
    },
    clearSlots: (state) => {
      state.availableSlots = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppointments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.appointments = action.payload;
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createAppointment.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createAppointment.fulfilled, (state, action) => {
        state.isCreating = false;
        state.appointments.unshift(action.payload);
        state.currentAppointment = action.payload;
      })
      .addCase(createAppointment.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload as string;
      })
      .addCase(cancelAppointment.fulfilled, (state, action) => {
        const index = state.appointments.findIndex(a => a.id === action.payload.id);
        if (index !== -1) {
          state.appointments[index] = action.payload;
        }
        if (state.currentAppointment?.id === action.payload.id) {
          state.currentAppointment = action.payload;
        }
      })
      .addCase(rescheduleAppointment.fulfilled, (state, action) => {
        const index = state.appointments.findIndex(a => a.id === action.payload.id);
        if (index !== -1) {
          state.appointments[index] = action.payload;
        }
        if (state.currentAppointment?.id === action.payload.id) {
          state.currentAppointment = action.payload;
        }
      })
      .addCase(fetchAvailableSlots.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAvailableSlots.fulfilled, (state, action) => {
        state.isLoading = false;
        state.availableSlots = action.payload;
      })
      .addCase(fetchAvailableSlots.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {setCurrentAppointment, clearAppointments, updateAppointmentInList, clearSlots} = appointmentSlice.actions;
export default appointmentSlice.reducer;
