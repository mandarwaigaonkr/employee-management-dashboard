import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';
import { DepartmentFilterPipe } from '../../pipes/department-filter.pipe';
import { HighlightSalaryDirective } from '../../directives/highlight-salary.directive';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    CommonModule, RouterModule, FormsModule,
    DepartmentFilterPipe, HighlightSalaryDirective,
    MatTableModule, MatPaginatorModule, MatSortModule,
    MatButtonModule, MatIconModule, MatFormFieldModule,
    MatInputModule, MatSelectModule
  ],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css'
})
export class EmployeeListComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['name', 'department', 'role', 'salary', 'actions'];
  dataSource = new MatTableDataSource<Employee>([]);
  departments: string[] = ['All', 'Engineering', 'HR', 'Marketing', 'Sales', 'Finance'];
  selectedDepartment: string = 'All';
  searchQuery: string = '';
  
  private destroy$ = new Subject<void>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private employeeService: EmployeeService, private router: Router) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.employeeService.getEmployees()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.applyFilter();
      });
  }

  applyFilter() {
    this.dataSource.filterPredicate = (data: Employee, filter: string) => {
      const searchMatch = data.name.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
                          data.role.toLowerCase().includes(this.searchQuery.toLowerCase());
      const deptMatch = this.selectedDepartment === 'All' || data.department === this.selectedDepartment;
      return searchMatch && deptMatch;
    };
    this.dataSource.filter = Math.random().toString();
  }

  deleteEmployee(id: string | number): void {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.employeeService.deleteEmployee(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.loadEmployees();
        });
    }
  }

  viewEmployee(id: string | number): void {
    this.router.navigate(['/employee', id]);
  }

  editEmployee(id: string | number): void {
    this.router.navigate(['/edit-employee', id]);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
