import {useEffect, useRef, useCallback} from 'react';
import {AppState, AppStateStatus} from 'react-native';
import {connectSocket, disconnectSocket, getSocket} from '../services/socket';

export const useSocket = (isAuthenticated: boolean) => {
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    if (!isAuthenticated) {
      disconnectSocket();
      return;
    }

    const setupSocket = async () => {
      try {
        await connectSocket();
      } catch {
        // Socket connection failed
      }
    };

    setupSocket();

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
      disconnectSocket();
    };
  }, [isAuthenticated]);

  const handleAppStateChange = useCallback((nextAppState: AppStateStatus) => {
    if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
      const socket = getSocket();
      if (!socket?.connected) {
        connectSocket();
      }
    } else if (nextAppState.match(/inactive|background/)) {
      // App going to background
    }
    appState.current = nextAppState;
  }, []);

  const emit = useCallback((event: string, data?: any) => {
    const socket = getSocket();
    if (socket?.connected) {
      socket.emit(event, data);
    }
  }, []);

  return {emit};
};
