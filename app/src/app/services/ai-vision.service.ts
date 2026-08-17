import { Injectable } from '@angular/core';
import { AiSettingsService } from './ai-settings.service';

const SYSTEM_PROMPT = `You analyze screenshots of job-portal skill match widgets (like LinkedIn/Naukri "skills match" chips).
The image contains rounded pill/chip elements, each with a skill or keyword as its text label.
Some chips are visually highlighted -- typically a colored border/outline (e.g. teal, cyan, or blue) and/or colored text,
indicating the skill is already matched on the candidate's profile.
Other chips are plain -- a neutral gray/black border with no color highlight -- indicating the skill is
requested by the job but NOT yet on the candidate's profile.

Your task: identify ONLY the plain, non-highlighted chips (the ones the candidate is missing).
Ignore the highlighted/colored chips entirely -- do not include them in your answer.

Respond with ONLY a JSON array of strings, exactly matching the text on each non-highlighted chip.
No explanation, no markdown code fences, no extra text. Example valid response:
["Google Cloud", "C++", "Golang", "Kotlin"]

If you cannot confidently tell which chips are highlighted vs plain, respond with an empty array: []`;

const RETRYABLE_STATUS_CODES = new Set([503, 502, 504, 429]);
const MAX_ATTEMPTS = 3;
const BASE_DELAY_MS = 1500;

export interface RetryProgress {
  attempt: number;
  maxAttempts: number;
  delayMs: number;
  reason: string;
}

@Injectable({ providedIn: 'root' })
export class AiVisionService {
  constructor(private settingsService: AiSettingsService) {}

  async extractNonHighlightedSkills(
    imageDataUrl: string,
    onRetry?: (progress: RetryProgress) => void
  ): Promise<string[]> {
    const settings = this.settingsService.settings();

    if (settings.provider === 'api' && !settings.apiKey.trim()) {
      throw new Error('Add an API key in Settings before using the hosted API provider.');
    }

    const url = `${settings.baseUrl.replace(/\/$/, '')}/chat/completions`;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (settings.apiKey.trim()) headers['Authorization'] = `Bearer ${settings.apiKey.trim()}`;

    const body = {
      model: settings.model,
      temperature: 0,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Identify the non-highlighted skill chips in this screenshot.' },
            { type: 'image_url', image_url: { url: imageDataUrl } },
          ],
        },
      ],
    };

    let lastError: Error = new Error('Unknown error');

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      let response: Response;

      try {
        response = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body) });
      } catch (err) {
        lastError = new Error(
          settings.provider === 'local'
            ? `Could not reach the local model at ${settings.baseUrl}. Make sure LM Studio's local server is running and CORS is enabled.`
            : `Could not reach the API at ${settings.baseUrl}. Check the URL and your network connection.`
        );
        if (attempt < MAX_ATTEMPTS) {
          await this.waitWithBackoff(attempt, 'Network error', onRetry);
          continue;
        }
        throw lastError;
      }

      if (response.ok) {
        const json = await response.json();
        const content: string = json?.choices?.[0]?.message?.content ?? '';
        return this.parseSkillArray(content);
      }

      const text = await response.text().catch(() => '');

      if (RETRYABLE_STATUS_CODES.has(response.status) && attempt < MAX_ATTEMPTS) {
        lastError = new Error(`AI request failed (${response.status}): ${text.slice(0, 200)}`);
        await this.waitWithBackoff(attempt, `HTTP ${response.status}`, onRetry);
        continue;
      }

      throw new Error(`AI request failed (${response.status}): ${text.slice(0, 200)}`);
    }

    throw lastError;
  }

  private async waitWithBackoff(
    attempt: number,
    reason: string,
    onRetry?: (progress: RetryProgress) => void
  ): Promise<void> {
    const delayMs = BASE_DELAY_MS * Math.pow(2, attempt - 1);
    onRetry?.({ attempt, maxAttempts: MAX_ATTEMPTS, delayMs, reason });
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }

  private parseSkillArray(content: string): string[] {
    const cleaned = content.trim().replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();

    try {
      const parsed = JSON.parse(cleaned);
      if (Array.isArray(parsed)) {
        return parsed.filter((s): s is string => typeof s === 'string' && s.trim().length > 0);
      }
    } catch {
    }

    const match = cleaned.match(/\[[\s\S]*\]/);
    if (match) {
      try {
        const parsed = JSON.parse(match[0]);
        if (Array.isArray(parsed)) {
          return parsed.filter((s): s is string => typeof s === 'string' && s.trim().length > 0);
        }
      } catch {
      }
    }

    return [];
  }
}
