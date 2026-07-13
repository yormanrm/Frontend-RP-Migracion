import { inject, Injectable } from '@angular/core';
import { signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private document = inject(DOCUMENT);
  darkMode = signal(false);

  constructor() {
    this.loadTheme();
  }

  toggleDarkMode(): void {
    const newValue = !this.darkMode();
    this.darkMode.set(newValue);
    this.applyTheme(newValue);
    localStorage.setItem('darkMode', JSON.stringify(newValue));
  }

  private loadTheme(): void {
    const saved = localStorage.getItem('darkMode');
    const isDark = saved ? JSON.parse(saved) : false;
    this.darkMode.set(isDark);
    this.applyTheme(isDark);
  }

  private applyTheme(isDark: boolean): void {
    const htmlElement = this.document.documentElement;
    if (isDark) {
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
    }
  }
}
