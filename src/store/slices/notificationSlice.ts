import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import {notificationApi} from '../../services/api';
import {Notification} from '../../types';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
};

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchAll',
  async (_, {rejectWithValue}) => {
    try {
      const response = await notificationApi.getNotifications();
      if (response.success) {
        return response.data;
      }
      return rejectWithValue(response.error || 'Failed to fetch notifications');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.message || 'Failed to fetch notifications');
    }
  },
);

export const markNotificationAsRead = createAsyncThunk(
  'notifications/markRead',
  async (id: string, {rejectWithValue}) => {
    try {
      const response = await notificationApi.markAsRead(id);
      if (response.success) {
        return id;
      }
      return rejectWithValue(response.error || 'Failed to mark as read');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.message || 'Failed to mark as read');
    }
  },
);

export const markAllNotificationsAsRead = createAsyncThunk(
  'notifications/markAllRead',
  async (_, {rejectWithValue}) => {
    try {
      const response = await notificationApi.markAllAsRead();
      if (response.success) {
        return true;
      }
      return rejectWithValue(response.error || 'Failed to mark all as read');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.message || 'Failed to mark all as read');
    }
  },
);

export const fetchUnreadCount = createAsyncThunk(
  'notifications/unreadCount',
  async (_, {rejectWithValue}) => {
    try {
      const response = await notificationApi.getUnreadCount();
      if (response.success) {
        return response.data.count;
      }
      return rejectWithValue(response.error || 'Failed to fetch unread count');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.message || 'Failed to fetch unread count');
    }
  },
);

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.unshift(action.payload);
      if (!action.payload.isRead) {
        state.unreadCount += 1;
      }
    },
    clearNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notifications = action.payload;
        state.unreadCount = action.payload.filter(n => !n.isRead).length;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const notification = state.notifications.find(n => n.id === action.payload);
        if (notification && !notification.isRead) {
          notification.isRead = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
        state.notifications.forEach(n => { n.isRead = true; });
        state.unreadCount = 0;
      })
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload;
      });
  },
});

export const {addNotification, clearNotifications} = notificationSlice.actions;
export default notificationSlice.reducer;
