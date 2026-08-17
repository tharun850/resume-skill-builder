import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScreenshotUploadComponent } from './components/screenshot-upload/screenshot-upload.component';
import { SkillReviewComponent } from './components/skill-review/skill-review.component';
import { ResumePreviewComponent } from './components/resume-preview/resume-preview.component';
import { AiSettingsComponent } from './components/ai-settings/ai-settings.component';
import { ResumeEditorComponent } from './components/resume-editor/resume-editor.component';
import { ResumeDataService } from './services/resume-data.service';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    ScreenshotUploadComponent,
    SkillReviewComponent,
    ResumePreviewComponent,
    AiSettingsComponent,
    ResumeEditorComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  candidateSkills = signal<string[] | null>(null);

  constructor(
    public resumeData: ResumeDataService,
    public themeService: ThemeService
  ) {}

  onSkillsExtracted(skills: string[]): void {
    this.candidateSkills.set(skills);
  }

  onSkillsApproved(skills: string[]): void {
    this.resumeData.addSkills(skills);
    this.candidateSkills.set(null);
  }
}

