import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';

interface DepartmentGroup {
  name: string;
  employees: Employee[];
}

@Component({
  selector: 'app-department-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="animate-enter" style="max-width: 1200px; margin: 0 auto;">
      
      <div class="mb-4">
        <h1 class="text-xl">Departments</h1>
        <p class="text-sm text-muted" style="margin-top: 4px;">Team breakdown by department.</p>
      </div>

      <div class="dept-grid">
        <div *ngFor="let dept of groupedDepartments" class="dept-card">
          
          <div class="dept-header">
            <div class="d-flex items-center gap-2">
              <span class="material-icons dept-icon">domain</span>
              <h2 class="dept-name">{{dept.name}}</h2>
            </div>
            <span class="count-badge">{{dept.employees.length}} members</span>
          </div>

          <div class="emp-list">
            <div *ngFor="let emp of dept.employees" class="emp-item">
              <div class="avatar-sm">{{emp.firstName[0]}}{{emp.lastName[0]}}</div>
              <div style="flex: 1; min-width: 0;">
                <div class="emp-name text-truncate">{{emp.firstName}} {{emp.lastName}}</div>
                <div class="emp-role text-truncate">{{emp.role}}</div>
              </div>
              <div class="status-dot" [class.active]="emp.status === 'Active'"></div>
            </div>
            
            <div *ngIf="dept.employees.length === 0" class="empty-dept">
              No members yet.
            </div>
          </div>

        </div>
      </div>

    </div>
  `,
  styles: [`
    /* GRID LAYOUT */
    .dept-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 24px;
    }

    /* CARD STYLING */
    .dept-card {
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: 12px;
      overflow: hidden;
      display: flex; flex-direction: column;
      height: 100%;
    }

    /* HEADER STYLING */
    .dept-header {
      padding: 16px 20px;
      background: var(--bg-elevated);
      border-bottom: 1px solid var(--border-subtle);
      display: flex; justify-content: space-between; align-items: center;
    }
    .dept-icon { color: var(--accent); font-size: 20px; }
    .dept-name { font-size: 1rem; font-weight: 600; color: var(--text-primary); margin: 0; }
    .count-badge { 
      font-size: 0.75rem; color: var(--text-muted); 
      background: rgba(255,255,255,0.05); padding: 2px 8px; border-radius: 100px; 
    }

    /* LIST STYLING */
    .emp-list { padding: 12px; flex: 1; }
    
    .emp-item {
      display: flex; align-items: center; gap: 12px;
      padding: 10px; border-radius: 8px;
      transition: background 0.2s;
    }
    .emp-item:hover { background: var(--bg-elevated); }

    .avatar-sm {
      width: 32px; height: 32px; background: #222; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 12px; font-weight: 600; color: var(--text-secondary);
      border: 1px solid var(--border-medium);
    }
    
    .emp-name { font-size: 0.9rem; font-weight: 500; color: var(--text-primary); }
    .emp-role { font-size: 0.8rem; color: var(--text-muted); }

    .text-truncate { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    
    .status-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--border-medium); }
    .status-dot.active { background: var(--success); box-shadow: 0 0 8px rgba(0,200,150,0.4); }

    .empty-dept { padding: 20px; text-align: center; font-size: 0.85rem; color: var(--text-muted); font-style: italic; }

    /* UTILS */
    .d-flex { display: flex; }
    .items-center { align-items: center; }
    .gap-2 { gap: 8px; }
    .text-xl { font-size: 1.5rem; font-weight: 600; color: var(--text-primary); margin: 0; }
    .text-sm { font-size: 0.875rem; }
    .text-muted { color: var(--text-muted); }
  `]
})
export class DepartmentListComponent implements OnInit {
  groupedDepartments: DepartmentGroup[] = [];
  
  // Define known departments to ensure they appear even if empty (optional)
  private knownDepts = ['Engineering', 'Design', 'Product', 'HR', 'Sales'];

  constructor(private service: EmployeeService) {}

  ngOnInit() {
    this.service.getEmployees().subscribe(employees => {
      // 1. Initialize groups
      const groups: { [key: string]: Employee[] } = {};
      this.knownDepts.forEach(d => groups[d] = []);

      // 2. Sort employees into groups
      employees.forEach(emp => {
        if (!groups[emp.department]) groups[emp.department] = [];
        groups[emp.department].push(emp);
      });

      // 3. Convert to array format for template
      this.groupedDepartments = Object.keys(groups).map(deptName => ({
        name: deptName,
        employees: groups[deptName]
      }));
    });
  }
}
