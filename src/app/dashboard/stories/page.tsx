
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
import { useAuth, User } from '@/contexts/auth-provider';
import { formatDistanceToNow } from 'date-fns';
import { ThumbsUp, MessageSquare, Send, Image as ImageIcon, Video as VideoIcon, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, orderBy, onSnapshot, doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

export interface StoryComment {
    id: string;
    authorId: string;
    authorName: string;
    authorAvatar: string;
    text: string;
    createdAt: Date;
}

export interface Story {
    id: string;
    authorId: string;
    authorName: string;
    authorAvatar: string;
    type: 'text' | 'image' | 'video';
    content: string;
    imageUrl?: string;
    likes: string[]; // array of user IDs
    comments: StoryComment[];
    createdAt: Date;
}


export default function StoriesPage() {
  const { user } = useAuth();
  const [stories, setStories] = React.useState<Story[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [newPostText, setNewPostText] = React.useState('');
  const [isPosting, setIsPosting] = React.useState(false);
  const [newComment, setNewComment] = React.useState<{ [key: string]: string }>({});

  React.useEffect(() => {
    const q = query(collection(db, "stories"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const storiesData: Story[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        storiesData.push({ 
            id: doc.id, 
            ...data,
            createdAt: data.createdAt.toDate(),
            comments: (data.comments || []).map((c: any) => ({...c, createdAt: c.createdAt.toDate()}))
        } as Story);
      });
      setStories(storiesData);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handlePost = async () => {
    if (!newPostText.trim() || !user) return;
    setIsPosting(true);
    try {
        await addDoc(collection(db, "stories"), {
            authorId: user.id,
            authorName: user.name,
            authorAvatar: user.avatar,
            type: 'text',
            content: newPostText,
            likes: [],
            comments: [],
            createdAt: new Date(),
        });
        setNewPostText('');
    } catch(error) {
        console.error("Error creating post: ", error);
    } finally {
        setIsPosting(false);
    }
  };
  
  const handleLike = async (storyId: string) => {
    if (!user) return;
    const storyRef = doc(db, "stories", storyId);
    const story = stories.find(s => s.id === storyId);
    if (!story) return;

    const alreadyLiked = story.likes.includes(user.id);

    if (alreadyLiked) {
        await updateDoc(storyRef, {
            likes: arrayRemove(user.id)
        });
    } else {
        await updateDoc(storyRef, {
            likes: arrayUnion(user.id)
        });
    }
  }

  const handleAddComment = async (storyId: string) => {
    if (!user || !newComment[storyId]?.trim()) return;

    const comment: Omit<StoryComment, 'id'> = {
      authorId: user.id,
      authorName: user.name,
      authorAvatar: user.avatar,
      text: newComment[storyId],
      createdAt: new Date(),
    };

    const storyRef = doc(db, "stories", storyId);
    await updateDoc(storyRef, {
        comments: arrayUnion(comment)
    });

    setNewComment(prev => ({...prev, [storyId]: ''}));
  };

  if (isLoading) {
      return (
          <div className="flex justify-center items-center h-full">
              <Loader2 className="h-8 w-8 animate-spin"/>
          </div>
      )
  }

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
                        disabled={isPosting}
                    />
                </div>
            </CardHeader>
            <CardFooter className="flex justify-between">
                <div className="flex gap-2">
                    <Button variant="ghost" size="sm" disabled><ImageIcon className="mr-2"/> Photo</Button>
                    <Button variant="ghost" size="sm" disabled><VideoIcon className="mr-2"/> Video</Button>
                </div>
                <Button onClick={handlePost} disabled={!newPostText.trim() || isPosting}>
                    {isPosting && <Loader2 className="animate-spin" />}
                    Post
                </Button>
            </CardFooter>
        </Card>

        {/* Stories Feed */}
        <div className="space-y-6">
            {stories.map(story => {
                const isLiked = user ? story.likes.includes(user.id) : false;
                
                return (
                    <Card key={story.id} className="rounded-2xl shadow-sm">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <Avatar>
                                    <AvatarImage src={story.authorAvatar} />
                                    <AvatarFallback>{story.authorName.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">{story.authorName}</p>
                                    <p className="text-xs text-muted-foreground">{formatDistanceToNow(story.createdAt, { addSuffix: true })}</p>
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
                                {story.comments.map((comment, index) => (
                                     <div key={index} className="flex items-start gap-3">
                                         <Avatar className="h-8 w-8">
                                             <AvatarImage src={comment.authorAvatar} />
                                             <AvatarFallback>{comment.authorName.charAt(0)}</AvatarFallback>
                                         </Avatar>
                                         <div className="bg-muted p-2.5 rounded-lg flex-1">
                                              <p className="font-semibold text-sm">{comment.authorName}</p>
                                             <p className="text-sm">{comment.text}</p>
                                         </div>
                                     </div>
                                  ))}
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
                                            onKeyDown={(e) => { if(e.key === 'Enter') handleAddComment(story.id)}}
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
