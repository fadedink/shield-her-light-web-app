import { LoginForm } from '@/components/login-form';
import Image from 'next/image';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{backgroundImage: "url('https://placehold.co/1200x800.png')"}} data-ai-hint="abstract gradient"></div>
       <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background"></div>
      <div className="relative z-10 w-full max-w-md p-6 sm:p-8">
        <div className="flex flex-col items-center mb-8">
          <Image src="/logo.png" alt="Shield Her Light Logo" width={64} height={64} className="mb-4" />
          <h1 className="text-3xl font-bold font-headline text-center">Shield Her Light</h1>
          <p className="text-muted-foreground text-center mt-2">Leadership & Membership Management</p>
        </div>
        <LoginForm />
        <p className="px-8 text-center text-sm text-muted-foreground mt-8">
            Don't have an account?{' '}
            <Link href="/signup" className="underline underline-offset-4 hover:text-primary">
                Sign Up
            </Link>
        </p>
      </div>
    </div>
  );
}
