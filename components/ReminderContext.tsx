import React, { createContext, useContext, useState } from 'react';

interface ReminderContextType {
    refreshKey: number;
    refreshReminders: () => void;
}

const ReminderContext = createContext<ReminderContextType | undefined>(
    undefined
);

export function ReminderProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [refreshKey, setRefreshKey] = useState(0);

    const refreshReminders = () => {
        setRefreshKey((prev) => prev + 1);
    };

    return (
        <ReminderContext.Provider
            value={{ refreshKey, refreshReminders }}
        >
            {children}
        </ReminderContext.Provider>
    );
}

export function useReminders() {
    const context = useContext(ReminderContext);

    if (!context) {
        throw new Error(
            'useReminders must be used inside ReminderProvider'
        );
    }

    return context;
}