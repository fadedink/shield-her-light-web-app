'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/auth-provider';
import { cn } from '@/lib/utils';
import {
  Shield,
  LayoutDashboard,
  MessageSquare,
  UsersRound,
  NotebookText,
  BookMarked,
  ShieldAlert,
} from 'lucide-react';
import { Button } from './ui/button';
import { UserNav } from './user-nav';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Textarea } from './ui/textarea';
import Image from 'next/image';


const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/chat', icon: MessageSquare, label: 'Chat' },
  { href: '/dashboard/members', icon: UsersRound, label: 'Members' },
  { href: '/dashboard/meetings', icon: NotebookText, label: 'Meetings' },
  { href: '/dashboard/lessons', icon: BookMarked, label: 'Lessons' },
  { href: '/dashboard/concerns', icon: ShieldAlert, label: 'Concerns' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  if (!user) return null;

  return (
    <aside className="fixed left-0 top-0 h-full w-64 border-r bg-card flex flex-col shadow-lg">
      <div className="flex h-16 items-center gap-3 border-b px-6">
        <Image src="/logo.png" alt="Shield Her Light Logo" width={32} height={32} />
        <h1 className="text-lg font-bold font-headline">ShieldHerLight</h1>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted',
              pathname === item.href && 'bg-primary/10 text-primary font-semibold'
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="p-4 space-y-4">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="w-full">
              <ShieldAlert className="mr-2 h-4 w-4"/> Raise a Concern
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Raise a Concern</AlertDialogTitle>
              <AlertDialogDescription>
                Please describe your concern in detail. It will be submitted to the leadership for review.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <Textarea placeholder="Type your concern here." className="min-h-[120px]"/>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Submit Concern</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <UserNav />
      </div>
    </aside>
  );
}
