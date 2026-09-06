import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export async function requestNotificationPermission() {
    const { status } = await Notifications.requestPermissionsAsync();

    return status === 'granted';
}

interface ScheduleReminderParams {
    note: string;
    date: string;
    hour: number;
    minute: number;
    reminderOffset: number;
}

export async function scheduleReminderNotifications({
    note,
    date,
    hour,
    minute,
    reminderOffset,
}: ScheduleReminderParams) {
    const [year, month, day] = date.split('-').map(Number);

    // Reminder time in the device's local timezone
    const reminderDate = new Date(
        year,
        month - 1,
        day,
        hour,
        minute,
        0,
        0
    );

    const now = new Date();

    // The actual reminder time must still be in the future
    if (reminderDate <= now) {
        throw new Error('The reminder time has already passed.');
    }

    // Calculate the optional "X minutes before" notification
    const beforeDate = new Date(
        reminderDate.getTime() - reminderOffset * 60 * 1000
    );

    let beforeNotificationId: string | null = null;

    // Only schedule the early notification if its time is still in the future
    if (beforeDate > now) {
        beforeNotificationId =
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: `Reminder in ${reminderOffset} minutes`,
                    body: note || 'You have an upcoming reminder.',
                    sound: 'default',
                    data: {
                        type: 'reminder-before',
                    },
                },
                trigger: {
                    type: Notifications.SchedulableTriggerInputTypes.DATE,
                    date: beforeDate,
                },
            });
    }

    // Always schedule the actual reminder
    const reminderNotificationId =
        await Notifications.scheduleNotificationAsync({
            content: {
                title: 'Reminder',
                body: note || 'You have a reminder.',
                sound: 'default',
                data: {
                    type: 'reminder',
                },
            },
            trigger: {
                type: Notifications.SchedulableTriggerInputTypes.DATE,
                date: reminderDate,
            },
        });

    return {
        beforeNotificationId,
        reminderNotificationId,
    };
}