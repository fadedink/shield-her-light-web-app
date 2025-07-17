
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'Developer' | 'Chairperson' | 'Vice-Chair' | 'Secretary' | 'Vice-Secretary' | 'Treasurer' | 'Public Relations Officer' | 'Welfare Officer' | 'Flame of Fairness Officer' | 'Outreach & Partnership Officer' | 'Member';
  avatar: string;
  password?: string;
}

export const users: User[] = [
  { id: 1, name: 'Aria Montgomery', email: 'chairperson@shieldherlight.com', role: 'Chairperson', avatar: 'https://placehold.co/100x100.png', password: 'password123', },
  { id: 2, name: 'Ben Carter', email: 'vicechair@shieldherlight.com', role: 'Vice-Chair', avatar: 'https://placehold.co/100x100.png', password: 'password123', },
  { id: 3, name: 'Chloe Davis', email: 'secretary@shieldherlight.com', role: 'Secretary', avatar: 'https://placehold.co/100x100.png', password: 'password123', },
  { id: 4, name: 'David Evans', email: 'treasurer@shieldherlight.com', role: 'Treasurer', avatar: 'https://placehold.co/100x100.png', password: 'password123', },
  { id: 5, name: 'Ella Foster', email: 'pro@shieldherlight.com', role: 'Public Relations Officer', avatar: 'https://placehold.co/100x100.png', password: 'password123', },
  { id: 6, name: 'Frank Green', email: 'welfare@shieldherlight.com', role: 'Welfare Officer', avatar: 'https://placehold.co/100x100.png', password: 'password123', },
  { id: 7, name: 'Grace Hill', email: 'flame@shieldherlight.com', role: 'Flame of Fairness Officer', avatar: 'https://placehold.co/100x100.png', password: 'password123', },
  { id: 8, name: 'Henry Irwin', email: 'outreach@shieldherlight.com', role: 'Outreach & Partnership Officer', avatar: 'https://placehold.co/100x100.png', password: 'password123', },
  { id: 9, name: 'Ivy Jones', email: 'member1@shieldherlight.com', role: 'Member', avatar: 'https://placehold.co/100x100.png', password: 'password123', },
  { id: 10, name: 'Jack King', email: 'member2@shieldherlight.com', role: 'Member', avatar: 'https://placehold.co/100x100.png', password: 'password123', },
  { id: 11, name: 'Matthew Legend', email: 'legendmatthew32@gmail.com', role: 'Developer', avatar: 'https://placehold.co/100x100.png', password: '0000', },
  { id: 12, name: 'Ranvit Gitran', email: 'gitranvitran@gmail.com', role: 'Developer', avatar: 'https://placehold.co/100x100.png', password: '0000', },
];

export interface ChatMessage {
  userId: number;
  text: string;
  time: string;
  imageUrl?: string;
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


export interface Concern {
  id: number;
  userId: number;
  title: string;
  description: string;
  status: 'New' | 'In Progress' | 'Resolved';
  submittedAt: string;
}

export const concerns: Concern[] = [
  {
    id: 1,
    userId: 9,
    title: 'Event Schedule Conflict',
    description: 'The upcoming Leadership Summit on July 28th conflicts with a local holiday that many members observe. Could we consider rescheduling?',
    status: 'New',
    submittedAt: '2024-07-18',
  },
  {
    id: 2,
    userId: 6,
    title: 'Mentorship Program Feedback',
    description: 'The new mentorship program is a great initiative, but the matching process seems a bit random. Some pairs are not a good fit. Perhaps we can introduce a preference form.',
    status: 'In Progress',
    submittedAt: '2024-07-15',
  },
  {
    id: 3,
    userId: 10,
    title: 'Resource Library Access',
    description: "I'm having trouble accessing the new articles in the resource library. It keeps giving me a permission error.",
    status: 'Resolved',
    submittedAt: '2024-07-12',
  },
];

export interface Lesson {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  authorId: number;
  createdAt: string;
}

export const lessons: Lesson[] = [
  {
    id: 1,
    title: 'Effective Leadership Communication',
    description: 'Learn the key strategies for clear, concise, and impactful communication. This lesson covers active listening, non-verbal cues, and providing constructive feedback.',
    imageUrl: 'https://placehold.co/600x400.png',
    authorId: 1,
    createdAt: '2024-07-20',
  },
  {
    id: 2,
    title: 'Conflict Resolution Techniques',
    description: 'Discover practical methods for navigating disagreements and finding common ground. This lesson explores negotiation, mediation, and de-escalation strategies.',
    imageUrl: 'https://placehold.co/600x400.png',
    authorId: 7,
    createdAt: '2024-07-18',
  },
  {
    id: 3,
    title: 'Financial Literacy for Leaders',
    description: "An introduction to budgeting, financial planning, and resource management for community organizations. Understand financial statements and make informed decisions.",
    imageUrl: 'https://placehold.co/600x400.png',
    authorId: 4,
    createdAt: '2024-07-15',
  },
];

export interface DiscussionResponse {
  id: number;
  userId: number;
  text: string;
  createdAt: string;
}

export interface DiscussionTopic {
  id: number;
  authorId: number;
  title: string;
  description: string;
  createdAt: string;
  responses: DiscussionResponse[];
}

export const discussions: DiscussionTopic[] = [
  {
    id: 1,
    authorId: 3, // Chloe Davis (Secretary)
    title: 'Brainstorming our next community outreach initiative',
    description: "Let's gather ideas for our next community outreach program. What causes are you passionate about? What kind of impact do you want to make? Share your thoughts!",
    createdAt: '2024-07-21T10:00:00Z',
    responses: [
      {
        id: 1,
        userId: 9, // Ivy Jones
        text: "I think a workshop on digital literacy for seniors in our community would be incredibly valuable.",
        createdAt: '2024-07-21T11:30:00Z',
      },
      {
        id: 2,
        userId: 8, // Henry Irwin (Outreach & Partnership Officer)
        text: "That's a fantastic idea, Ivy! We could partner with the local library. I can look into that.",
        createdAt: '2024-07-21T12:15:00Z',
      }
    ]
  },
  {
    id: 2,
    authorId: 1, // Aria Montgomery (Chairperson)
    title: 'Feedback on the new member onboarding process',
    description: 'For our newer members, how was your onboarding experience? What did we do well, and where can we improve? Your feedback is crucial for helping new members feel welcome and integrated.',
    createdAt: '2024-07-20T09:00:00Z',
    responses: []
  },
];
