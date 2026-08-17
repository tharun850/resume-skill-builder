import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResumeDataService } from '../../services/resume-data.service';
import { ResumeData, ExperienceEntry, TechProjectEntry, EducationEntry, CertificationEntry } from '../../models/resume.model';

type EditorTab = 'personal' | 'experience' | 'projects' | 'skills' | 'education' | 'json';

@Component({
  selector: 'app-resume-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './resume-editor.component.html',
  styleUrl: './resume-editor.component.css',
})
export class ResumeEditorComponent {
  isOpen = signal(false);
  activeTab = signal<EditorTab>('personal');
  savedMessage = signal(false);
  jsonError = signal<string | null>(null);

  form: ResumeData;
  skillsText = '';
  jsonText = '';

  constructor(private resumeService: ResumeDataService) {
    this.form = structuredClone(this.resumeService.resume());
    if (!this.form.projects) this.form.projects = [];
    this.skillsText = this.form.skills.join(', ');
  }

  toggle(): void {
    this.isOpen.update((v) => !v);
    if (this.isOpen()) {
      this.refreshFromService();
    }
  }

  setTab(tab: EditorTab): void {
    this.activeTab.set(tab);
    if (tab === 'json') {
      this.jsonText = JSON.stringify(this.form, null, 2);
      this.jsonError.set(null);
    } else if (tab === 'skills') {
      this.skillsText = this.form.skills.join(', ');
    }
  }

  refreshFromService(): void {
    this.form = structuredClone(this.resumeService.resume());
    if (!this.form.projects) this.form.projects = [];
    this.skillsText = this.form.skills.join(', ');
    this.jsonText = JSON.stringify(this.form, null, 2);
  }

  addExperience(): void {
    const newExp: ExperienceEntry = {
      title: 'Software Engineer',
      company: 'Company Name',
      period: '2024 - Present',
      location: 'City, Country',
      bullets: ['Developed key system features and optimized services.'],
    };
    this.form.experience.push(newExp);
  }

  removeExperience(index: number): void {
    this.form.experience.splice(index, 1);
  }

  addBullet(exp: ExperienceEntry): void {
    exp.bullets.push('');
  }

  removeBullet(exp: ExperienceEntry, bulletIndex: number): void {
    exp.bullets.splice(bulletIndex, 1);
  }

  addProject(): void {
    if (!this.form.projects) this.form.projects = [];
    const newProj: TechProjectEntry = {
      name: 'Project Name',
      techStack: 'Tech Stack (e.g. Angular, Spring Boot)',
      link: 'https://github.com/...',
      bullet: 'Concise, single-bullet summary of key technical achievements and results.',
    };
    this.form.projects.push(newProj);
  }

  removeProject(index: number): void {
    this.form.projects?.splice(index, 1);
  }

  trackByIndex(index: number): number {
    return index;
  }

  addEducation(): void {
    const newEdu: EducationEntry = {
      degree: 'B.Tech / B.S. in Computer Science',
      school: 'University Name',
      detail: 'Graduated 2022',
    };
    this.form.education.push(newEdu);
  }

  removeEducation(index: number): void {
    this.form.education.splice(index, 1);
  }

  addCertification(): void {
    const newCert: CertificationEntry = {
      name: 'Certification Name',
      detail: 'Issued 2024',
    };
    this.form.certifications.push(newCert);
  }

  removeCertification(index: number): void {
    this.form.certifications.splice(index, 1);
  }

  save(): void {
    const parsedSkills = this.skillsText
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    this.form.skills = parsedSkills;

    this.resumeService.saveResume(this.form);
    this.savedMessage.set(true);
    setTimeout(() => this.savedMessage.set(false), 2500);
  }

  resetToDefault(): void {
    if (confirm('Reset your resume back to the factory sample template? All your custom profile changes will be replaced.')) {
      this.resumeService.resetToBase();
      this.refreshFromService();
      this.savedMessage.set(true);
      setTimeout(() => this.savedMessage.set(false), 2000);
    }
  }

  applyJson(): void {
    this.jsonError.set(null);
    try {
      const parsed = JSON.parse(this.jsonText);
      if (!parsed.name || !Array.isArray(parsed.skills)) {
        this.jsonError.set('JSON must contain at least "name" (string) and "skills" (array).');
        return;
      }
      this.form = parsed;
      this.save();
      this.skillsText = this.form.skills.join(', ');
    } catch (e) {
      this.jsonError.set('Invalid JSON syntax. Please check formatting.');
    }
  }

  copyJson(): void {
    navigator.clipboard.writeText(this.jsonText);
    this.savedMessage.set(true);
    setTimeout(() => this.savedMessage.set(false), 2000);
  }
}
