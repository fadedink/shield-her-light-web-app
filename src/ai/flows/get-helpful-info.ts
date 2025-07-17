'use server';

/**
 * @fileOverview An AI assistant for the Shield Her Light organization.
 *
 * - getHelpfulInfo - A function that provides helpful information and support.
 * - GetHelpfulInfoInput - The input type for the getHelpfulInfo function.
 * - GetHelpfulInfoOutput - The return type for the getHelpfulInfo function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetHelpfulInfoInputSchema = z.object({
  query: z.string().describe('The user\'s question or request for help.'),
});
export type GetHelpfulInfoInput = z.infer<typeof GetHelpfulInfoInputSchema>;

const GetHelpfulInfoOutputSchema = z.object({
  response: z.string().describe('The helpful response from the AI assistant.'),
});
export type GetHelpfulInfoOutput = z.infer<typeof GetHelpfulInfoOutputSchema>;

export async function getHelpfulInfo(input: GetHelpfulInfoInput): Promise<GetHelpfulInfoOutput> {
  return getHelpfulInfoFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getHelpfulInfoPrompt',
  input: {schema: GetHelpfulInfoInputSchema},
  output: {schema: GetHelpfulInfoOutputSchema},
  prompt: `You are a caring, empathetic, and knowledgeable AI assistant for "Shield Her Light," an organization dedicated to fighting Gender-Based Violence (GBV). Your primary role is to provide helpful information, support, and resources to members.

Your tone should always be supportive, understanding, and non-judgmental.

When a user asks a question, provide a clear, helpful, and safe response. You can provide general information about GBV, suggest ways to find help, and offer words of encouragement.

DO NOT provide medical or legal advice. Instead, strongly recommend consulting with a qualified professional (e.g., a doctor, lawyer, or therapist).

User's query: {{{query}}}

Based on this query, provide a supportive and informative response.`,
  config: {
    safetySettings: [
        {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_NONE',
        },
        {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_NONE',
        },
         {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_NONE',
        },
         {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_NONE',
        },
    ]
  }
});

const getHelpfulInfoFlow = ai.defineFlow(
  {
    name: 'getHelpfulInfoFlow',
    inputSchema: GetHelpfulInfoInputSchema,
    outputSchema: GetHelpfulInfoOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
