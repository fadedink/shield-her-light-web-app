'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-provider';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Sparkles, Loader2, User } from 'lucide-react';
import { getHelpfulInfo } from '@/ai/flows/get-helpful-info';
import { useToast } from '@/hooks/use-toast';

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

export default function AssistantPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const result = await getHelpfulInfo({ query: input });
      const aiMessage: Message = { sender: 'ai', text: result.response };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI assistant error:', error);
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: 'The AI assistant could not respond. Please try again.',
      });
       const errorMessage: Message = { sender: 'ai', text: 'Sorry, I was unable to process that request.' };
       setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">AI Assistant</h1>
        <p className="text-muted-foreground">Your caring companion for information and support.</p>
      </div>

      <Card className="flex-1 flex flex-col h-[calc(100vh-12rem)] rounded-2xl shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border-2 border-primary">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-primary/20">
                    <Sparkles className="h-5 w-5 text-primary" />
                </div>
            </Avatar>
            <div>
                <CardTitle>Shield Her Light Assistant</CardTitle>
                <CardDescription>Ask me anything about GBV or for support.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
            <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
                <div className="space-y-6">
                 <div className="flex items-start gap-4">
                      <Avatar className="h-9 w-9 border">
                        <div className="flex h-full w-full items-center justify-center rounded-full bg-muted">
                            <Sparkles className="h-5 w-5 text-muted-foreground" />
                        </div>
                      </Avatar>
                      <div className="bg-muted text-muted-foreground rounded-lg p-3 max-w-lg">
                        <p className="text-sm">Hello! I'm your AI assistant from Shield Her Light. How can I help you today? You can ask me for information about Gender-Based Violence or for words of support.</p>
                      </div>
                    </div>
                {messages.map((message, index) => (
                    <div key={index} className={`flex items-start gap-4 ${message.sender === 'user' ? 'justify-end' : ''}`}>
                      {message.sender === 'ai' && (
                         <Avatar className="h-9 w-9 border">
                           <div className="flex h-full w-full items-center justify-center rounded-full bg-muted">
                               <Sparkles className="h-5 w-5 text-muted-foreground" />
                           </div>
                         </Avatar>
                      )}
                       <div className={`rounded-lg p-3 max-w-lg ${message.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                         <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                       </div>
                       {message.sender === 'user' && (
                         <Avatar className="h-9 w-9">
                           <AvatarImage src={user?.avatar} />
                           <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
                         </Avatar>
                       )}
                    </div>
                ))}
                {isLoading && (
                    <div className="flex items-start gap-4">
                        <Avatar className="h-9 w-9 border">
                           <div className="flex h-full w-full items-center justify-center rounded-full bg-muted">
                               <Sparkles className="h-5 w-5 text-muted-foreground" />
                           </div>
                        </Avatar>
                        <div className="bg-muted text-muted-foreground rounded-lg p-3 max-w-lg flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <p className="text-sm">Thinking...</p>
                        </div>
                    </div>
                )}
                </div>
            </ScrollArea>
           <form onSubmit={handleSendMessage} className="relative mt-auto">
             <Input
               placeholder="Ask for help or information..."
               value={input}
               onChange={(e) => setInput(e.target.value)}
               disabled={isLoading}
               className="pr-12 rounded-full text-base"
             />
             <Button type="submit" size="icon" className="absolute right-1.5 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full" disabled={isLoading || !input.trim()}>
               <Send className="h-4 w-4" />
             </Button>
           </form>
        </CardContent>
      </Card>
    </div>
  );
}
