import { Component, EventEmitter, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AiVisionService, RetryProgress } from '../../services/ai-vision.service';

@Component({
  selector: 'app-screenshot-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './screenshot-upload.component.html',
  styleUrl: './screenshot-upload.component.css',
})
export class ScreenshotUploadComponent {
  @Output() skillsExtracted = new EventEmitter<string[]>();

  previewUrl = signal<string | null>(null);
  isProcessing = signal(false);
  isDragOver = signal(false);
  errorMessage = signal<string | null>(null);
  retryStatus = signal<string | null>(null);

  constructor(private aiVision: AiVisionService) {}

  onDragOver(evt: DragEvent): void {
    evt.preventDefault();
    this.isDragOver.set(true);
  }

  onDragLeave(): void {
    this.isDragOver.set(false);
  }

  onDrop(evt: DragEvent): void {
    evt.preventDefault();
    this.isDragOver.set(false);
    const file = evt.dataTransfer?.files?.[0];
    if (file) this.handleFile(file);
  }

  onFileSelected(evt: Event): void {
    const input = evt.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) this.handleFile(file);
  }

  onPaste(evt: ClipboardEvent): void {
    const items = evt.clipboardData?.items;
    if (!items) return;
    for (const item of Array.from(items)) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) this.handleFile(file);
        break;
      }
    }
  }

  private async handleFile(file: File): Promise<void> {
    this.errorMessage.set(null);
    if (!file.type.startsWith('image/')) {
      this.errorMessage.set('Please upload an image file (PNG or JPG).');
      return;
    }

    const dataUrl = await this.fileToDataUrl(file);
    this.previewUrl.set(dataUrl);
    this.isProcessing.set(true);
    this.retryStatus.set(null);

    try {
      const skills = await this.aiVision.extractNonHighlightedSkills(dataUrl, (progress: RetryProgress) => {
        const seconds = Math.round(progress.delayMs / 1000);
        this.retryStatus.set(
          `${progress.reason} — retrying in ${seconds}s (attempt ${progress.attempt + 1}/${progress.maxAttempts})`
        );
      });
      if (skills.length === 0) {
        this.errorMessage.set(
          'No non-highlighted skills were detected. The model may not have understood the image, or every skill shown was already highlighted.'
        );
      }
      this.skillsExtracted.emit(skills);
    } catch (err) {
      console.error(err);
      this.errorMessage.set(err instanceof Error ? err.message : 'Something went wrong reading that image.');
    } finally {
      this.isProcessing.set(false);
      this.retryStatus.set(null);
    }
  }

  private fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  reset(): void {
    this.previewUrl.set(null);
    this.errorMessage.set(null);
  }
}
