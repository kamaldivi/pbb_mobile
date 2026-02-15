import { useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { useOfflineStore } from '@/stores/offlineStore';

export const useNetworkStatus = () => {
  const { isOnline, setOnlineStatus } = useOfflineStore();

  useEffect(() => {
    // Subscribe to network status changes
    const unsubscribe = NetInfo.addEventListener((state) => {
      const online = state.isConnected === true && state.isInternetReachable !== false;
      setOnlineStatus(online);
    });

    // Fetch initial network status
    NetInfo.fetch().then((state) => {
      const online = state.isConnected === true && state.isInternetReachable !== false;
      setOnlineStatus(online);
    });

    return () => {
      unsubscribe();
    };
  }, [setOnlineStatus]);

  return isOnline;
};
