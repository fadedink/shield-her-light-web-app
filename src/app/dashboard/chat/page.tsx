
'use client';

import * as React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Send, Phone, Video, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth, User } from '@/contexts/auth-provider';

// Placeholder data, will be replaced by Firestore data later
const placeholderUsers: Omit<User, 'id' | 'email'| 'role'>[] = [
    { name: 'Chairperson', avatar: 'https://placehold.co/100x100.png?text=C' },
    { name: 'Secretary', avatar: 'https://placehold.co/100x100.png?text=S' },
    { name: 'Member 1', avatar: 'https://placehold.co/100x100.png?text=M1' },
    { name: 'Member 2', avatar: 'https://placehold.co/100x100.png?text=M2' },
];

const placeholderChats = [
  {
    id: 1,
    name: 'Leadership Team',
    avatar: 'https://placehold.co/100x100.png?text=LT',
    messages: [
      { userId: 0, text: "Good morning team, let's review the agenda for this week's meeting.", time: '10:00 AM' },
      { userId: 1, text: 'Sounds good. I have the minutes from last week ready.', time: '10:01 AM' },
      { userId: 2, text: "I'll be joining a few minutes late.", time: '10:02 AM' },
      { userId: 0, text: "Thanks for the update. We'll start with the budget review.", time: '10:03 AM' },
    ],
  },
  {
    id: 2,
    name: 'Community Outreach',
    avatar: 'https://placehold.co/100x100.png?text=CO',
    messages: [
      { userId: 3, text: "The flyers for the event are ready!", time: 'Yesterday' },
      { userId: 1, text: "Great! Let's coordinate distribution.", time: 'Yesterday' },
    ],
  }
];


export default function ChatPage() {
  const { user: currentUser } = useAuth();
  const activeChat = placeholderChats[0];

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
       <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Chat</h1>
        <p className="text-muted-foreground">Communicate with leaders and members.</p>
      </div>
      <Card className="mt-4 flex-1 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-0 rounded-2xl shadow-sm overflow-hidden">
        {/* Chat List */}
        <div className="col-span-1 border-r flex flex-col">
          <div className="p-4">
            <h2 className="text-xl font-semibold">Conversations</h2>
            <div className="relative mt-2">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search chats..." className="pl-8" />
            </div>
          </div>
          <Separator />
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {placeholderChats.map(chat => (
                <div key={chat.id} className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer ${chat.id === activeChat.id ? 'bg-muted' : 'hover:bg-muted/50'}`}>
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={chat.avatar} />
                    <AvatarFallback>{chat.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 truncate">
                    <p className="font-semibold">{chat.name}</p>
                    <p className="text-sm text-muted-foreground truncate">{chat.messages[chat.messages.length - 1].text}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{chat.messages[chat.messages.length - 1].time}</span>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Active Chat */}
        <div className="col-span-1 md:col-span-2 lg:col-span-3 flex flex-col">
          <div className="p-4 border-b flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={activeChat.avatar} />
                  <AvatarFallback>{activeChat.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{activeChat.name}</h3>
                  <p className="text-sm text-muted-foreground">3 Active Members</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                    <Phone className="h-5 w-5"/>
                </Button>
                 <Button variant="ghost" size="icon">
                    <Video className="h-5 w-5"/>
                </Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                         <Button variant="ghost" size="icon">
                            <MoreVertical className="h-5 w-5"/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        <DropdownMenuItem>Customize Chat</DropdownMenuItem>
                        <DropdownMenuItem>Clear History</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
          </div>

          <ScrollArea className="flex-1 p-6 bg-secondary/30">
            <div className="space-y-6">
              {activeChat.messages.map((message, index) => {
                const messageUser = placeholderUsers[message.userId];
                const isCurrentUser = message.userId === 0; // Assuming current user is Chairperson
                return (
                  <div key={index} className={`flex items-end gap-3 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                    {!isCurrentUser && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={messageUser?.avatar} />
                        <AvatarFallback>{messageUser?.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    )}
                    <div>
                      <Card className={`max-w-xs md:max-w-md p-3 rounded-2xl ${isCurrentUser ? 'bg-primary text-primary-foreground' : 'bg-card'}`}>
                         {/* Placeholder for images in chat */}
                         {/* {message.imageUrl && <img src={message.imageUrl} alt="attachment" className="rounded-lg mb-2" data-ai-hint="user uploaded image"/>} */}
                        <p className="text-sm">{message.text}</p>
                      </Card>
                      <p className={`text-xs text-muted-foreground mt-1 ${isCurrentUser ? 'text-right' : 'text-left'}`}>{messageUser?.name.split(' ')[0]} - {message.time}</p>
                    </div>
                     {isCurrentUser && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={currentUser?.avatar} />
                        <AvatarFallback>{currentUser?.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                );
              })}
            </div>
          </ScrollArea>

          <div className="p-4 border-t bg-background">
            <div className="relative">
              <Input placeholder="Type a message..." className="pr-16 rounded-full" />
               <Button size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
