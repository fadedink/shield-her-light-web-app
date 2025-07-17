'use client';

import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-provider';
import { Sidebar } from '@/components/sidebar';
import { Loader2 } from 'lucide-react';
import { UserNav } from '@/components/user-nav';
import { Notifications } from '@/components/notifications';

const getPageTitle = (path: string): string => {
  const segment = path.split('/').pop() || 'dashboard';
  if (segment === 'dashboard') return 'Dashboard';
   if (segment === 'live') return 'Live Meeting';
  return segment.charAt(0).toUpperCase() + segment.slice(1);
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const pageTitle = getPageTitle(pathname);

  React.useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/80 px-4 shadow-sm backdrop-blur-md sm:px-6 lg:px-8">
           <h1 className="text-xl font-semibold">{pageTitle}</h1>
           <div className="flex items-center gap-4">
            <Notifications />
            <UserNav />
           </div>
        </header>
        <main className="flex-1">
          <div className="p-4 sm:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
