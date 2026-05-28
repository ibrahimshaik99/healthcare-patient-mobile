import {useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {RootState, AppDispatch} from '../store';
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  fetchUnreadCount,
  addNotification,
} from '../store/slices/notificationSlice';
import {Notification} from '../types';

export const useNotifications = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {notifications, unreadCount, isLoading, error} = useSelector(
    (state: RootState) => state.notifications,
  );

  const getNotifications = useCallback(async () => {
    return dispatch(fetchNotifications()).unwrap();
  }, [dispatch]);

  const markAsRead = useCallback(
    async (id: string) => {
      return dispatch(markNotificationAsRead(id)).unwrap();
    },
    [dispatch],
  );

  const markAllRead = useCallback(async () => {
    return dispatch(markAllNotificationsAsRead()).unwrap();
  }, [dispatch]);

  const getUnreadCount = useCallback(async () => {
    return dispatch(fetchUnreadCount()).unwrap();
  }, [dispatch]);

  const pushNotification = useCallback(
    (notification: Notification) => {
      dispatch(addNotification(notification));
    },
    [dispatch],
  );

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    getNotifications,
    markAsRead,
    markAllRead,
    getUnreadCount,
    pushNotification,
  };
};
