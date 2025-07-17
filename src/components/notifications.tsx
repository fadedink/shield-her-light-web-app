'use client';

import * as React from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { notifications as initialNotifications, Notification } from '@/lib/data';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

export function Notifications() {
  const [notifications, setNotifications] = React.useState<Notification[]>(initialNotifications);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between border-b p-4">
          <h3 className="font-semibold">Notifications</h3>
          <Button variant="ghost" size="sm" onClick={handleMarkAllRead} disabled={unreadCount === 0}>
             <CheckCheck className="mr-2 h-4 w-4" />
             Mark all read
          </Button>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.map(notification => (
              <div key={notification.id} className={cn("flex items-start gap-4 p-4 border-b", !notification.read && "bg-primary/5")}>
                 <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-secondary">
                    <notification.icon className="h-5 w-5 text-secondary-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{notification.title}</p>
                  <p className="text-sm text-muted-foreground">{notification.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="p-8 text-center text-sm text-muted-foreground">No new notifications.</p>
          )}
        </div>
        <div className="border-t p-2 text-center">
            <Button variant="link" size="sm" className="w-full">
                View all notifications
            </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
