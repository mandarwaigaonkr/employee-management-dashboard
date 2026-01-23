#!/bin/bash

echo "🚨 Applying EMERGENCY LAYOUT FIX (Single File Component)..."

# Overwrite the Employee List Component with INLINE Template & Styles
# This guarantees the layout cannot be ignored by the browser.
cat << 'EOF' > src/app/components/employee-list/employee-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../services/employee.service';
import { UiService } from '../../services/ui.service';
import { Employee } from '../../models/employee.model';
import { EmployeeFormComponent } from '../employee-form/employee-form.component';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, FormsModule, EmployeeFormComponent],
  template: `
    <div class="page-container">
      
      <div class="header-section">
        <div>
          <h1>Team Overview</h1>
          <p class="subtitle">Manage your team members and permissions.</p>
        </div>
        <button class="btn-primary" (click)="openForm()">
          <span class="material-icons">add</span> New Member
        </button>
      </div>

      <div class="filter-bar">
        <div class="search-wrapper">
          <span class="material-icons search-icon">search</span>
          <input type="text" [(ngModel)]="searchTerm" (input)="filter()" 
                 placeholder="Search by name..." class="search-input">
        </div>
        
        <select [(ngModel)]="filterDept" (change)="filter()" class="dept-select">
          <option value="">All Departments</option>
          <option>Engineering</option><option>Design</option><option>HR</option><option>Product</option>
        </select>
      </div>

      <div class="table-container">
        
        <div class="grid-row header-row">
          <div class="col-employee">EMPLOYEE</div>
          <div class="col-role">ROLE & DEPT</div>
          <div class="col-status">STATUS</div>
          <div class="col-actions">ACTIONS</div>
        </div>

        <div *ngFor="let emp of filteredEmployees" class="grid-row data-row">
          
          <div class="col-employee flex-align">
            <div class="avatar">{{emp.firstName[0]}}{{emp.lastName[0]}}</div>
            <div>
              <div class="emp-name">{{emp.firstName}} {{emp.lastName}}</div>
              <div class="emp-email">{{emp.email}}</div>
            </div>
          </div>

          <div class="col-role">
            <div class="role-text">{{emp.role}}</div>
            <div class="dept-text">{{emp.department}}</div>
          </div>

          <div class="col-status">
            <span class="status-badge" 
                  [class.active]="emp.status === 'Active'" 
                  [class.inactive]="emp.status !== 'Active'">
              <span class="status-dot"></span> {{emp.status}}
            </span>
          </div>

          <div class="col-actions text-right">
            <button class="icon-btn" (click)="openForm(emp)" title="Edit">
              <span class="material-icons">edit</span>
            </button>
            <button class="icon-btn danger" (click)="delete(emp.id)" title="Delete">
              <span class="material-icons">delete</span>
            </button>
          </div>

        </div>

        <div *ngIf="filteredEmployees.length === 0" class="empty-state">
          <span class="material-icons empty-icon">search_off</span>
          <p>No team members found.</p>
        </div>

      </div>
    </div>

    <app-employee-form *ngIf="showForm" 
                       [employee]="selectedEmployee" 
                       (close)="showForm = false"
                       (saved)="onSave()">
    </app-employee-form>
  `,
  styles: [`
    /* --- LAYOUT & GRID SYSTEM --- */
    .page-container {
      max-width: 1200px;
      margin: 0 auto;
      width: 100%;
    }

    /* The Magic Grid: Defines strict widths for columns */
    .grid-row {
      display: grid;
      grid-template-columns: 2fr 1.5fr 1fr 100px; /* 4 Columns */
      padding: 16px 24px;
      align-items: center;
      border-bottom: 1px solid #1F1F23;
    }

    .header-row {
      background-color: #16161A;
      border-top-left-radius: 12px;
      border-top-right-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
      color: #6B6B75; /* Muted Text */
      letter-spacing: 0.05em;
    }

    .data-row {
      background-color: #0E0E10; /* Surface Color */
      transition: background 0.2s;
    }
    .data-row:hover {
      background-color: #16161A; /* Hover Highlight */
    }
    .data-row:last-child {
      border-bottom: none;
      border-bottom-left-radius: 12px;
      border-bottom-right-radius: 12px;
    }

    /* --- TYPOGRAPHY & COLORS --- */
    h1 { font-size: 1.5rem; font-weight: 600; color: #EAEAF0; margin: 0; }
    .subtitle { color: #A1A1AA; font-size: 0.9rem; margin-top: 4px; }
    
    .emp-name { color: #EAEAF0; font-weight: 500; font-size: 0.95rem; }
    .emp-email { color: #6B6B75; font-size: 0.8rem; }
    
    .role-text { color: #EAEAF0; font-size: 0.9rem; }
    .dept-text { color: #6B6B75; font-size: 0.8rem; }

    /* --- COMPONENTS --- */
    .header-section { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    
    .btn-primary {
      background: #7C7CFF; color: black; border: none; padding: 10px 20px;
      border-radius: 8px; font-weight: 500; cursor: pointer;
      display: inline-flex; align-items: center; gap: 8px;
    }
    
    .filter-bar { display: flex; gap: 12px; margin-bottom: 24px; }
    
    .search-wrapper { position: relative; flex: 1; max-width: 320px; }
    .search-input {
      width: 100%; background: #0E0E10; border: 1px solid #2A2A2E; color: white;
      padding: 10px 10px 10px 40px; border-radius: 8px; outline: none;
    }
    .search-icon { position: absolute; left: 12px; top: 10px; color: #6B6B75; font-size: 20px; }
    
    .dept-select {
      background: #0E0E10; border: 1px solid #2A2A2E; color: white;
      padding: 0 16px; border-radius: 8px; width: 180px; outline: none;
    }

    .table-container {
      background: #0E0E10; border: 1px solid #1F1F23; border-radius: 12px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.4);
    }

    /* --- AVATAR & BADGES --- */
    .flex-align { display: flex; align-items: center; gap: 12px; }
    
    .avatar {
      width: 40px; height: 40px; background: #27272A; color: #EAEAF0;
      border-radius: 50%; display: flex; align-items: center; justify-content: center;
      font-weight: 600; font-size: 14px; border: 1px solid #3F3F46;
    }

    .status-badge {
      display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px;
      border-radius: 100px; font-size: 0.75rem; font-weight: 500;
    }
    .status-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
    
    .status-badge.active { background: rgba(0, 200, 150, 0.1); color: #00C896; border: 1px solid rgba(0, 200, 150, 0.2); }
    .status-badge.inactive { background: rgba(255, 77, 77, 0.1); color: #FF4D4D; border: 1px solid rgba(255, 77, 77, 0.2); }

    .icon-btn { background: transparent; border: none; color: #6B6B75; cursor: pointer; padding: 6px; border-radius: 4px; }
    .icon-btn:hover { background: #16161A; color: #EAEAF0; }
    .icon-btn.danger:hover { background: rgba(255, 77, 77, 0.1); color: #FF4D4D; }

    .text-right { text-align: right; justify-content: flex-end; display: flex; gap: 8px; }
    
    .empty-state { padding: 60px; text-align: center; color: #6B6B75; }
    .empty-icon { font-size: 48px; margin-bottom: 12px; opacity: 0.5; }
  `]
})
export class EmployeeListComponent implements OnInit {
  allEmployees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  
  searchTerm = '';
  filterDept = '';
  showForm = false;
  selectedEmployee: Employee | null = null;

  constructor(private service: EmployeeService, private ui: UiService) {}

  ngOnInit() {
    this.service.getEmployees().subscribe(data => {
      this.allEmployees = data;
      this.filter();
    });
  }

  filter() {
    this.filteredEmployees = this.allEmployees.filter(e => {
      const matchSearch = (e.firstName + e.lastName + e.email).toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchDept = this.filterDept ? e.department === this.filterDept : true;
      return matchSearch && matchDept;
    });
  }

  openForm(emp: Employee | null = null) {
    this.selectedEmployee = emp;
    this.showForm = true;
  }

  onSave() {
    this.showForm = false;
  }

  delete(id: number) {
    if(confirm('Delete employee?')) {
      this.service.deleteEmployee(id);
      this.ui.showSnackbar('Deleted successfully');
    }
  }
}
EOF

echo "✅ EMERGENCY FIX APPLIED. Please restart your server."
