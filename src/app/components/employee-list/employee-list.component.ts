import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';
import { HighlightSalaryDirective } from '../../directives/highlight-salary.directive';

interface DashboardMetric {
  title: string;
  value: string;
  helper: string;
  icon: string;
}

interface DepartmentInsight {
  department: string;
  count: number;
  share: number;
  avgSalary: number;
  color: string;
}

interface SalaryBandInsight {
  label: string;
  count: number;
  share: number;
  color: string;
}

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    HighlightSalaryDirective,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css'
})
export class EmployeeListComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns: string[] = ['name', 'department', 'role', 'salary', 'actions'];
  dataSource = new MatTableDataSource<Employee>([]);
  departments: string[] = ['All', 'Engineering', 'HR', 'Marketing', 'Sales', 'Finance'];
  selectedDepartment = 'All';
  searchQuery = '';

  metrics: DashboardMetric[] = [];
  departmentInsights: DepartmentInsight[] = [];
  salaryBandInsights: SalaryBandInsight[] = [];
  topEarners: Employee[] = [];
  departmentPieGradient = 'conic-gradient(#1f2937 0deg 360deg)';
  filteredCount = 0;

  private readonly departmentPalette = ['#38bdf8', '#34d399', '#f97316', '#facc15', '#f472b6', '#60a5fa'];
  private destroy$ = new Subject<void>();
  private viewInitialized = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private employeeService: EmployeeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.refreshDashboard([]);
    this.loadEmployees();
  }

  ngAfterViewInit(): void {
    this.viewInitialized = true;
    this.configureTableControls();
  }

  loadEmployees(): void {
    this.employeeService
      .getEmployees()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.dataSource.data = data;
          this.configureTableControls();
          this.applyFilter();
        },
        error: () => {
          this.dataSource.data = [];
          this.refreshDashboard([]);
        }
      });
  }

  applyFilter(): void {
    const search = this.searchQuery.trim().toLowerCase();

    this.dataSource.filterPredicate = (data: Employee, _: string) => {
      const searchMatch =
        data.name.toLowerCase().includes(search) ||
        data.role.toLowerCase().includes(search) ||
        data.email.toLowerCase().includes(search);
      const deptMatch = this.selectedDepartment === 'All' || data.department === this.selectedDepartment;
      return searchMatch && deptMatch;
    };

    this.dataSource.filter = `${search}|${this.selectedDepartment}`;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

    this.refreshDashboard(this.dataSource.filteredData);
  }

  deleteEmployee(id: string | number): void {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.employeeService
        .deleteEmployee(id)
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

  trackByDepartment(_: number, insight: DepartmentInsight): string {
    return insight.department;
  }

  trackByBand(_: number, band: SalaryBandInsight): string {
    return band.label;
  }

  trackByEmployee(_: number, employee: Employee): string | number {
    return employee.id;
  }

  trackByMetric(_: number, metric: DashboardMetric): string {
    return metric.title;
  }

  private refreshDashboard(filteredEmployees: Employee[]): void {
    const employees = filteredEmployees;
    const total = employees.length;

    this.filteredCount = total;
    this.topEarners = [...employees]
      .sort((a, b) => Number(b.salary) - Number(a.salary))
      .slice(0, 4);

    if (!total) {
      this.metrics = [
        { title: 'Visible Employees', value: '0', helper: 'Try clearing filters', icon: 'filter_alt_off' },
        { title: 'Average Salary', value: '$0', helper: 'No matching records', icon: 'payments' },
        { title: 'Monthly Payroll', value: '$0', helper: 'Estimated from current view', icon: 'account_balance_wallet' }
      ];
      this.departmentInsights = [];
      this.salaryBandInsights = [];
      this.departmentPieGradient = 'conic-gradient(#1f2937 0deg 360deg)';
      return;
    }

    const totalSalary = employees.reduce((sum, employee) => sum + Number(employee.salary), 0);
    const averageSalary = totalSalary / total;
    const monthlyPayroll = totalSalary / 12;
    const highEarners = employees.filter((employee) => Number(employee.salary) >= 110000).length;

    this.metrics = [
      { title: 'Visible Employees', value: `${total}`, helper: `${highEarners} above 110K salary`, icon: 'groups_2' },
      { title: 'Average Salary', value: this.toCurrency(averageSalary), helper: 'Based on active filters', icon: 'payments' },
      {
        title: 'Monthly Payroll',
        value: this.toCurrency(monthlyPayroll),
        helper: `${this.toCurrency(totalSalary)} annual burn`,
        icon: 'account_balance_wallet'
      }
    ];

    const departmentMap = new Map<string, Employee[]>();
    for (const employee of employees) {
      if (!departmentMap.has(employee.department)) {
        departmentMap.set(employee.department, []);
      }
      departmentMap.get(employee.department)?.push(employee);
    }

    this.departmentInsights = Array.from(departmentMap.entries())
      .sort((a, b) => b[1].length - a[1].length)
      .map(([department, departmentEmployees], index) => {
        const count = departmentEmployees.length;
        const share = (count / total) * 100;
        const salaryPool = departmentEmployees.reduce((sum, employee) => sum + Number(employee.salary), 0);
        return {
          department,
          count,
          share,
          avgSalary: salaryPool / count,
          color: this.departmentPalette[index % this.departmentPalette.length]
        };
      });

    this.salaryBandInsights = this.buildSalaryBands(employees, total);
    this.departmentPieGradient = this.buildPieGradient();
  }

  private buildSalaryBands(employees: Employee[], total: number): SalaryBandInsight[] {
    const bands: SalaryBandInsight[] = [
      { label: 'High (>= 110K)', count: 0, share: 0, color: '#22d3ee' },
      { label: 'Mid (80K - 109K)', count: 0, share: 0, color: '#38bdf8' },
      { label: 'Core (< 80K)', count: 0, share: 0, color: '#f97316' }
    ];

    for (const employee of employees) {
      const salary = Number(employee.salary);
      if (salary >= 110000) {
        bands[0].count += 1;
      } else if (salary >= 80000) {
        bands[1].count += 1;
      } else {
        bands[2].count += 1;
      }
    }

    for (const band of bands) {
      band.share = (band.count / total) * 100;
    }

    return bands;
  }

  private buildPieGradient(): string {
    if (!this.departmentInsights.length) {
      return 'conic-gradient(#1f2937 0deg 360deg)';
    }

    const slices: string[] = [];
    let start = 0;

    for (const insight of this.departmentInsights) {
      const end = start + (insight.share / 100) * 360;
      slices.push(`${insight.color} ${start.toFixed(2)}deg ${end.toFixed(2)}deg`);
      start = end;
    }

    return `conic-gradient(${slices.join(', ')})`;
  }

  private toCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  }

  private configureTableControls(): void {
    if (!this.viewInitialized) {
      return;
    }

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
