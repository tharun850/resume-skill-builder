import { Injectable, signal } from '@angular/core';
import { AiSettings, DEFAULT_LOCAL_SETTINGS } from '../models/ai-settings.model';

const STORAGE_KEY = 'skill-resume-builder:ai-settings';

@Injectable({ providedIn: 'root' })
export class AiSettingsService {
  readonly settings = signal<AiSettings>(this.load());

  private load(): AiSettings {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return { ...DEFAULT_LOCAL_SETTINGS, ...JSON.parse(raw) };
    } catch {
    }
    return { ...DEFAULT_LOCAL_SETTINGS };
  }

  update(settings: AiSettings): void {
    this.settings.set(settings);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
    }
  }
}
