'use server';

/**
 * @fileOverview A Genkit flow to suggest talking points for the next meeting based on chat activity and recent concerns.
 *
 * - suggestTalkingPoints - A function that suggests talking points for a meeting.
 * - SuggestTalkingPointsInput - The input type for the suggestTalkingPoints function.
 * - SuggestTalkingPointsOutput - The return type for the suggestTalkingPoints function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestTalkingPointsInputSchema = z.object({
  chatActivity: z
    .string()
    .describe('The recent chat activity from the members and leaders chats.'),
  recentConcerns: z
    .string()
    .describe('The recent concerns raised by members and leaders.'),
});
export type SuggestTalkingPointsInput = z.infer<typeof SuggestTalkingPointsInputSchema>;

const SuggestTalkingPointsOutputSchema = z.object({
  talkingPoints: z
    .string()
    .describe('Suggested talking points for the next meeting.'),
});
export type SuggestTalkingPointsOutput = z.infer<typeof SuggestTalkingPointsOutputSchema>;

export async function suggestTalkingPoints(input: SuggestTalkingPointsInput): Promise<SuggestTalkingPointsOutput> {
  return suggestTalkingPointsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestTalkingPointsPrompt',
  input: {schema: SuggestTalkingPointsInputSchema},
  output: {schema: SuggestTalkingPointsOutputSchema},
  prompt: `You are a helpful assistant to a secretary. Your goal is to suggest talking points for the next meeting based on the recent chat activity and concerns raised.

Recent Chat Activity:
{{chatActivity}}

Recent Concerns:
{{recentConcerns}}

Suggest some relevant and productive talking points for the next meeting. Return them in the "talkingPoints" field. Be concise, but include enough detail to ensure each is meaningful.`,
});

const suggestTalkingPointsFlow = ai.defineFlow(
  {
    name: 'suggestTalkingPointsFlow',
    inputSchema: SuggestTalkingPointsInputSchema,
    outputSchema: SuggestTalkingPointsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
