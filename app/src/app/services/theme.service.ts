import { Injectable, signal } from '@angular/core';

const THEME_STORAGE_KEY = 'skill-resume-builder:theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly isDark = signal<boolean>(this.getInitialTheme());

  constructor() {
    this.applyTheme(this.isDark());
  }

  private getInitialTheme(): boolean {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored === 'dark') return true;
      if (stored === 'light') return false;
      return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
    } catch {
      return false;
    }
  }

  toggleTheme(): void {
    const nextState = !this.isDark();
    this.isDark.set(nextState);
    this.applyTheme(nextState);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, nextState ? 'dark' : 'light');
    } catch {
    }
  }

  private applyTheme(dark: boolean): void {
    if (typeof document !== 'undefined') {
      if (dark) {
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
    }
  }
}
