import { Component, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ResumeDataService } from '../../services/resume-data.service';
import { PdfGeneratorService } from '../../services/pdf-generator.service';

@Component({
  selector: 'app-resume-preview',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './resume-preview.component.html',
  styleUrl: './resume-preview.component.css',
})
export class ResumePreviewComponent implements OnDestroy {
  newSkillInput = '';
  isDownloading = signal(false);
  previewModalOpen = signal(false);
  pdfUrl = signal<SafeResourceUrl | null>(null);
  rawBlobUrl: string | null = null;

  constructor(
    public resumeData: ResumeDataService,
    private pdfGenerator: PdfGeneratorService,
    private sanitizer: DomSanitizer
  ) {}

  addSkill(): void {
    if (this.newSkillInput.trim()) {
      this.resumeData.addSkill(this.newSkillInput);
      this.newSkillInput = '';
    }
  }

  removeSkill(skill: string): void {
    this.resumeData.removeSkill(skill);
  }

  openPdfPreview(): void {
    if (this.rawBlobUrl) {
      URL.revokeObjectURL(this.rawBlobUrl);
    }
    this.rawBlobUrl = this.pdfGenerator.generateBlobUrl(this.resumeData.resume());
    this.pdfUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(this.rawBlobUrl));
    this.previewModalOpen.set(true);
  }

  closePdfPreview(): void {
    this.previewModalOpen.set(false);
    if (this.rawBlobUrl) {
      URL.revokeObjectURL(this.rawBlobUrl);
      this.rawBlobUrl = null;
    }
    this.pdfUrl.set(null);
  }

  openInNewTab(): void {
    if (this.rawBlobUrl) {
      window.open(this.rawBlobUrl, '_blank');
    }
  }

  download(): void {
    this.isDownloading.set(true);
    try {
      this.pdfGenerator.generateAndDownload(this.resumeData.resume());
    } finally {
      setTimeout(() => this.isDownloading.set(false), 500);
    }
  }

  reset(): void {
    if (confirm('Reset skills and resume back to your default baseline?')) {
      this.resumeData.resetToBase();
    }
  }

  ngOnDestroy(): void {
    if (this.rawBlobUrl) {
      URL.revokeObjectURL(this.rawBlobUrl);
    }
  }
}
