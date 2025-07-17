import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-meeting-minutes.ts';
import '@/ai/flows/suggest-talking-points.ts';
import '@/ai/flows/analyze-concern.ts';
import '@/ai/flows/get-helpful-info.ts';
