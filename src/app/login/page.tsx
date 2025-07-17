import { LoginForm } from '@/components/login-form';
import { Shield } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{backgroundImage: "url('https://placehold.co/1200x800.png')"}} data-ai-hint="abstract purple background"></div>
      <div className="relative z-10 w-full max-w-md p-6 sm:p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-primary text-primary-foreground p-3 rounded-full mb-4">
            <Shield className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold font-headline text-center">Shield Her Light</h1>
          <p className="text-muted-foreground text-center mt-2">Leadership & Membership Management</p>
        </div>
        <LoginForm />
        <p className="px-8 text-center text-sm text-muted-foreground mt-8">
          By clicking continue, you agree to our{' '}
          <a
            href="/terms"
            className="underline underline-offset-4 hover:text-primary"
          >
            Terms of Service
          </a>{' '}
          and{' '}
          <a
            href="/privacy"
            className="underline underline-offset-4 hover:text-primary"
          >
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
}
