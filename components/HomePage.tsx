import { ArrowDown, ArrowUp, Bell, Clock, User } from 'lucide-react-native';
import React, { useState } from 'react';
import { Image, Pressable, Text, TextInput, View } from 'react-native';

import { Calendar } from 'react-native-calendars';
import Animated, {
  FadeInUp,
  FadeOutUp,
} from 'react-native-reanimated';

import { scheduleReminderNotifications } from '../services/notificationService';

import {
  MinuteScroller,
  PickerModal,
  PrimaryButton,
  ReminderCard,
  ReminderOptionRow,
  TimeScroller,
} from '../components/GenericComponents';
import { saveReminder } from 'services/reminderStorage';

interface HomePageProps {
  title: string;
  path: string;
  children?: React.ReactNode;
}

export const HomePage: React.FC<HomePageProps> = () => {
  const today = new Date();
  const todayKey = today.toISOString().split('T')[0];

  const currentHour = today.getHours();
  const currentMinute = today.getMinutes();

  const [calendarClicked, setcalendarClicked] = useState(false);
  const [selectedDate, setSelectedDate] = useState(todayKey);
  const [timePickerOpen, setTimePickerOpen] = useState(false);
  const [reminderPickerOpen, setReminderPickerOpen] = useState(false);

  const [selectedHour, setSelectedHour] = useState(currentHour);
  const [selectedMinute, setSelectedMinute] = useState(currentMinute);
  const [reminderOffset, setReminderOffset] = useState(5);

  const [note, setNote] = useState('');
  const [noteKey, setNoteKey] = useState(0);

  const formattedTime = `${selectedHour
    .toString()
    .padStart(2, '0')}:${selectedMinute
      .toString()
      .padStart(2, '0')}`;

  const selectedDateText = new Date(
    `${selectedDate}T00:00:00`
  ).toLocaleString('default', {
    month: 'long',
    day: 'numeric',
  });

  const handleSubmitReminder = async () => {
    try {
      if (!note.trim()) {
        return;
      }

      const notificationIds = await scheduleReminderNotifications({
        note: note.trim(),
        date: selectedDate,
        hour: selectedHour,
        minute: selectedMinute,
        reminderOffset,
      });

      await saveReminder({
        id: Date.now().toString(),
        note: note.trim(),
        date: selectedDate,
        hour: selectedHour,
        minute: selectedMinute,
        reminderOffset,
        notificationId: notificationIds.reminderNotificationId,
        beforeNotificationId: notificationIds.beforeNotificationId,
      });

      console.log('Reminder scheduled successfully');

      const now = new Date();

      setSelectedHour(now.getHours());
      setSelectedMinute(now.getMinutes());

      setNote('');

      setNoteKey((prev) => prev + 1);
    } catch (error) {
      console.error('Failed to schedule reminder:', error);
    }
  };

  return (
    <View className="bg-[#060d15] flex-1 px-5 pt-12 pb-32">

      <View className="flex-row justify-between items-center">
        <Pressable
          onPress={() => setcalendarClicked(!calendarClicked)}
          className="active:scale-110 transition-all bg-transparent p-2 rounded-xl"
        >
          <View className="flex-row gap-2 items-center bg-[#1c242f] px-3 py-2 rounded-xl">
            <Text className="text-white font-bold">
              {selectedDateText}
            </Text>

            {calendarClicked ? (
              <ArrowUp color="white" size={15} />
            ) : (
              <ArrowDown color="white" size={15} />
            )}
          </View>
        </Pressable>

        <User size={24} color="white" />
      </View>

      <View className="flex-1 justify-end">

        {!calendarClicked ? (
          <Animated.View
            key={noteKey}
            entering={FadeInUp.duration(400)}
            exiting={FadeOutUp.duration(400)}
            className="flex-1 justify-center relative"
          >
            <Image
              source={require('../assets/notepad.png')}
              resizeMode="contain"
              className="w-full h-full"
            />

            <TextInput
              value={note}
              onChangeText={setNote}
              multiline
              textAlignVertical="top"
              placeholder="Write your reminder..."
              placeholderTextColor="#8a6f17"
              className="absolute top-[24%] left-[12%] right-[12%] bottom-[24%] text-[#3a2b05] text-xl font-bold leading-7"
              style={{ flexWrap: 'wrap' }}
            />
          </Animated.View>
        ) : null}

        {calendarClicked ? (
          <Animated.View
            entering={FadeInUp.duration(500)}
            exiting={FadeOutUp.duration(500)}
            className="mb-8"
          >
            <View className="border border-black-100/30 rounded-lg p-2">
              <Calendar
                enableSwipeMonths
                markedDates={{
                  [selectedDate]: {
                    selected: true,
                    selectedColor: '#f9c442',
                  },
                }}
                onDayPress={(day) => {
                  setSelectedDate(day.dateString);
                  setcalendarClicked(false);
                }}
              />
            </View>
          </Animated.View>
        ) : null}

        <View className="gap-8 items-center">
          <ReminderCard>

            <ReminderOptionRow
              icon={<Clock color="white" size={20} />}
              label="Time"
              value={formattedTime}
              onPress={() => setTimePickerOpen(true)}
              withDivider
            />

            <ReminderOptionRow
              icon={<Bell color="white" size={20} />}
              label="Remind Me"
              value={`${reminderOffset} min`}
              onPress={() => setReminderPickerOpen(true)}
            />

          </ReminderCard>

          <PrimaryButton
            label="Set Reminder"
            onPress={handleSubmitReminder}
          />
        </View>
      </View>

      <PickerModal
        title="Select Time"
        visible={timePickerOpen}
        onClose={() => setTimePickerOpen(false)}
      >
        <TimeScroller
          selectedHour={selectedHour}
          selectedMinute={selectedMinute}
          onSelectHour={setSelectedHour}
          onSelectMinute={setSelectedMinute}
        />
      </PickerModal>

      <PickerModal
        title="Remind Me"
        visible={reminderPickerOpen}
        onClose={() => setReminderPickerOpen(false)}
      >
        <MinuteScroller
          options={[5, 10, 15, 20]}
          selectedValue={reminderOffset}
          onSelect={setReminderOffset}
        />
      </PickerModal>

    </View>
  );
};