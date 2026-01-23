#!/bin/bash

echo "🌑 Applying Premium OLED Theme (True Black + Cool Violet)..."

# 1. GLOBAL STYLES & COLOR SYSTEM
# Defines the exact palette: #000000 bg, #0E0E10 surface, #7C7CFF accent
cat << 'EOF' > src/styles.css
:root {
  /* --- COLOR SYSTEM --- */
  --bg-app: #000000;       /* True Black */
  --bg-surface: #0E0E10;   /* Primary Surface (Cards, Inputs) */
  --bg-elevated: #16161A;  /* Hover states, Modals */
  
  --border-subtle: #1F1F23;
  --border-medium: #2A2A2E;

  /* --- ACCENT (Cool Violet) --- */
  --accent: #7C7CFF;
  --accent-hover: #8F8FFF;
  --accent-focus: rgba(124, 124, 255, 0.25);

  /* --- TEXT --- */
  --text-primary: #EAEAF0;
  --text-secondary: #A1A1AA;
  --text-muted: #6B6B75;
  --text-on-accent: #000000;

  /* --- STATUS --- */
  --danger: #FF4D4D;
  --success: #00C896;

  /* --- ANIMATION --- */
  --ease-out: cubic-bezier(0.215, 0.61, 0.355, 1);
}

/* --- RESET & BASE --- */
* { box-sizing: border-box; }

body {
  background-color: var(--bg-app);
  color: var(--text-primary);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  margin: 0;
  -webkit-font-smoothing: antialiased; /* Crisp text rendering */
  overflow: hidden; /* App handles scrolling */
}

/* --- TYPOGRAPHY --- */
h1, h2, h3 { margin: 0; font-weight: 500; color: var(--text-primary); letter-spacing: -0.02em; }
p { margin: 0; color: var(--text-secondary); font-weight: 400; }
.text-sm { font-size: 0.875rem; }
.text-xs { font-size: 0.75rem; }
.font-medium { font-weight: 500; }

/* --- BUTTONS --- */
button { font-family: inherit; cursor: pointer; transition: all 0.2s var(--ease-out); border: none; }

.btn-primary {
  background-color: var(--accent);
  color: var(--text-on-accent);
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.9rem;
  display: inline-flex; align-items: center; gap: 8px;
}
.btn-primary:hover { background-color: var(--accent-hover); transform: translateY(-1px); }
.btn-primary:active { transform: translateY(0); }

.btn-secondary {
  background-color: transparent;
  border: 1px solid var(--border-medium);
  color: var(--text-primary);
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.9rem;
}
.btn-secondary:hover { background-color: var(--bg-elevated); border-color: var(--text-secondary); }

.btn-icon {
  background: transparent;
  color: var(--text-secondary);
  width: 36px; height: 36px;
  border-radius: 6px;
  display: flex; align-items: center; justify-content: center;
}
.btn-icon:hover { background-color: var(--bg-elevated); color: var(--text-primary); }
.btn-icon.danger:hover { color: var(--danger); background-color: rgba(255, 77, 77, 0.1); }

/* --- INPUTS --- */
input, select {
  background-color: var(--bg-surface);
  border: 1px solid var(--border-medium);
  color: var(--text-primary);
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 0.9rem;
  width: 100%;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}
input:focus, select:focus { 
  border-color: var(--accent); 
  box-shadow: 0 0 0 2px var(--accent-focus);
}
input::placeholder { color: var(--text-muted); }

/* --- ANIMATIONS --- */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-enter { animation: fadeInUp 0.3s var(--ease-out) forwards; }

/* --- UTILITIES --- */
.d-flex { display: flex; }
.justify-between { justify-content: space-between; }
.justify-end { justify-content: flex-end; }
.items-center { align-items: center; }
.gap-2 { gap: 8px; }
.gap-3 { gap: 12px; }
.mb-4 { margin-bottom: 16px; }
.mb-1 { margin-bottom: 4px; }
EOF

# 2. MAIN APP COMPONENT (Layout)
cat << 'EOF' > src/app/app.component.ts
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
EOF

# 3. SIDEBAR COMPONENT (Minimalist)
cat << 'EOF' > src/app/components/sidebar/sidebar.component.ts
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
EOF

# 4. EMPLOYEE LIST (Clean Table & Layout)
cat << 'EOF' > src/app/components/employee-list/employee-list.component.html
<div class="animate-enter" style="max-width: 1200px; margin: 0 auto;">
  
  <div class="d-flex justify-between items-center mb-4">
    <div>
      <h1>Team Members</h1>
      <p style="margin-top: 4px;">Manage permissions and access.</p>
    </div>
    <button class="btn-primary" (click)="openForm()">
      <span class="material-icons" style="font-size: 18px;">add</span> Add Member
    </button>
  </div>

  <div class="d-flex gap-3 mb-4">
    <div style="position: relative; flex: 1; max-width: 320px;">
      <span class="material-icons" style="position: absolute; left: 12px; top: 10px; font-size: 20px; color: var(--text-muted);">search</span>
      <input type="text" [(ngModel)]="searchTerm" (input)="filter()" placeholder="Search employees..." style="padding-left: 40px;">
    </div>
    <select [(ngModel)]="filterDept" (change)="filter()" style="width: 180px;">
      <option value="">All Departments</option>
      <option>Engineering</option><option>Design</option><option>HR</option><option>Product</option>
    </select>
  </div>

  <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: 12px; overflow: hidden;">
    <table style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr style="border-bottom: 1px solid var(--border-subtle);">
          <th style="text-align: left; padding: 16px 24px; font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Employee</th>
          <th style="text-align: left; padding: 16px 24px; font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Role</th>
          <th style="text-align: left; padding: 16px 24px; font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Status</th>
          <th style="text-align: right; padding: 16px 24px; font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let emp of filteredEmployees" style="border-bottom: 1px solid var(--border-subtle); transition: background 0.2s;">
          <td style="padding: 16px 24px;">
            <div class="d-flex items-center gap-3">
              <div style="width: 36px; height: 36px; background: var(--bg-elevated); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 500; border: 1px solid var(--border-medium);">
                {{emp.firstName[0]}}{{emp.lastName[0]}}
              </div>
              <div>
                <div class="font-medium" style="color: var(--text-primary);">{{emp.firstName}} {{emp.lastName}}</div>
                <div class="text-xs" style="color: var(--text-secondary);">{{emp.email}}</div>
              </div>
            </div>
          </td>
          <td style="padding: 16px 24px;">
            <div style="font-size: 0.9rem; color: var(--text-primary);">{{emp.role}}</div>
            <div class="text-xs" style="color: var(--text-muted);">{{emp.department}}</div>
          </td>
          <td style="padding: 16px 24px;">
            <div style="display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 100px; font-size: 0.75rem; font-weight: 500;"
                 [style.background]="emp.status === 'Active' ? 'rgba(0, 200, 150, 0.1)' : 'rgba(255, 77, 77, 0.1)'"
                 [style.color]="emp.status === 'Active' ? 'var(--success)' : 'var(--danger)'">
              <div style="width: 6px; height: 6px; border-radius: 50%; background: currentColor;"></div>
              {{emp.status}}
            </div>
          </td>
          <td style="padding: 16px 24px; text-align: right;">
            <div class="d-flex justify-end gap-2">
              <button class="btn-icon" (click)="openForm(emp)"><span class="material-icons" style="font-size: 18px;">edit</span></button>
              <button class="btn-icon danger" (click)="delete(emp.id)"><span class="material-icons" style="font-size: 18px;">delete</span></button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    
    <div *ngIf="filteredEmployees.length === 0" style="padding: 40px; text-align: center; color: var(--text-secondary);">
      No employees found.
    </div>
  </div>
</div>

<app-employee-form *ngIf="showForm" [employee]="selectedEmployee" (close)="showForm = false" (saved)="onSave()"></app-employee-form>
EOF

# 5. FORM COMPONENT (Modal Dialog)
cat << 'EOF' > src/app/components/employee-form/employee-form.component.ts
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); z-index: 50; display: flex; align-items: center; justify-content: center;">
      <div class="animate-enter" style="background: var(--bg-surface); width: 100%; max-width: 480px; border: 1px solid var(--border-medium); border-radius: 12px; padding: 24px; box-shadow: 0 24px 48px -12px rgba(0,0,0,0.5);">
        
        <div class="d-flex justify-between items-center mb-4">
          <h2 style="font-size: 1.25rem;">{{employee ? 'Edit Member' : 'New Member'}}</h2>
          <button class="btn-icon" (click)="close.emit()"><span class="material-icons">close</span></button>
        </div>
        
        <form [formGroup]="form" (ngSubmit)="submit()">
          <div class="d-flex gap-3 mb-4">
            <div style="flex: 1;">
               <label class="text-xs font-medium mb-1" style="display: block; color: var(--text-secondary);">First Name</label>
               <input formControlName="firstName">
            </div>
            <div style="flex: 1;">
               <label class="text-xs font-medium mb-1" style="display: block; color: var(--text-secondary);">Last Name</label>
               <input formControlName="lastName">
            </div>
          </div>

          <div class="mb-4">
            <label class="text-xs font-medium mb-1" style="display: block; color: var(--text-secondary);">Email Address</label>
            <input formControlName="email" type="email">
          </div>

          <div class="d-flex gap-3 mb-4">
             <div style="flex: 1;">
                <label class="text-xs font-medium mb-1" style="display: block; color: var(--text-secondary);">Department</label>
                <select formControlName="department">
                  <option>Engineering</option><option>Design</option><option>HR</option><option>Product</option>
                </select>
             </div>
             <div style="flex: 1;">
                <label class="text-xs font-medium mb-1" style="display: block; color: var(--text-secondary);">Role</label>
                <input formControlName="role">
             </div>
          </div>

          <div class="d-flex justify-end gap-2 pt-3" style="border-top: 1px solid var(--border-subtle);">
            <button type="button" class="btn-secondary" (click)="close.emit()">Cancel</button>
            <button type="submit" class="btn-primary" [disabled]="form.invalid">
              {{employee ? 'Save Changes' : 'Create Member'}}
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class EmployeeFormComponent implements OnInit {
  @Input() employee: Employee | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();
  form: FormGroup;

  constructor(private fb: FormBuilder, private service: EmployeeService) {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      department: ['Engineering'],
      role: ['Staff'],
      status: ['Active']
    });
  }

  ngOnInit() { if (this.employee) this.form.patchValue(this.employee); }

  submit() {
    if (this.form.valid) {
      const data = { ...this.form.value, id: this.employee ? this.employee.id : 0 };
      this.employee ? this.service.updateEmployee(data) : this.service.addEmployee(data);
      this.saved.emit();
    }
  }
}
EOF

echo "✅ Premium OLED Theme Applied."
