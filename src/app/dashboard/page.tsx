
'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Users, ShieldAlert, BookOpen, Plus, Camera } from "lucide-react"
import { users, statuses, Status } from "@/lib/data"
import { cn } from "@/lib/utils"
import { useAuth } from '@/contexts/auth-provider';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button';
import Image from 'next/image';

const StatusViewer = ({ statuses, startIndex, onClose }: { statuses: Status[], startIndex: number, onClose: () => void }) => {
    const [currentIndex, setCurrentIndex] = React.useState(startIndex);
    const author = users.find(u => u.id === statuses[currentIndex].authorId);
    
    React.useEffect(() => {
        const timer = setTimeout(() => {
            if (currentIndex < statuses.length - 1) {
                setCurrentIndex(currentIndex + 1);
            } else {
                onClose();
            }
        }, 5000); // 5 seconds per status
        
        return () => clearTimeout(timer);
    }, [currentIndex, statuses.length, onClose]);

    return (
        <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="p-0 border-0 max-w-md w-full h-[80vh] bg-black">
                 <div className="absolute top-2 left-2 right-2 flex gap-1 z-10">
                    {statuses.map((_, index) => (
                        <div key={index} className="flex-1 h-1 bg-white/30 rounded-full">
                            <div className={cn("h-full bg-white rounded-full", index < currentIndex && "w-full", index === currentIndex && "animate-progress-bar")} style={{ animationDuration: '5s' }}></div>
                        </div>
                    ))}
                </div>
                 <div className="absolute top-6 left-4 z-10 flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={author?.avatar} />
                        <AvatarFallback>{author?.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <p className="text-white font-semibold text-sm">{author?.name}</p>
                </div>
                <Image src={statuses[currentIndex].imageUrl} layout="fill" objectFit="contain" alt="Status" />
            </DialogContent>
        </Dialog>
    );
};


export default function DashboardPage() {
  const recentMembers = users.slice(0, 5);
  const { user } = useAuth();
  const [viewingStatus, setViewingStatus] = React.useState<number | null>(null);

  const cardClass = "rounded-2xl shadow-sm border-border/20 animate-fade-in-up";

  return (
    <div className="flex flex-col gap-8">
        {viewingStatus !== null && (
            <StatusViewer statuses={statuses} startIndex={viewingStatus} onClose={() => setViewingStatus(null)} />
        )}
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user?.name.split(' ')[0]}! Here's a summary of your organization.</p>
      </div>

       {/* Statuses Section */}
      <Card className={cn(cardClass)}>
        <CardContent className="p-4">
            <div className="flex items-center gap-4">
                <Dialog>
                    <DialogTrigger asChild>
                         <div className="flex-shrink-0 flex flex-col items-center gap-1 cursor-pointer group">
                            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center border-2 border-dashed group-hover:border-primary transition-colors">
                                <Plus className="h-6 w-6 text-muted-foreground group-hover:text-primary"/>
                            </div>
                            <p className="text-xs font-medium">Add Status</p>
                        </div>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add to your status</DialogTitle>
                            <DialogDescription>Your status will be visible for 24 hours.</DialogDescription>
                        </DialogHeader>
                        <div className="flex items-center justify-center h-48 bg-muted rounded-lg border-2 border-dashed">
                             <Button variant="outline"><Camera className="mr-2"/>Upload Photo/Video</Button>
                        </div>
                        <DialogFooter>
                            <Button>Post Status</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
               
                <div className="flex-1 overflow-x-auto flex items-center gap-4 pb-2">
                    {statuses.map((status, index) => {
                         const author = users.find(u => u.id === status.authorId);
                        return (
                             <div key={status.id} className="flex-shrink-0 flex flex-col items-center gap-1 cursor-pointer group" onClick={() => setViewingStatus(index)}>
                                <div className="h-16 w-16 rounded-full p-0.5 bg-gradient-to-tr from-yellow-400 to-purple-600">
                                    <div className="bg-background p-0.5 rounded-full">
                                        <Avatar className="h-full w-full">
                                            <AvatarImage src={author?.avatar} />
                                            <AvatarFallback>{author?.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                    </div>
                                </div>
                                <p className="text-xs font-medium truncate w-16 text-center">{author?.name}</p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </CardContent>
      </Card>


      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className={cn(cardClass)} style={{animationDelay: '0.1s'}}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">+2 since last week</p>
          </CardContent>
        </Card>
        <Card className={cn(cardClass)} style={{animationDelay: '0.2s'}}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Concerns</CardTitle>
            <ShieldAlert className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">+1 since yesterday</p>
          </CardContent>
        </Card>
        <Card className={cn(cardClass)} style={{animationDelay: '0.3s'}}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lessons Completed</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">All members on track</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className={cn(cardClass, "col-span-4")} style={{animationDelay: '0.4s'}}>
          <CardHeader>
            <CardTitle>Recent Members</CardTitle>
            <CardDescription>
              A list of the most recent members who have joined.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Date Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentMembers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{user.role}</Badge>
                    </TableCell>
                    <TableCell className="text-right">2024-05-15</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card className={cn(cardClass, "col-span-3")} style={{animationDelay: '0.5s'}}>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>Plan and prepare for upcoming activities.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                  <div className="bg-muted rounded-lg p-3 flex items-center justify-center">
                      <p className="font-bold text-primary">JUL<br/>28</p>
                  </div>
                  <div>
                      <p className="font-semibold">Leadership Summit</p>
                      <p className="text-sm text-muted-foreground">Online via Zoom</p>
                  </div>
              </div>
              <div className="flex items-center gap-4">
                  <div className="bg-muted rounded-lg p-3 flex items-center justify-center">
                      <p className="font-bold text-primary">AUG<br/>12</p>
                  </div>
                  <div>
                      <p className="font-semibold">Community Outreach</p>
                      <p className="text-sm text-muted-foreground">Downtown Park</p>
                  </div>
              </div>
              <div className="flex items-center gap-4">
                  <div className="bg-muted rounded-lg p-3 flex items-center justify-center">
                      <p className="font-bold text-primary">SEP<br/>05</p>
                  </div>
                  <div>
                      <p className="font-semibold">Quarterly Review Meeting</p>
                      <p className="text-sm text-muted-foreground">HQ Conference Room</p>
                  </div>
              </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
