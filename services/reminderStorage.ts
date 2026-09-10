import AsyncStorage from '@react-native-async-storage/async-storage';

export interface StoredReminder {
    id: string;
    note: string;
    date: string;
    hour: number;
    minute: number;
    reminderOffset: number;
    notificationId: string | null;
    beforeNotificationId: string | null;
}

const REMINDERS_KEY = '@rooster_reminders';

export async function getReminders(): Promise<StoredReminder[]> {
    const data = await AsyncStorage.getItem(REMINDERS_KEY);

    if (!data) {
        return [];
    }

    return JSON.parse(data);
}

export async function saveReminder(
    reminder: StoredReminder
): Promise<void> {
    const reminders = await getReminders();

    reminders.push(reminder);

    await AsyncStorage.setItem(
        REMINDERS_KEY,
        JSON.stringify(reminders)
    );
}