import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiService } from '../../services/ui.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <aside [class.collapsed]="ui.isSidebarCollapsed()">
      <div class="header">
        <div class="logo">E</div>
        <span class="title" *ngIf="!ui.isSidebarCollapsed()">EmpDash</span>
      </div>

      <nav>
        <div class="section-title" *ngIf="!ui.isSidebarCollapsed()">MENU</div>
        
        <a href="#" class="nav-item active">
          <span class="material-icons">grid_view</span>
          <span *ngIf="!ui.isSidebarCollapsed()">Overview</span>
        </a>
        <a href="#" class="nav-item">
          <span class="material-icons">people</span>
          <span *ngIf="!ui.isSidebarCollapsed()">Employees</span>
        </a>
        <a href="#" class="nav-item">
          <span class="material-icons">bar_chart</span>
          <span *ngIf="!ui.isSidebarCollapsed()">Analytics</span>
        </a>
      </nav>

      <div class="profile" *ngIf="!ui.isSidebarCollapsed()">
        <div class="avatar">MW</div>
        <div class="info">
          <div class="name">Mandar W.</div>
          <div class="role">Administrator</div>
        </div>
      </div>
    </aside>
  `,
  styles: [`
    aside {
      width: 260px; height: 100%;
      background-color: var(--bg-app); /* Match body for continuous feel */
      border-right: 1px solid var(--border-subtle);
      display: flex; flex-direction: column;
      padding: 24px 16px;
      transition: width 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);
    }
    aside.collapsed { width: 72px; padding: 24px 8px; align-items: center; }
    aside.collapsed .nav-item { justify-content: center; padding: 10px 0; }
    aside.collapsed .section-title, aside.collapsed .profile { display: none; }

    .header { display: flex; align-items: center; gap: 12px; margin-bottom: 40px; padding-left: 8px; }
    .logo { 
      width: 32px; height: 32px; 
      background: var(--text-primary); color: var(--bg-app); 
      border-radius: 6px; 
      display: flex; align-items: center; justify-content: center; 
      font-weight: 700; 
    }
    .title { font-size: 1.1rem; font-weight: 600; letter-spacing: -0.01em; }

    .section-title { font-size: 0.7rem; font-weight: 600; color: var(--text-muted); margin-bottom: 12px; padding-left: 12px; letter-spacing: 0.05em; }

    .nav-item {
      display: flex; align-items: center; gap: 12px;
      padding: 10px 12px; margin-bottom: 4px;
      color: var(--text-secondary); text-decoration: none;
      border-radius: 8px; transition: all 0.2s;
      font-size: 0.9rem;
    }
    .nav-item:hover { background-color: var(--bg-elevated); color: var(--text-primary); }
    .nav-item.active { background-color: var(--bg-elevated); color: var(--accent); border: 1px solid var(--border-medium); }
    .nav-item .material-icons { font-size: 20px; }

    .profile { margin-top: auto; display: flex; align-items: center; gap: 12px; padding: 12px; border-top: 1px solid var(--border-subtle); }
    .avatar { width: 32px; height: 32px; background: var(--bg-surface); border-radius: 50%; border: 1px solid var(--border-medium); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 500; }
    .name { font-size: 0.85rem; font-weight: 500; color: var(--text-primary); }
    .role { font-size: 0.75rem; color: var(--text-muted); }
  `]
})
export class SidebarComponent {
  constructor(public ui: UiService) {}
}
