
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Wand2, Loader2 } from "lucide-react";
import { analyzeConcern } from '@/ai/flows/analyze-concern';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { User } from '@/contexts/auth-provider';


// Placeholder data to replace removed mock data file
const users: Partial<User>[] = [
    { id: '1', name: 'Alice Johnson', role: 'Chairperson', avatar: 'https://placehold.co/100x100.png?text=A' },
    { id: '2', name: 'Bob Williams', role: 'Member', avatar: 'https://placehold.co/100x100.png?text=B' },
    { id: '3', name: 'Charlie Brown', role: 'Member', avatar: 'https://placehold.co/100x100.png?text=C' },
];

export interface Concern {
  id: number;
  title: string;
  description: string;
  userId: string;
  status: 'New' | 'In Progress' | 'Resolved';
  submittedAt: string;
}

const initialConcerns: Concern[] = [
    {
        id: 1,
        title: 'Meeting Schedule Conflict',
        description: 'The upcoming quarterly meeting is scheduled on a public holiday, which might reduce attendance. Suggest we find an alternative date.',
        userId: '2',
        status: 'New',
        submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    },
    {
        id: 2,
        title: 'Need for More Outreach Materials',
        description: 'Our recent community event was a success, but we ran out of flyers and brochures. We need to restock and perhaps design new materials for the next event.',
        userId: '3',
        status: 'In Progress',
        submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    },
];

type ConcernWithAnalysis = Concern & {
  analysis?: string;
  isAnalyzing?: boolean;
};

export default function ConcernsPage() {
  const [concerns, setConcerns] = React.useState<ConcernWithAnalysis[]>(initialConcerns.map(c => ({...c, isAnalyzing: false})));
  const { toast } = useToast();

  const handleAnalyze = async (concernId: number) => {
    const concern = concerns.find(c => c.id === concernId);
    if (!concern) return;

    // Set loading state for this specific concern
    setConcerns(prev => prev.map(c => c.id === concernId ? { ...c, isAnalyzing: true, analysis: undefined } : c));

    try {
      const result = await analyzeConcern({
        title: concern.title,
        description: concern.description,
      });
      
      setConcerns(prev => prev.map(c => c.id === concernId ? { ...c, analysis: result.suggestedSteps } : c));
      
      toast({
        title: 'Analysis Complete',
        description: 'Suggested action steps have been generated.',
      });

    } catch (error) {
      console.error('Analysis failed:', error);
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: 'There was an error generating suggestions.',
      });
    } finally {
       setConcerns(prev => prev.map(c => c.id === concernId ? { ...c, isAnalyzing: false } : c));
    }
  };

  const getStatusVariant = (status: Concern['status']): "default" | "secondary" | "outline" => {
    switch (status) {
      case 'New':
        return 'default';
      case 'In Progress':
        return 'secondary';
      case 'Resolved':
        return 'outline';
      default:
        return 'outline';
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Concerns Center</h1>
        <p className="text-muted-foreground">Address and track all raised concerns.</p>
      </div>

      <div className="space-y-4">
        <Accordion type="multiple" className="space-y-4">
          {concerns.map((concern) => {
            const user = users.find(u => u.id === concern.userId);
            return (
              <AccordionItem value={`concern-${concern.id}`} key={concern.id} className="border-none">
                <Card className="rounded-2xl shadow-sm overflow-hidden">
                  <AccordionTrigger className="p-6 hover:no-underline">
                      <div className="flex-1 text-left">
                        <div className="flex items-center justify-between">
                           <Badge variant={getStatusVariant(concern.status)}>{concern.status}</Badge>
                           <p className="text-sm text-muted-foreground">{formatDistanceToNow(new Date(concern.submittedAt), { addSuffix: true })}</p>
                        </div>
                        <h2 className="text-xl font-semibold mt-2">{concern.title}</h2>
                      </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <div className="prose prose-sm dark:prose-invert max-w-none mb-4">
                        <p>{concern.description}</p>
                    </div>
                    {concern.analysis && (
                        <div className="prose prose-sm dark:prose-invert max-w-none p-4 bg-muted rounded-lg border my-4">
                            <h3 className="font-semibold text-primary">Suggested Action Steps:</h3>
                            <p>{concern.analysis}</p>
                        </div>
                    )}
                  </AccordionContent>
                   <CardFooter className="bg-muted/50 px-6 py-3 flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user?.avatar} />
                          <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-sm font-medium">{user?.name}</p>
                            <p className="text-xs text-muted-foreground">{user?.role}</p>
                        </div>
                     </div>
                     <Button size="sm" onClick={() => handleAnalyze(concern.id)} disabled={concern.isAnalyzing}>
                       {concern.isAnalyzing ? (
                         <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...</>
                       ) : (
                         <><Wand2 className="mr-2 h-4 w-4" /> Analyze with AI</>
                       )}
                     </Button>
                   </CardFooter>
                </Card>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </div>
  );
}

    