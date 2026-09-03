import '../global.css';

import { Slot, usePathname, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

export default function RootLayout() {
  const pathname = usePathname();
  const router = useRouter();
  const [navWidth, setNavWidth] = useState(0);
  const pillPosition = useSharedValue(pathname === '/calendar' ? 1 : 0);

  useEffect(() => {
    pillPosition.value = withSpring(pathname === '/calendar' ? 1 : 0, {
      damping: 20,
      stiffness: 180,
    });
  }, [pathname, pillPosition]);

  const pillStyle = useAnimatedStyle(() => ({
    width: navWidth / 2 - 8,
    transform: [{ translateX: pillPosition.value * (navWidth / 2) }],
  }));

  return (
    <View className="flex-1">
      <Slot />

      <View className="absolute top-[90vh] items-center w-full">
        <View
          onLayout={(event) => setNavWidth(event.nativeEvent.layout.width)}
          className="relative bg-[#1c242f] rounded-full p-1 w-[50%] flex-row overflow-hidden"
        >
          <Animated.View
            style={pillStyle}
            className="absolute left-1 top-1 bottom-1 w-1/2 bg-white rounded-full"
          />

          <Pressable
            onPress={() => router.push('/home')}
            className="flex-1 p-2 items-center"
          >
            <Text className={pathname === '/home' ? 'text-black' : 'text-white'}>
              Home
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.push('/calendar')}
            className="flex-1 p-2 items-center"
          >
            <Text className={pathname === '/calendar' ? 'text-black' : 'text-white'}>
              Calendar
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
