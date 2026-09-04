import { useRouter } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

type ReminderOptionRowProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
  onPress?: () => void;
  withDivider?: boolean;
};

export function ReminderOptionRow({
  icon,
  label,
  value,
  onPress,
  withDivider = false,
}: ReminderOptionRowProps) {
  return (
    <>
      <Pressable onPress={onPress} className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          {icon}
          <Text className="text-white ml-2 text-xl font-bold">{label}</Text>
        </View>

        <View className="flex-row items-center">
          <Text className="text-white ml-2 text-xl font-bold">{value}</Text>
          <ChevronRight color="white" size={20} />
        </View>
      </Pressable>

      {withDivider ? <View className="h-[1px] bg-white/20 my-5" /> : null}
    </>
  );
}

type PickerModalProps = {
  title: string;
  visible: boolean;
  children: React.ReactNode;
  onClose: () => void;
};

export function PickerModal({
  title,
  visible,
  children,
  onClose,
}: PickerModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black/60 justify-end">
        <Pressable className="flex-1" onPress={onClose} />

        <View className="bg-[#1c242f] px-5 pt-5 pb-8 rounded-t-3xl">
          <View className="flex-row items-center justify-between mb-5">
            <Text className="text-white text-xl font-bold">{title}</Text>
            <Pressable onPress={onClose} className="px-3 py-2 rounded-full bg-white/10">
              <Text className="text-white font-bold">Done</Text>
            </Pressable>
          </View>

          {children}
        </View>
      </View>
    </Modal>
  );
}

type TimeScrollerProps = {
  selectedHour: number;
  selectedMinute: number;
  onSelectHour: (hour: number) => void;
  onSelectMinute: (minute: number) => void;
};

export function TimeScroller({
  selectedHour,
  selectedMinute,
  onSelectHour,
  onSelectMinute,
}: TimeScrollerProps) {
  const hours = Array.from({ length: 24 }, (_, index) => index);
  const minutes = Array.from({ length: 60 }, (_, index) => index);

  return (
    <View className="gap-4">
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row gap-3">
          {hours.map((hour) => (
            <Pressable
              key={hour}
              onPress={() => onSelectHour(hour)}
              className={selectedHour === hour ? 'bg-white px-4 py-3 rounded-full' : 'bg-white/10 px-4 py-3 rounded-full'}
            >
              <Text className={selectedHour === hour ? 'text-black font-bold' : 'text-white font-bold'}>
                {hour.toString().padStart(2, '0')}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row gap-3">
          {minutes.map((minute) => (
            <Pressable
              key={minute}
              onPress={() => onSelectMinute(minute)}
              className={selectedMinute === minute ? 'bg-white px-4 py-3 rounded-full' : 'bg-white/10 px-4 py-3 rounded-full'}
            >
              <Text className={selectedMinute === minute ? 'text-black font-bold' : 'text-white font-bold'}>
                {minute.toString().padStart(2, '0')}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

type MinuteScrollerProps = {
  options: number[];
  selectedValue: number;
  onSelect: (value: number) => void;
};

export function MinuteScroller({
  options,
  selectedValue,
  onSelect,
}: MinuteScrollerProps) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View className="flex-row gap-3">
        {options.map((option) => (
          <Pressable
            key={option}
            onPress={() => onSelect(option)}
            className={selectedValue === option ? 'bg-white px-5 py-3 rounded-full' : 'bg-white/10 px-5 py-3 rounded-full'}
          >
            <Text className={selectedValue === option ? 'text-black font-bold' : 'text-white font-bold'}>
              {option} min
            </Text>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

type ReminderCardProps = {
  children: React.ReactNode;
};

export function ReminderCard({ children }: ReminderCardProps) {
  return (
    <View className="w-full bg-[#1c242f] p-5 rounded-lg">
      {children}
    </View>
  );
}

type PrimaryButtonProps = {
  label: string;
  onPress?: () => void;
};

export function PrimaryButton({ label, onPress }: PrimaryButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      className="w-[72%] bg-[#f9c442] py-3 rounded-xl items-center"
    >
      <Text className="text-black font-bold text-lg">{label}</Text>
    </Pressable>
  );
}

type BottomNavProps = {
  pathname: string;
};

export function BottomNav({ pathname }: BottomNavProps) {
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
    <View
      onLayout={(event) => setNavWidth(event.nativeEvent.layout.width)}
      className="relative bg-[#1c242f] rounded-full p-1 w-[50%] flex-row overflow-hidden"
    >
      <Animated.View
        style={pillStyle}
        className="absolute left-1 top-1 bottom-1 bg-white rounded-full"
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
  );
}
