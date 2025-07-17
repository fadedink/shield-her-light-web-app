export interface User {
  id: number;
  name: string;
  email: string;
  role: 'Chairperson' | 'Vice-Chair' | 'Secretary' | 'Treasurer' | 'PRO' | 'Welfare Officer' | 'Flame of Fairness' | 'Outreach Officer' | 'Member' | 'Developer';
  avatar: string;
  password?: string;
}

export const users: User[] = [
  { id: 1, name: 'Aria Montgomery', email: 'chairperson@shieldherlight.com', role: 'Chairperson', avatar: 'https://placehold.co/100x100.png', password: 'password123', },
  { id: 2, name: 'Ben Carter', email: 'vicechair@shieldherlight.com', role: 'Vice-Chair', avatar: 'https://placehold.co/100x100.png', password: 'password123', },
  { id: 3, name: 'Chloe Davis', email: 'secretary@shieldherlight.com', role: 'Secretary', avatar: 'https://placehold.co/100x100.png', password: 'password123', },
  { id: 4, name: 'David Evans', email: 'treasurer@shieldherlight.com', role: 'Treasurer', avatar: 'https://placehold.co/100x100.png', password: 'password123', },
  { id: 5, name: 'Ella Foster', email: 'pro@shieldherlight.com', role: 'PRO', avatar: 'https://placehold.co/100x100.png', password: 'password123', },
  { id: 6, name: 'Frank Green', email: 'welfare@shieldherlight.com', role: 'Welfare Officer', avatar: 'https://placehold.co/100x100.png', password: 'password123', },
  { id: 7, name: 'Grace Hill', email: 'flame@shieldherlight.com', role: 'Flame of Fairness', avatar: 'https://placehold.co/100x100.png', password: 'password123', },
  { id: 8, name: 'Henry Irwin', email: 'outreach@shieldherlight.com', role: 'Outreach Officer', avatar: 'https://placehold.co/100x100.png', password: 'password123', },
  { id: 9, name: 'Ivy Jones', email: 'member1@shieldherlight.com', role: 'Member', avatar: 'https://placehold.co/100x100.png', password: 'password123', },
  { id: 10, name: 'Jack King', email: 'member2@shieldherlight.com', role: 'Member', avatar: 'https://placehold.co/100x100.png', password: 'password123', },
  { id: 11, name: 'Matthew Legend', email: 'legendmatthew32@gmail.com', role: 'Developer', avatar: 'https://placehold.co/100x100.png', password: '0000', },
  { id: 12, name: 'Ranvit Gitran', email: 'gitranvitran@gmail.com', role: 'Developer', avatar: 'https://placehold.co/100x100.png', password: '0000', },
];

export interface ChatMessage {
  userId: number;
  text: string;
  time: string;
}

export interface Chat {
  id: string;
  name: string;
  avatar: string;
  messages: ChatMessage[];
}

export const chats: Chat[] = [
    {
        id: 'chat-1',
        name: 'Leaders Chat',
        avatar: 'https://placehold.co/100x100.png',
        messages: [
            { userId: 1, text: "Good morning, everyone. Let's get an update on the upcoming summit.", time: '10:30 AM' },
            { userId: 4, text: "The budget is approved and funds are ready for allocation.", time: '10:32 AM' },
            { userId: 5, text: "I'll have the promotional materials ready by EOD.", time: '10:33 AM' },
            { userId: 1, text: "Excellent. Let's keep the momentum going.", time: '10:35 AM' },
        ],
    },
    {
        id: 'chat-2',
        name: 'Members Chat',
        avatar: 'https://placehold.co/100x100.png',
        messages: [
            { userId: 9, text: "Is there a sign-up sheet for the community outreach event?", time: '09:15 AM' },
            { userId: 8, text: "Yes, I'll post the link shortly! We'd love to have you.", time: '09:16 AM' },
            { userId: 10, text: "I can bring snacks!", time: '09:20 AM' },
        ],
    },
     {
        id: 'chat-3',
        name: 'Matthew Legend',
        avatar: 'https://placehold.co/100x100.png',
        messages: [
            { userId: 11, text: "The latest update has been pushed to the web and mobile apps.", time: 'Yesterday' },
            { userId: 1, text: "Great work, Matthew. I'll review it now.", time: 'Yesterday' },
        ],
    }
];
