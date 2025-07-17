
'use client';

import * as React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { PlusCircle, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { lessons as initialLessons, Lesson, users } from '@/lib/data';
import { useAuth } from '@/contexts/auth-provider';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';

export default function LessonsPage() {
  const [lessons, setLessons] = React.useState<Lesson[]>(initialLessons);
  const [open, setOpen] = React.useState(false);
  const [newLessonTitle, setNewLessonTitle] = React.useState('');
  const [newLessonDescription, setNewLessonDescription] = React.useState('');
  const [newLessonImage, setNewLessonImage] = React.useState<File | null>(null);
  const [isCreating, setIsCreating] = React.useState(false);

  const { user } = useAuth();
  const { toast } = useToast();

  const handleCreateLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLessonTitle || !newLessonDescription || !user) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Please fill out all fields before creating a lesson.',
      });
      return;
    }

    setIsCreating(true);

    // Simulate async operation like uploading an image and saving data
    setTimeout(() => {
      const newLesson: Lesson = {
        id: lessons.length + 1,
        title: newLessonTitle,
        description: newLessonDescription,
        // In a real app, this URL would come from a file storage service
        imageUrl: newLessonImage ? URL.createObjectURL(newLessonImage) : 'https://placehold.co/600x400.png',
        authorId: user.id,
        createdAt: new Date().toISOString(),
      };

      setLessons(prevLessons => [newLesson, ...prevLessons]);
      
      toast({
        title: 'Lesson Created',
        description: `"${newLesson.title}" has been successfully added.`,
      });
      
      // Reset form and close dialog
      setIsCreating(false);
      setNewLessonTitle('');
      setNewLessonDescription('');
      setNewLessonImage(null);
      setOpen(false);
    }, 1500);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewLessonImage(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">Lessons</h1>
          <p className="text-muted-foreground">Manage and track educational materials.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2" />
              Create Lesson
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleCreateLesson}>
              <DialogHeader>
                <DialogTitle>Create New Lesson</DialogTitle>
                <DialogDescription>
                  Share new educational materials with your members.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Title
                  </Label>
                  <Input
                    id="title"
                    value={newLessonTitle}
                    onChange={(e) => setNewLessonTitle(e.target.value)}
                    className="col-span-3"
                    disabled={isCreating}
                  />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="description" className="text-right pt-2">
                    Notes
                  </Label>
                  <Textarea
                    id="description"
                    value={newLessonDescription}
                    onChange={(e) => setNewLessonDescription(e.target.value)}
                    className="col-span-3 min-h-[100px]"
                    placeholder="Add your notes or description here."
                    disabled={isCreating}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="picture" className="text-right">
                    Image
                  </Label>
                  <Input id="picture" type="file" onChange={handleFileChange} className="col-span-3" accept="image/*" disabled={isCreating} />
                </div>
                 {newLessonImage && (
                    <div className="col-span-full flex justify-center">
                      <Image 
                        src={URL.createObjectURL(newLessonImage)} 
                        alt="Image preview"
                        width={200}
                        height={100}
                        className="rounded-md object-cover"
                      />
                    </div>
                  )}
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isCreating}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isCreating}>
                  {isCreating ? <><Loader2 className="mr-2 animate-spin" /> Creating...</> : 'Create Lesson'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {lessons.map((lesson) => {
           const author = users.find(u => u.id === lesson.authorId);
           return (
              <Card key={lesson.id} className="rounded-2xl shadow-sm overflow-hidden flex flex-col">
                <CardHeader className="p-0">
                  <div className="relative h-48 w-full">
                    <Image
                      src={lesson.imageUrl}
                      alt={lesson.title}
                      layout="fill"
                      objectFit="cover"
                      data-ai-hint="lesson illustration"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-6 flex-1">
                  <CardTitle>{lesson.title}</CardTitle>
                  <CardDescription className="mt-2 line-clamp-3">{lesson.description}</CardDescription>
                </CardContent>
                <CardFooter className="bg-muted/50 px-6 py-4 flex items-center justify-between text-sm text-muted-foreground">
                   <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={author?.avatar} />
                          <AvatarFallback>{author?.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{author?.name}</span>
                   </div>
                  <span>{format(new Date(lesson.createdAt), 'MMM d, yyyy')}</span>
                </CardFooter>
              </Card>
           )
        })}
      </div>
    </div>
  );
}
