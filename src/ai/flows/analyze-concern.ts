'use server';

/**
 * @fileOverview A Genkit flow to analyze a member's concern and suggest action steps.
 *
 * - analyzeConcern - A function that suggests action steps for a given concern.
 * - AnalyzeConcernInput - The input type for the analyzeConcern function.
 * - AnalyzeConcernOutput - The return type for the analyzeConcern function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeConcernInputSchema = z.object({
  title: z.string().describe('The title of the concern.'),
  description: z.string().describe('The detailed description of the concern.'),
});
export type AnalyzeConcernInput = z.infer<typeof AnalyzeConcernInputSchema>;

const AnalyzeConcernOutputSchema = z.object({
  suggestedSteps: z
    .string()
    .describe('A list of suggested, actionable steps to address the concern.'),
});
export type AnalyzeConcernOutput = z.infer<typeof AnalyzeConcernOutputSchema>;

export async function analyzeConcern(input: AnalyzeConcernInput): Promise<AnalyzeConcernOutput> {
  return analyzeConcernFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeConcernPrompt',
  input: {schema: AnalyzeConcernInputSchema},
  output: {schema: AnalyzeConcernOutputSchema},
  prompt: `You are an expert leadership advisor for a community organization. A member has raised a concern. Your task is to analyze it and suggest concrete, actionable steps for the leadership to take.

Concern Title: {{title}}
Concern Description: {{{description}}}

Based on this, provide a numbered list of suggested steps to resolve this issue effectively and maintain member trust. Return the list in the "suggestedSteps" field.`,
});

const analyzeConcernFlow = ai.defineFlow(
  {
    name: 'analyzeConcernFlow',
    inputSchema: AnalyzeConcernInputSchema,
    outputSchema: AnalyzeConcernOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
