import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { ThemeService } from './services/theme.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule],
  template: `
    <nav class="navbar px-4 py-3 d-flex justify-content-between align-items-center" 
         style="background: var(--bg-card); box-shadow: var(--shadow); position: sticky; top:0; z-index:1000;">
      <div class="d-flex align-items-center gap-2">
        <span class="material-icons" style="color: var(--primary); font-size: 32px;">dashboard</span>
        <span class="fs-4 fw-bold" style="color: var(--text-main);">EmpManager</span>
      </div>
      
      <button class="btn btn-icon" (click)="themeService.toggle()" 
              style="background:none; border:none; color: var(--text-main); cursor: pointer;">
        <span class="material-icons">
          {{ themeService.darkMode() ? 'light_mode' : 'dark_mode' }}
        </span>
      </button>
    </nav>

    <div class="main-content" style="padding: 2rem;">
      <router-outlet></router-outlet>
    </div>
  `
})
export class AppComponent {
  constructor(public themeService: ThemeService) {}
}
