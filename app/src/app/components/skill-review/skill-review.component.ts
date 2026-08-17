import { Component, EventEmitter, Input, Output, signal, computed, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResumeDataService } from '../../services/resume-data.service';

interface ReviewRow {
  skill: string;
  selected: boolean;
}

@Component({
  selector: 'app-skill-review',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './skill-review.component.html',
  styleUrl: './skill-review.component.css',
})
export class SkillReviewComponent implements OnChanges {
  @Input() candidateSkills: string[] | null = null;
  @Output() skillsApproved = new EventEmitter<string[]>();

  rows = signal<ReviewRow[]>([]);
  alreadyPresent = signal<string[]>([]);
  customSkillInput = '';

  selectedCount = computed(() => this.rows().filter((r) => r.selected).length);

  constructor(private resumeData: ResumeDataService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['candidateSkills'] && this.candidateSkills) {
      this.processSkills(this.candidateSkills);
    }
  }

  private processSkills(candidates: string[]): void {
    const existing = this.resumeData.allSkillsLower();
    const alreadyPresent: string[] = [];
    const newSkills: string[] = [];

    const seen = new Set<string>();
    for (const c of candidates) {
      const key = c.toLowerCase().trim();
      if (!key || seen.has(key)) continue;
      seen.add(key);
      if (existing.has(key)) {
        alreadyPresent.push(c.trim());
      } else {
        newSkills.push(c.trim());
      }
    }

    this.alreadyPresent.set(alreadyPresent);
    this.rows.set(newSkills.map((skill) => ({ skill, selected: true })));
  }

  addCustomSkill(): void {
    const trimmed = this.customSkillInput.trim();
    if (!trimmed) return;

    const existingInResume = this.resumeData.allSkillsLower();
    if (existingInResume.has(trimmed.toLowerCase())) {
      this.customSkillInput = '';
      return;
    }

    const currentRows = this.rows();
    const existsInRows = currentRows.some((r) => r.skill.toLowerCase() === trimmed.toLowerCase());
    if (!existsInRows) {
      this.rows.set([...currentRows, { skill: trimmed, selected: true }]);
    }
    this.customSkillInput = '';
  }

  toggleAll(selected: boolean): void {
    this.rows.update((rows) => rows.map((r) => ({ ...r, selected })));
  }

  removeRow(skill: string): void {
    this.rows.update((rows) => rows.filter((r) => r.skill !== skill));
  }

  confirm(): void {
    const selected = this.rows().filter((r) => r.selected).map((r) => r.skill);
    this.skillsApproved.emit(selected);
  }
}
