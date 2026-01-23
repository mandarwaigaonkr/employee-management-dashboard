import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UiService {
  isSidebarCollapsed = signal(false);
  snackbarMsg = signal<string | null>(null);

  toggleSidebar() {
    this.isSidebarCollapsed.set(!this.isSidebarCollapsed());
  }

  showSnackbar(msg: string) {
    this.snackbarMsg.set(msg);
    setTimeout(() => this.snackbarMsg.set(null), 3000);
  }
}
