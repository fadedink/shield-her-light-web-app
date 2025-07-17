'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { summarizeMeetingMinutes } from '@/ai/flows/summarize-meeting-minutes';
import { suggestTalkingPoints } from '@/ai/flows/suggest-talking-points';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Wand2, Lightbulb } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function MeetingsPage() {
  const [transcript, setTranscript] = React.useState('');
  const [minutes, setMinutes] = React.useState('');
  const [talkingPoints, setTalkingPoints] = React.useState('');
  const [isSummarizing, setIsSummarizing] = React.useState(false);
  const [isSuggesting, setIsSuggesting] = React.useState(false);
  const { toast } = useToast();

  const handleSummarize = async () => {
    if (!transcript.trim()) {
      toast({
        variant: 'destructive',
        title: 'Transcript is empty',
        description: 'Please paste the meeting transcript before summarizing.',
      });
      return;
    }
    setIsSummarizing(true);
    setMinutes('');
    try {
      const result = await summarizeMeetingMinutes({
        transcript,
        chatHistory: 'No recent chat history available for this mock-up.',
        recentConcerns: 'No recent concerns available for this mock-up.',
      });
      setMinutes(result.minutes);
      toast({
        title: 'Success!',
        description: 'Meeting minutes have been summarized.',
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Summarization Failed',
        description: 'An error occurred while using the AI assistant.',
      });
    } finally {
      setIsSummarizing(false);
    }
  };
  
  const handleSuggest = async () => {
    setIsSuggesting(true);
    setTalkingPoints('');
     try {
      const result = await suggestTalkingPoints({
        chatActivity: 'Members are discussing the upcoming Leadership Summit. The PRO is asking for promotional materials. The Treasurer is finalizing the budget.',
        recentConcerns: 'A member raised a concern about the event schedule conflicting with a local holiday.',
      });
      setTalkingPoints(result.talkingPoints);
      toast({
        title: 'Success!',
        description: 'Talking points have been suggested.',
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Suggestion Failed',
        description: 'An error occurred while using the AI assistant.',
      });
    } finally {
      setIsSuggesting(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Meeting Assistant</h1>
        <p className="text-muted-foreground">Use AI to streamline your meeting workflow.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Wand2 className="text-primary"/> Auto-Format Meeting Minutes</CardTitle>
            <CardDescription>Paste the transcript of your meeting below and let AI generate the minutes for you.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Paste your meeting transcript here..."
              className="min-h-[200px]"
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              disabled={isSummarizing}
            />
            <Button onClick={handleSummarize} disabled={isSummarizing || !transcript.trim()} className="w-full">
              {isSummarizing ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Summarizing...</>
              ) : (
                'Summarize with AI'
              )}
            </Button>
            {minutes && (
              <>
                <Separator />
                <div className="prose prose-sm dark:prose-invert max-w-none p-4 bg-muted rounded-lg border">
                  <h3 className="font-semibold">Generated Minutes:</h3>
                  <p>{minutes}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Lightbulb className="text-primary"/> Suggest Talking Points</CardTitle>
            <CardDescription>Generate relevant talking points for the next meeting based on recent activity and concerns.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground border">
              <p>AI will analyze recent chat activity and raised concerns to suggest relevant topics for your next meeting agenda.</p>
            </div>
             <Button onClick={handleSuggest} disabled={isSuggesting} className="w-full">
              {isSuggesting ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</>
              ) : (
                'Suggest Talking Points'
              )}
            </Button>
            {talkingPoints && (
              <>
                <Separator />
                <div className="prose prose-sm dark:prose-invert max-w-none p-4 bg-muted rounded-lg border">
                  <h3 className="font-semibold">Suggested Points:</h3>
                  <p>{talkingPoints}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
