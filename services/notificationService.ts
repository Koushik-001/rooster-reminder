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

    if (reminderDate <= now) {
        throw new Error('The reminder time has already passed.');
    }

    const beforeDate = new Date(
        reminderDate.getTime() - reminderOffset * 60 * 1000
    );

    let beforeNotificationId: string | null = null;

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