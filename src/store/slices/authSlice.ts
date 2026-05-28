import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {authApi} from '../../services/api';
import {Patient, LoginRequest, RegisterRequest} from '../../types';

interface AuthState {
  user: Patient | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  verificationId: string | null;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  verificationId: null,
  error: null,
};

export const loginUser = createAsyncThunk(
  'auth/login',
  async (data: LoginRequest, {rejectWithValue}) => {
    try {
      const response = await authApi.login(data);
      if (response.success) {
        await AsyncStorage.setItem('auth_token', response.data.token);
        await AsyncStorage.setItem('patient_id', response.data.user.id);
        await AsyncStorage.setItem('user_data', JSON.stringify(response.data.user));
        return response.data;
      }
      return rejectWithValue(response.error || 'Login failed');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.message || 'Login failed');
    }
  },
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (data: RegisterRequest, {rejectWithValue}) => {
    try {
      const response = await authApi.register(data);
      if (response.success) {
        return {verificationId: response.data.verificationId};
      }
      return rejectWithValue(response.error || 'Registration failed');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.message || 'Registration failed');
    }
  },
);

export const verifyOTP = createAsyncThunk(
  'auth/verifyOTP',
  async (data: {otp: string; verificationId: string}, {rejectWithValue}) => {
    try {
      const response = await authApi.verifyOTP(data);
      if (response.success) {
        await AsyncStorage.setItem('auth_token', response.data.token);
        await AsyncStorage.setItem('patient_id', response.data.user.id);
        await AsyncStorage.setItem('user_data', JSON.stringify(response.data.user));
        return response.data;
      }
      return rejectWithValue(response.error || 'Verification failed');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.message || 'Verification failed');
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      AsyncStorage.multiRemove(['auth_token', 'patient_id', 'user_data']);
    },
    setUser: (state, action: PayloadAction<Patient>) => {
      state.user = action.payload;
    },
    updateProfile: (state, action: PayloadAction<Partial<Patient>>) => {
      if (state.user) {
        state.user = {...state.user, ...action.payload};
      }
    },
    restoreAuth: (state, action: PayloadAction<{user: Patient; token: string}>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    clearError: (state) => {
      state.error = null;
    },
    setVerificationId: (state, action: PayloadAction<string>) => {
      state.verificationId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.verificationId = action.payload.verificationId;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(verifyOTP.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.verificationId = null;
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {logout, setUser, updateProfile, restoreAuth, clearError, setVerificationId} = authSlice.actions;
export default authSlice.reducer;
