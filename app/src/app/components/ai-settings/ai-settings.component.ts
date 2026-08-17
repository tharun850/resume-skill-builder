import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiSettingsService } from '../../services/ai-settings.service';
import {
  AiProviderType,
  AiSettings,
  DEFAULT_API_SETTINGS,
  DEFAULT_LOCAL_SETTINGS,
} from '../../models/ai-settings.model';

@Component({
  selector: 'app-ai-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ai-settings.component.html',
  styleUrl: './ai-settings.component.css',
})
export class AiSettingsComponent {
  isOpen = signal(false);
  form: AiSettings;
  savedMessage = signal(false);

  constructor(private settingsService: AiSettingsService) {
    this.form = { ...this.settingsService.settings() };
  }

  toggle(): void {
    this.isOpen.update((v) => !v);
    if (this.isOpen()) this.form = { ...this.settingsService.settings() };
  }

  onProviderChange(provider: AiProviderType): void {
    const defaults = provider === 'local' ? DEFAULT_LOCAL_SETTINGS : DEFAULT_API_SETTINGS;
    // Only reset baseUrl/model to sensible defaults when switching provider type;
    // keep an existing apiKey if the user already typed one for this session.
    this.form = { ...defaults, apiKey: this.form.apiKey, provider };
  }

  save(): void {
    this.settingsService.update({ ...this.form });
    this.savedMessage.set(true);
    setTimeout(() => this.savedMessage.set(false), 2000);
  }
}
