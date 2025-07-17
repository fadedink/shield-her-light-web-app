
'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  users,
  stories as initialStories,
  Story,
  StoryComment,
} from '@/lib/data';
import { useAuth } from '@/contexts/auth-provider';
import { formatDistanceToNow } from 'date-fns';
import { ThumbsUp, MessageSquare, Send, Image as ImageIcon, Video as VideoIcon } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export default function StoriesPage() {
  const { user } = useAuth();
  const [stories, setStories] = React.useState<Story[]>(initialStories);
  const [newPostText, setNewPostText] = React.useState('');
  const [newComment, setNewComment] = React.useState<{ [key: number]: string }>({});

  const handlePost = () => {
    if (!newPostText.trim() || !user) return;

    const newStory: Story = {
      id: Date.now(),
      authorId: user.id,
      type: 'text',
      content: newPostText,
      likes: [],
      comments: [],
      createdAt: new Date().toISOString(),
    };

    setStories(prev => [newStory, ...prev]);
    setNewPostText('');
  };
  
  const handleLike = (storyId: number) => {
    if (!user) return;
     setStories(prev => prev.map(story => {
         if (story.id === storyId) {
             const alreadyLiked = story.likes.includes(user.id);
             if (alreadyLiked) {
                 return { ...story, likes: story.likes.filter(id => id !== user.id) };
             } else {
                 return { ...story, likes: [...story.likes, user.id] };
             }
         }
         return story;
     }))
  }

  const handleAddComment = (storyId: number) => {
    if (!user || !newComment[storyId]?.trim()) return;

    const comment: StoryComment = {
      id: Date.now(),
      authorId: user.id,
      text: newComment[storyId],
      createdAt: new Date().toISOString(),
    };

    setStories(prev =>
      prev.map(story =>
        story.id === storyId
          ? { ...story, comments: [...story.comments, comment] }
          : story
      )
    );
     setNewComment(prev => ({...prev, [storyId]: ''}));
  };

  return (
    <div className="flex flex-col gap-8 max-w-3xl mx-auto">
       <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">Stories</h1>
          <p className="text-muted-foreground">
            Share updates and connect with the community.
          </p>
        </div>

        {/* Create Post Card */}
        <Card className="rounded-2xl shadow-sm">
            <CardHeader>
                <div className="flex gap-4">
                     <Avatar>
                        <AvatarImage src={user?.avatar} />
                        <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <Textarea 
                        placeholder={`What's on your mind, ${user?.name.split(' ')[0]}?`}
                        value={newPostText}
                        onChange={(e) => setNewPostText(e.target.value)}
                        className="text-base min-h-[60px]"
                    />
                </div>
            </CardHeader>
            <CardFooter className="flex justify-between">
                <div className="flex gap-2">
                    <Button variant="ghost" size="sm"><ImageIcon className="mr-2"/> Photo</Button>
                    <Button variant="ghost" size="sm"><VideoIcon className="mr-2"/> Video</Button>
                </div>
                <Button onClick={handlePost} disabled={!newPostText.trim()}>Post</Button>
            </CardFooter>
        </Card>

        {/* Stories Feed */}
        <div className="space-y-6">
            {stories.map(story => {
                const author = users.find(u => u.id === story.authorId);
                const isLiked = user ? story.likes.includes(user.id) : false;
                
                return (
                    <Card key={story.id} className="rounded-2xl shadow-sm">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <Avatar>
                                    <AvatarImage src={author?.avatar} />
                                    <AvatarFallback>{author?.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">{author?.name}</p>
                                    <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(story.createdAt), { addSuffix: true })}</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="whitespace-pre-wrap">{story.content}</p>
                            {story.imageUrl && (
                                <div className="mt-4 rounded-lg overflow-hidden border">
                                    <Image src={story.imageUrl} alt="Story image" width={800} height={600} className="w-full h-auto" data-ai-hint="social media image"/>
                                </div>
                            )}
                        </CardContent>
                        <CardFooter className="flex flex-col items-start gap-4">
                            <div className="w-full flex justify-between items-center text-sm text-muted-foreground">
                                <div>{story.likes.length} Likes</div>
                                <div>{story.comments.length} Comments</div>
                            </div>
                            <div className="w-full flex border-t pt-2">
                                <Button variant={isLiked ? "secondary" : "ghost"} className="flex-1" onClick={() => handleLike(story.id)}>
                                    <ThumbsUp className={cn("mr-2", isLiked && "text-primary")}/> Like
                                </Button>
                                <Button variant="ghost" className="flex-1">
                                    <MessageSquare className="mr-2"/> Comment
                                </Button>
                            </div>
                            {/* Comments Section */}
                            <div className="w-full space-y-3">
                                {story.comments.map(comment => {
                                     const commentAuthor = users.find(u => u.id === comment.authorId);
                                     return (
                                        <div key={comment.id} className="flex items-start gap-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={commentAuthor?.avatar} />
                                                <AvatarFallback>{commentAuthor?.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div className="bg-muted p-2.5 rounded-lg flex-1">
                                                 <p className="font-semibold text-sm">{commentAuthor?.name}</p>
                                                <p className="text-sm">{comment.text}</p>
                                            </div>
                                        </div>
                                     )
                                })}
                                <div className="flex items-center gap-3">
                                     <Avatar className="h-8 w-8">
                                        <AvatarImage src={user?.avatar} />
                                        <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="relative flex-1">
                                        <Input 
                                            placeholder="Write a comment..." 
                                            className="pr-10 rounded-full"
                                            value={newComment[story.id] || ''}
                                            onChange={(e) => setNewComment(prev => ({...prev, [story.id]: e.target.value}))}
                                        />
                                        <Button 
                                            size="icon" 
                                            variant="ghost" 
                                            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full"
                                            onClick={() => handleAddComment(story.id)}
                                            disabled={!newComment[story.id]?.trim()}
                                        >
                                            <Send className="h-4 w-4"/>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardFooter>
                    </Card>
                )
            })}
        </div>
    </div>
  );
}

    