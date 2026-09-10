import React, { useCallback, useState } from 'react';
import {
    View,
    Text,
    Modal,
    Pressable,
    ScrollView,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Calendar, DateData } from 'react-native-calendars';
import { Pin, ChevronDown, X } from 'lucide-react-native';

import {
    getReminders,
    StoredReminder,
} from '../services/reminderStorage';

interface CalendarPageProps {
    title: string;
    path: string;
    children?: React.ReactNode;
}

type ReminderStatus = 'upcoming' | 'finished';

export const CalendarPage: React.FC<CalendarPageProps> = () => {
    const today = new Date();

    const todayKey = [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, '0'),
        String(today.getDate()).padStart(2, '0'),
    ].join('-');

    const currentYear = today.getFullYear();
    const currentMonth = String(today.getMonth() + 1).padStart(2, '0');

    const [displayedMonth, setDisplayedMonth] = useState(
        `${currentYear}-${currentMonth}`
    );

    const [calendarKey, setCalendarKey] = useState(0);

    const [reminders, setReminders] = useState<StoredReminder[]>([]);

    const [selectedDate, setSelectedDate] = useState<string | null>(
        null
    );

    const [reminderModalVisible, setReminderModalVisible] =
        useState(false);

    const [yearModalVisible, setYearModalVisible] =
        useState(false);

    useFocusEffect(
        useCallback(() => {
            const load = async () => {
                try {
                    const stored = await getReminders();

                    setReminders(stored);

                    console.log(
                        'Calendar reminders:',
                        stored
                    );
                } catch (error) {
                    console.error(
                        'Failed to load reminders:',
                        error
                    );
                }
            };

            load();
        }, [])
    );

    const remindersForDate = (date: string) => {
        return reminders.filter(
            (reminder) => reminder.date === date
        );
    };

    const handleDayPress = (day: DateData) => {
        setSelectedDate(day.dateString);

        const dateReminders = remindersForDate(
            day.dateString
        );

        if (dateReminders.length > 0) {
            setReminderModalVisible(true);
        }
    };

    const reminderStatus: Record<string, ReminderStatus> = {};

    const now = new Date();

    reminders.forEach((reminder) => {
        const [year, month, day] = reminder.date
            .split('-')
            .map(Number);

        const reminderDate = new Date(
            year,
            month - 1,
            day,
            reminder.hour,
            reminder.minute,
            0
        );

        if (reminderDate > now) {
            reminderStatus[reminder.date] = 'upcoming';
        } else if (!reminderStatus[reminder.date]) {
            reminderStatus[reminder.date] = 'finished';
        }
    });

    const selectedYear = Number(
        displayedMonth.split('-')[0]
    );

    const years = Array.from(
        { length: 21 },
        (_, index) => currentYear - 10 + index
    );

    console.log(displayedMonth, 'month');

    return (
        <View className="flex-1 bg-black pt-12">

            {/* Year Button */}
            <View className="items-center mb-4">
                <Pressable
                    onPress={() =>
                        setYearModalVisible(true)
                    }
                    className="flex-row items-center bg-white/10 px-4 py-2 rounded-full"
                >
                    <Text className="text-white font-bold text-base">
                        {selectedYear}
                    </Text>

                    <ChevronDown
                        size={16}
                        color="white"
                        style={{ marginLeft: 4 }}
                    />
                </Pressable>
            </View>

            {/* Calendar */}
            <View className="w-full">
                <Calendar
                    key={`${displayedMonth}-${calendarKey}`}
                    current={`${displayedMonth}-01`}
                    enableSwipeMonths
                    hideExtraDays={false}
                    onMonthChange={(month) => {
                        setDisplayedMonth(
                            `${month.year}-${String(
                                month.month
                            ).padStart(2, '0')}`
                        );
                    }}
                    onDayPress={handleDayPress}
                    dayComponent={({ date, state }) => {
                        if (!date) {
                            return null;
                        }

                        const isToday =
                            date.dateString === todayKey;

                        const isSelected =
                            date.dateString === selectedDate;

                        const status =
                            reminderStatus[
                                date.dateString
                            ];

                        const isDisabled =
                            state === 'disabled';

                        return (
                            <Pressable
                                onPress={() =>
                                    handleDayPress(date)
                                }
                                style={{
                                    width: 48,
                                    height: 48,
                                    alignItems: 'center',
                                    justifyContent:
                                        'center',
                                }}
                            >
                                <Text
                                    style={{
                                        color:
                                            isToday ||
                                            isSelected
                                                ? '#FFD700'
                                                : isDisabled
                                                    ? '#444444'
                                                    : '#FFFFFF',
                                        fontSize: 16,
                                        fontWeight:
                                            isToday ||
                                            isSelected
                                                ? '700'
                                                : '400',
                                    }}
                                >
                                    {date.day}
                                </Text>

                                {/* Upcoming reminder */}
                                {status === 'upcoming' && (
                                    <Pin
                                        size={12}
                                        color="#EF4444"
                                        fill="#EF4444"
                                        style={{
                                            position:
                                                'absolute',
                                            bottom: 2,
                                        }}
                                    />
                                )}

                                {/* Finished reminder */}
                                {status === 'finished' && (
                                    <View
                                        style={{
                                            position:
                                                'absolute',
                                            bottom: 5,
                                            width: 6,
                                            height: 6,
                                            borderRadius: 3,
                                            backgroundColor:
                                                '#666666',
                                        }}
                                    />
                                )}
                            </Pressable>
                        );
                    }}
                    theme={{
                        backgroundColor: '#000000',
                        calendarBackground: '#000000',
                        textSectionTitleColor: '#FFFFFF',
                        monthTextColor: '#FFFFFF',
                        arrowColor: '#FFFFFF',
                        textDisabledColor: '#444444',
                        textDayHeaderFontWeight: 'bold',
                        textMonthFontWeight: 'bold',
                    }}
                />
            </View>

            {/* Year Modal */}
            <Modal
                visible={yearModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() =>
                    setYearModalVisible(false)
                }
            >
                <View className="flex-1 bg-black/70 justify-center items-center px-8">
                    <View className="bg-neutral-900 rounded-3xl w-full max-h-[60%] p-5">

                        <View className="flex-row justify-between items-center mb-4">
                            <Text className="text-white text-xl font-bold">
                                Select Year
                            </Text>

                            <Pressable
                                onPress={() =>
                                    setYearModalVisible(
                                        false
                                    )
                                }
                            >
                                <X
                                    size={20}
                                    color="white"
                                />
                            </Pressable>
                        </View>

                        <ScrollView>
                            {years.map((year) => (
                                <Pressable
                                    key={year}
                                    onPress={() => {
                                        const month =
                                            displayedMonth.split(
                                                '-'
                                            )[1];

                                        setDisplayedMonth(
                                            `${year}-${month}`
                                        );

                                        setCalendarKey(
                                            (prev) => prev + 1
                                        );

                                        setYearModalVisible(
                                            false
                                        );
                                    }}
                                    className="py-4 items-center"
                                >
                                    <Text
                                        className={
                                            year ===
                                            selectedYear
                                                ? 'text-yellow-400 text-lg font-bold'
                                                : 'text-white text-lg'
                                        }
                                    >
                                        {year}
                                    </Text>
                                </Pressable>
                            ))}
                        </ScrollView>

                    </View>
                </View>
            </Modal>

            {/* Reminder Modal */}
            <Modal
                visible={reminderModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() =>
                    setReminderModalVisible(false)
                }
            >
                <View className="flex-1 bg-black/70 justify-center items-center px-6">
                    <View className="bg-neutral-900 rounded-3xl w-full max-h-[70%] p-6">

                        <View className="flex-row justify-between items-center mb-5">
                            <Text className="text-white text-xl font-bold">
                                Reminders
                            </Text>

                            <Pressable
                                onPress={() =>
                                    setReminderModalVisible(
                                        false
                                    )
                                }
                            >
                                <X
                                    size={20}
                                    color="white"
                                />
                            </Pressable>
                        </View>

                        <ScrollView>
                            {selectedDate &&
                                remindersForDate(
                                    selectedDate
                                ).map((reminder) => (
                                    <View
                                        key={reminder.id}
                                        className="bg-white/10 rounded-2xl p-4 mb-3"
                                    >
                                        <Text className="text-white text-base font-semibold">
                                            {reminder.note}
                                        </Text>

                                        <Text className="text-white/60 mt-2">
                                            {reminder.hour
                                                .toString()
                                                .padStart(
                                                    2,
                                                    '0'
                                                )}
                                            :
                                            {reminder.minute
                                                .toString()
                                                .padStart(
                                                    2,
                                                    '0'
                                                )}
                                        </Text>
                                    </View>
                                ))}
                        </ScrollView>

                    </View>
                </View>
            </Modal>

        </View>
    );
};