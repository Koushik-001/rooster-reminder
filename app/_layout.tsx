import '../global.css';

import { Slot, usePathname } from 'expo-router';
import { View } from 'react-native';

import { BottomNav } from '../components/GenericComponents';
import { useEffect } from 'react';
import { requestNotificationPermission } from 'services/notificationService';

export default function RootLayout() {
  const pathname = usePathname();

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  return (
      <View className="flex-1">
        <Slot />

        <View className="absolute bottom-9 items-center w-full">
          <BottomNav pathname={pathname} />
        </View>
      </View>
  );
}
