import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  darkMode = signal<boolean>(false);

  constructor() {
    // Check local storage or system preference
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      this.setDark(true);
    } else if (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.setDark(true);
    }
  }

  toggle() {
    this.setDark(!this.darkMode());
  }

  private setDark(isDark: boolean) {
    this.darkMode.set(isDark);
    if (isDark) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  }
}
