import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { UiService } from './services/ui.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent],
  template: `
    <div style="display: flex; height: 100vh; background-color: var(--bg-app);">
      <app-sidebar></app-sidebar>
      <main style="flex: 1; overflow-y: auto; padding: 2rem 3rem;">
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class AppComponent {
  constructor(public ui: UiService) {}
}
