
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Hand,
  PhoneOff,
  Users,
  Smile,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { User } from '@/contexts/auth-provider';

// Placeholder data
const allUsers: Partial<User>[] = [
    { id: '1', name: 'You', role: 'Chairperson', avatar: 'https://placehold.co/100x100.png?text=Y' },
    { id: '2', name: 'Bob Williams', role: 'Secretary', avatar: 'https://placehold.co/100x100.png?text=B' },
    { id: '3', name: 'Charlie Brown', role: 'Member', avatar: 'https://placehold.co/100x100.png?text=C' },
    { id: '4', name: 'Diana Miller', role: 'Member', avatar: 'https://placehold.co/100x100.png?text=D' },
];


type AttendanceStatus = 'Present' | 'Absent' | 'Absent with Apology';

interface Participant extends Partial<User> {
  attendance: AttendanceStatus;
  isHandRaised: boolean;
}

interface Reaction {
  id: number;
  emoji: string;
  x: number;
}

const reactionEmojis = ['👍', '❤️', '😂', '😮', '🎉', '👏'];

export default function LiveMeetingPage() {
  const [isMicOn, setIsMicOn] = React.useState(true);
  const [isCameraOn, setIsCameraOn] = React.useState(false);
  const [isHandRaised, setIsHandRaised] = React.useState(false);
  const [isParticipantsPanelOpen, setIsParticipantsPanelOpen] = React.useState(true);
  const [hasCameraPermission, setHasCameraPermission] = React.useState<boolean | null>(null);
  const [reactions, setReactions] = React.useState<Reaction[]>([]);

  const { toast } = useToast();
  const videoRef = React.useRef<HTMLVideoElement>(null);
  
  const [participants, setParticipants] = React.useState<Participant[]>(
    allUsers.map(user => ({
      ...user,
      // Current user is present by default
      attendance: user.id === '1' ? 'Present' : 'Absent', 
      isHandRaised: false,
    }))
  );

  React.useEffect(() => {
    const getCameraPermission = async () => {
      // Only request permission if user wants to turn on camera
      if (!isCameraOn) {
        if (videoRef.current?.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
        setHasCameraPermission(null); // Reset permission status
        return;
      }
      
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        setIsCameraOn(false); // Turn off camera toggle on failure
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings.',
        });
      }
    };

    getCameraPermission();

    // Cleanup function to stop media stream
    return () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
    }
  }, [isCameraOn, toast]);
  
  const handleAttendanceChange = (userId: string, status: AttendanceStatus) => {
    setParticipants(prev =>
      prev.map(p => (p.id === userId ? { ...p, attendance: status } : p))
    );
  };
  
  const handleReaction = (emoji: string) => {
    const newReaction: Reaction = {
      id: Date.now(),
      emoji,
      x: Math.random() * 80 + 10, // random horizontal position from 10% to 90%
    };
    setReactions(prev => [...prev, newReaction]);
    // Remove the reaction after the animation duration
    setTimeout(() => {
      setReactions(prev => prev.filter(r => r.id !== newReaction.id));
    }, 4000);
  };

  const currentUser = participants.find(p => p.id === '1'); // Assuming user 1 is the current user
  const otherParticipants = participants.filter(p => p.id !== '1' && p.attendance === 'Present');


  return (
    <div className="relative flex h-[calc(100vh-4rem)] bg-card text-card-foreground rounded-2xl shadow-sm overflow-hidden">
      {/* Reactions Overlay */}
      <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
        {reactions.map(r => (
          <div
            key={r.id}
            className="absolute bottom-20 text-4xl animate-float-up"
            style={{ left: `${r.x}%` }}
          >
            {r.emoji}
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="p-4 border-b">
          <h1 className="text-xl font-bold">Leadership Weekly Sync</h1>
        </header>

        {/* Video Grid */}
        <main className="flex-1 p-4 bg-secondary/20 overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {/* Current User */}
                <div className="relative aspect-video bg-card rounded-lg overflow-hidden flex items-center justify-center">
                    <video ref={videoRef} className={cn("w-full h-full object-cover", { 'hidden': !isCameraOn })} autoPlay muted playsInline />
                    {!isCameraOn && (
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                            <Avatar className="h-24 w-24">
                                <AvatarImage src={currentUser?.avatar} />
                                <AvatarFallback>{currentUser?.name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <p className="font-semibold">{currentUser?.name}</p>
                        </div>
                    )}
                    <div className="absolute bottom-2 left-2 bg-black/50 text-white text-sm px-2 py-1 rounded">
                        {currentUser?.name} (You)
                    </div>
                    {isHandRaised && (
                        <div className="absolute top-2 right-2 text-2xl">✋</div>
                    )}
                </div>

                {/* Other Participants */}
                {otherParticipants.map(p => (
                    <div key={p.id} className="relative aspect-video bg-card rounded-lg flex items-center justify-center text-muted-foreground">
                        <div className="flex flex-col items-center gap-2">
                             <Avatar className="h-24 w-24">
                                <AvatarImage src={p.avatar} />
                                <AvatarFallback>{p.name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <p className="font-semibold">{p.name}</p>
                        </div>
                       <div className="absolute bottom-2 left-2 bg-black/50 text-white text-sm px-2 py-1 rounded">
                            {p.name}
                        </div>
                    </div>
                ))}
            </div>
             { hasCameraPermission === false && (
                <Alert variant="destructive" className="mt-4">
                  <AlertTitle>Camera Access Required</AlertTitle>
                  <AlertDescription>
                    Please allow camera access in your browser to use video.
                  </AlertDescription>
                </Alert>
            )}
        </main>

        {/* Control Bar */}
        <footer className="p-4 border-t bg-background/50 flex items-center justify-between z-10">
          <div className="text-sm text-muted-foreground font-medium">
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <Button variant={isMicOn ? 'secondary' : 'destructive'} size="icon" className="rounded-full" onClick={() => setIsMicOn(!isMicOn)}>
              {isMicOn ? <Mic /> : <MicOff />}
            </Button>
            <Button variant={isCameraOn ? 'secondary' : 'destructive'} size="icon" className="rounded-full" onClick={() => setIsCameraOn(!isCameraOn)}>
              {isCameraOn ? <Video /> : <VideoOff />}
            </Button>
            <Separator orientation="vertical" className="h-8 hidden sm:block" />
             <Button variant="secondary" size="icon" className={cn("rounded-full", isHandRaised && "bg-primary/80 text-primary-foreground")} onClick={() => setIsHandRaised(!isHandRaised)}>
              <Hand />
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="secondary" size="icon" className="rounded-full">
                  <Smile />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-2 mb-2">
                <div className="flex gap-2">
                  {reactionEmojis.map(emoji => (
                    <button
                      key={emoji}
                      onClick={() => handleReaction(emoji)}
                      className="text-2xl p-1 rounded-md hover:bg-muted transition-colors"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
             <Separator orientation="vertical" className="h-8 hidden sm:block" />
             <Button variant="secondary" size="icon" className="rounded-full" onClick={() => setIsParticipantsPanelOpen(!isParticipantsPanelOpen)}>
                <Users />
            </Button>
          </div>
          <Button variant="destructive">
            <PhoneOff className="mr-2" />
            End Call
          </Button>
        </footer>
      </div>

      {/* Participants Panel */}
      <aside className={cn("w-80 border-l flex-col", isParticipantsPanelOpen ? "flex" : "hidden")}>
        <CardHeader>
          <CardTitle>Participants ({participants.filter(p => p.attendance === 'Present').length})</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto space-y-4">
            {/* Present */}
            <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">Present</h3>
                {participants.filter(p => p.attendance === 'Present').map(p => (
                    <div key={p.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                           <Avatar className="h-8 w-8">
                                <AvatarImage src={p.avatar} />
                                <AvatarFallback>{p.name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span>{p.name}</span>
                        </div>
                        <Select value={p.attendance} onValueChange={(value: AttendanceStatus) => handleAttendanceChange(p.id!, value)}>
                            <SelectTrigger className="w-auto text-xs h-7 px-2">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Present">Present</SelectItem>
                                <SelectItem value="Absent">Absent</SelectItem>
                                <SelectItem value="Absent with Apology">With Apology</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                ))}
            </div>
            <Separator />
             {/* Absent */}
            <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">Absent</h3>
                {participants.filter(p => p.attendance !== 'Present').map(p => (
                    <div key={p.id} className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                           <Avatar className="h-8 w-8 opacity-60">
                                <AvatarImage src={p.avatar} />
                                <AvatarFallback>{p.name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="text-muted-foreground">{p.name}</span>
                        </div>
                         <Select value={p.attendance} onValueChange={(value: AttendanceStatus) => handleAttendanceChange(p.id!, value)}>
                            <SelectTrigger className="w-auto text-xs h-7 px-2">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Present">Present</SelectItem>
                                <SelectItem value="Absent">Absent</SelectItem>
                                <SelectItem value="Absent with Apology">With Apology</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                ))}
            </div>
        </CardContent>
      </aside>
    </div>
  );
}

    