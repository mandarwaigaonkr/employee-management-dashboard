#!/bin/bash

echo "🔧 Fixing Layout Alignment (Switching to CSS Grid)..."

# 1. UPDATE EMPLOYEE LIST (CSS Grid Implementation)
# We replace the <table> with <div>s using CSS Grid for perfect alignment.
cat << 'EOF' > src/app/components/employee-list/employee-list.component.html
<div class="animate-enter" style="max-width: 1200px; margin: 0 auto;">
  
  <div class="d-flex justify-between items-center mb-4">
    <div>
      <h1 class="text-xl">Team Overview</h1>
      <p class="text-sm text-muted" style="margin-top: 4px;">Manage your team members.</p>
    </div>
    <button class="btn-primary" (click)="openForm()">
      <span class="material-icons" style="font-size: 18px;">add</span> 
      <span style="font-weight: 500;">New Member</span>
    </button>
  </div>

  <div class="d-flex gap-3 mb-4">
    <div style="position: relative; flex: 1; max-width: 320px;">
      <span class="material-icons" style="position: absolute; left: 12px; top: 10px; font-size: 20px; color: #6B6B75;">search</span>
      <input type="text" [(ngModel)]="searchTerm" (input)="filter()" 
             placeholder="Search by name..." 
             style="padding-left: 42px; background: #0E0E10; border: 1px solid #2A2A2E; color: white; height: 40px; width: 100%; border-radius: 8px;">
    </div>
    
    <select [(ngModel)]="filterDept" (change)="filter()" 
            style="width: 180px; background: #0E0E10; border: 1px solid #2A2A2E; color: white; height: 40px; border-radius: 8px; padding: 0 12px;">
      <option value="">All Departments</option>
      <option>Engineering</option><option>Design</option><option>HR</option><option>Product</option>
    </select>
  </div>

  <div style="background: #0E0E10; border: 1px solid #1F1F23; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.5);">
    
    <div style="display: grid; grid-template-columns: 2.5fr 1.5fr 1fr 100px; padding: 14px 24px; border-bottom: 1px solid #1F1F23; background: #16161A;">
      <div class="text-xs text-muted font-medium uppercase">Employee</div>
      <div class="text-xs text-muted font-medium uppercase">Role & Dept</div>
      <div class="text-xs text-muted font-medium uppercase">Status</div>
      <div class="text-xs text-muted font-medium uppercase text-right">Actions</div>
    </div>

    <div *ngFor="let emp of filteredEmployees" 
         style="display: grid; grid-template-columns: 2.5fr 1.5fr 1fr 100px; padding: 16px 24px; border-bottom: 1px solid #1F1F23; align-items: center; transition: background 0.2s;"
         onmouseover="this.style.background='#16161A'" 
         onmouseout="this.style.background='transparent'">
      
      <div class="d-flex items-center gap-3">
        <div style="width: 40px; height: 40px; background: #222225; border: 1px solid #333; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #EAEAF0; font-weight: 600; font-size: 14px;">
          {{emp.firstName[0]}}{{emp.lastName[0]}}
        </div>
        <div>
          <div style="color: #EAEAF0; font-weight: 500; font-size: 0.95rem;">{{emp.firstName}} {{emp.lastName}}</div>
          <div style="color: #6B6B75; font-size: 0.8rem;">{{emp.email}}</div>
        </div>
      </div>

      <div>
        <div style="color: #EAEAF0; font-size: 0.9rem;">{{emp.role}}</div>
        <div style="color: #6B6B75; font-size: 0.8rem;">{{emp.department}}</div>
      </div>

      <div>
        <span [style.background]="emp.status === 'Active' ? 'rgba(0, 200, 150, 0.15)' : 'rgba(255, 77, 77, 0.15)'"
              [style.color]="emp.status === 'Active' ? '#00C896' : '#FF4D4D'"
              [style.border]="emp.status === 'Active' ? '1px solid rgba(0, 200, 150, 0.2)' : '1px solid rgba(255, 77, 77, 0.2)'"
              style="padding: 4px 10px; border-radius: 100px; font-size: 0.75rem; font-weight: 500; display: inline-flex; align-items: center; gap: 6px;">
          <span [style.background]="emp.status === 'Active' ? '#00C896' : '#FF4D4D'" style="width: 6px; height: 6px; border-radius: 50%;"></span>
          {{emp.status}}
        </span>
      </div>

      <div class="d-flex justify-end gap-2">
        <button class="btn-icon" (click)="openForm(emp)" title="Edit">
          <span class="material-icons" style="font-size: 18px;">edit</span>
        </button>
        <button class="btn-icon danger" (click)="delete(emp.id)" title="Delete">
          <span class="material-icons" style="font-size: 18px;">delete</span>
        </button>
      </div>

    </div>

    <div *ngIf="filteredEmployees.length === 0" style="padding: 60px; text-align: center;">
      <span class="material-icons" style="font-size: 48px; color: #2A2A2E; margin-bottom: 12px;">search_off</span>
      <p style="color: #6B6B75;">No team members found.</p>
    </div>

  </div>
</div>

<app-employee-form *ngIf="showForm" [employee]="selectedEmployee" (close)="showForm = false" (saved)="onSave()"></app-employee-form>
EOF

# 2. UPDATE STYLES (Helper Utilities)
# Ensure our utilities are bulletproof
cat << 'EOF' >> src/styles.css

/* UTILITIES (Appended via script) */
.text-xl { font-size: 1.5rem; font-weight: 600; color: var(--text-primary); }
.text-sm { font-size: 0.875rem; }
.text-xs { font-size: 0.75rem; }
.text-muted { color: var(--text-muted); }
.font-medium { font-weight: 500; }
.uppercase { text-transform: uppercase; letter-spacing: 0.05em; }
.text-right { text-align: right; }

.d-flex { display: flex; }
.items-center { align-items: center; }
.justify-between { justify-content: space-between; }
.justify-end { justify-content: flex-end; }
EOF

echo "✅ Layout Fixed: Switched from Table to CSS Grid."
