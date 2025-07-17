'use server';
/**
 * @fileOverview A Genkit flow for auto-generating meeting minutes from a transcript or recording.
 *
 * - summarizeMeetingMinutes - A function that handles the meeting minutes summarization process.
 * - SummarizeMeetingMinutesInput - The input type for the summarizeMeetingMinutes function.
 * - SummarizeMeetingMinutesOutput - The return type for the summarizeMeetingMinutes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeMeetingMinutesInputSchema = z.object({
  transcript: z
    .string()
    .describe('The transcript or recording of the meeting.'),
  chatHistory: z.string().describe('The chat history of the meeting.'),
  recentConcerns: z.string().describe('Recent concerns raised by members.'),
});
export type SummarizeMeetingMinutesInput = z.infer<
  typeof SummarizeMeetingMinutesInputSchema
>;

const SummarizeMeetingMinutesOutputSchema = z.object({
  minutes: z.string().describe('The summarized meeting minutes.'),
});
export type SummarizeMeetingMinutesOutput = z.infer<
  typeof SummarizeMeetingMinutesOutputSchema
>;

export async function summarizeMeetingMinutes(
  input: SummarizeMeetingMinutesInput
): Promise<SummarizeMeetingMinutesOutput> {
  return summarizeMeetingMinutesFlow(input);
}

const summarizeMeetingMinutesPrompt = ai.definePrompt({
  name: 'summarizeMeetingMinutesPrompt',
  input: {schema: SummarizeMeetingMinutesInputSchema},
  output: {schema: SummarizeMeetingMinutesOutputSchema},
  prompt: `You are an AI assistant helping a secretary generate meeting minutes.

  Based on the meeting transcript, chat history, and recent concerns, create a summary of the meeting minutes.
  Include key decisions, action items, and relevant talking points.
  Try to focus on what was actually discussed, but also include any relevant concerns and action items.

  Meeting Transcript: {{{transcript}}}
  Chat History: {{{chatHistory}}}
  Recent Concerns: {{{recentConcerns}}}
  `,
});

const summarizeMeetingMinutesFlow = ai.defineFlow(
  {
    name: 'summarizeMeetingMinutesFlow',
    inputSchema: SummarizeMeetingMinutesInputSchema,
    outputSchema: SummarizeMeetingMinutesOutputSchema,
  },
  async input => {
    const {output} = await summarizeMeetingMinutesPrompt(input);
    return output!;
  }
);
