import {useCallback, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {RootState, AppDispatch} from '../store';
import {
  loginUser,
  registerUser,
  verifyOTP,
  logout,
  setUser,
  restoreAuth,
  clearError,
} from '../store/slices/authSlice';
import {LoginRequest, RegisterRequest} from '../types';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {user, token, isAuthenticated, isLoading, error, verificationId} = useSelector(
    (state: RootState) => state.auth,
  );

  useEffect(() => {
    restoreSession();
  }, []);

  const restoreSession = useCallback(async () => {
    try {
      const savedToken = await AsyncStorage.getItem('auth_token');
      const savedUser = await AsyncStorage.getItem('user_data');
      if (savedToken && savedUser) {
        dispatch(restoreAuth({token: savedToken, user: JSON.parse(savedUser)}));
      }
    } catch {
      // Session restore failed
    }
  }, [dispatch]);

  const login = useCallback(
    async (data: LoginRequest) => {
      return dispatch(loginUser(data)).unwrap();
    },
    [dispatch],
  );

  const register = useCallback(
    async (data: RegisterRequest) => {
      return dispatch(registerUser(data)).unwrap();
    },
    [dispatch],
  );

  const verifyOtp = useCallback(
    async (otp: string, verificationId: string) => {
      return dispatch(verifyOTP({otp, verificationId})).unwrap();
    },
    [dispatch],
  );

  const signOut = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  const updateUser = useCallback(
    (data: any) => {
      dispatch(setUser(data));
    },
    [dispatch],
  );

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    verificationId,
    login,
    register,
    verifyOtp,
    signOut,
    updateUser,
    clearError,
  };
};
