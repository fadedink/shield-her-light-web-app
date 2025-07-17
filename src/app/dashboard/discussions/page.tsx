
'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/auth-provider';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquarePlus, Send, MessageCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

// Placeholder data
export interface DiscussionResponse {
  id: number;
  userId: string;
  text: string;
  createdAt: string;
}

export interface DiscussionTopic {
  id: number;
  title: string;
  description: string;
  authorId: string;
  createdAt: string;
  responses: DiscussionResponse[];
}

const users = [
    { id: '1', name: 'Alice Johnson', avatar: 'https://placehold.co/100x100.png?text=A' },
    { id: '2', name: 'Bob Williams', avatar: 'https://placehold.co/100x100.png?text=B' },
];

const initialDiscussions: DiscussionTopic[] = [
    {
        id: 1,
        title: 'Ideas for the Next Community Workshop',
        description: "Let's brainstorm some topics for our next workshop. I was thinking something around digital safety or financial literacy. What are your thoughts?",
        authorId: '1',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
        responses: [
            { id: 101, userId: '2', text: 'Financial literacy is a great idea! Many members have asked for this.', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
        ],
    },
];


export default function DiscussionsPage() {
  const { user } = useAuth();
  const [discussions, setDiscussions] = React.useState<DiscussionTopic[]>(initialDiscussions);
  const [newResponse, setNewResponse] = React.useState<{ [key: number]: string }>({});

  const handleResponseChange = (topicId: number, text: string) => {
    setNewResponse(prev => ({ ...prev, [topicId]: text }));
  };

  const handleAddResponse = (topicId: number) => {
    if (!user || !newResponse[topicId]?.trim()) return;

    const response: DiscussionResponse = {
      id: Date.now(),
      userId: user.id,
      text: newResponse[topicId],
      createdAt: new Date().toISOString(),
    };

    setDiscussions(prev =>
      prev.map(topic =>
        topic.id === topicId
          ? { ...topic, responses: [...topic.responses, response] }
          : topic
      )
    );

    // Clear the input for that topic
    handleResponseChange(topicId, '');
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">Discussions</h1>
          <p className="text-muted-foreground">
            Collaborate on topics and share your feedback.
          </p>
        </div>
        <Button>
          <MessageSquarePlus className="mr-2" />
          Start New Discussion
        </Button>
      </div>

      <Accordion type="multiple" className="space-y-4">
        {discussions.map(topic => {
          const author = users.find(u => u.id === topic.authorId);
          return (
            <AccordionItem value={`topic-${topic.id}`} key={topic.id} className="border-none">
              <Card className="rounded-2xl shadow-sm overflow-hidden">
                <AccordionTrigger className="p-6 hover:no-underline">
                  <div className="flex gap-4 w-full">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={author?.avatar} />
                      <AvatarFallback>{author?.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-left">
                      <h2 className="text-xl font-semibold">{topic.title}</h2>
                      <p className="text-sm text-muted-foreground mt-1">
                        Started by {author?.name} &middot;{' '}
                        {formatDistanceToNow(new Date(topic.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                     <div className="flex items-center gap-2 text-muted-foreground pr-4">
                        <MessageCircle className="h-5 w-5" />
                        <span>{topic.responses.length}</span>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="prose prose-sm dark:prose-invert max-w-none mb-6 pl-16">
                    <p>{topic.description}</p>
                  </div>
                  <Separator className="my-4 ml-16" />
                  <div className="space-y-6 pl-16">
                    {topic.responses.map(response => {
                      const responseUser = users.find(u => u.id === response.userId);
                      return (
                        <div key={response.id} className="flex gap-4">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={responseUser?.avatar} />
                            <AvatarFallback>
                              {responseUser?.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-baseline gap-2">
                              <p className="font-semibold">{responseUser?.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(response.createdAt), {
                                  addSuffix: true,
                                })}
                              </p>
                            </div>
                            <p className="text-sm text-foreground/90 mt-1">{response.text}</p>
                          </div>
                        </div>
                      );
                    })}

                    {/* Response Form */}
                    <div className="flex gap-4 pt-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user?.avatar} />
                        <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 relative">
                        <Textarea
                          placeholder="Share your thoughts..."
                          value={newResponse[topic.id] || ''}
                          onChange={(e) => handleResponseChange(topic.id, e.target.value)}
                          className="pr-12"
                        />
                        <Button
                          size="icon"
                          variant="ghost"
                          className="absolute right-2 top-2 h-8 w-8 text-muted-foreground hover:text-primary"
                          onClick={() => handleAddResponse(topic.id)}
                          disabled={!newResponse[topic.id]?.trim()}
                        >
                          <Send className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </Card>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}

    