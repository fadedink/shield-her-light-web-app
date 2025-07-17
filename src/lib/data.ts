// This file is no longer needed for primary data storage,
// as we are now using Firebase.
// It can be kept for type definitions that are shared across the app,
// or for small, non-dynamic data sets.

import { Icon, Vote, BookMarked, Bell } from "lucide-react";

// Notification type can remain here as it's primarily a client-side concern
export interface Notification {
    id: number;
    title: string;
    description: string;
    createdAt: string;
    read: boolean;
    icon: Icon;
}

// Sample data can be useful for UI development or as a fallback
export const notifications: Notification[] = [
    {
        id: 1,
        title: 'New Election Started',
        description: 'The "Annual Leadership Election" has been begun. Applications are now open.',
        createdAt: new Date().toISOString(),
        read: false,
        icon: Vote,
    },
    {
        id: 2,
        title: 'New Lesson Available',
        description: '"Conflict Resolution Techniques" has been added to the lessons library.',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        read: false,
        icon: BookMarked,
    },
];

    