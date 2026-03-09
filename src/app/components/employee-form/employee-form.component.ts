import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatCardModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule
  ],
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.css'
})
export class EmployeeFormComponent implements OnInit, OnDestroy {
  employeeForm: FormGroup;
  isEditMode = false;
  isSubmitting = false;
  loadError = false;
  employeeId: string | null = null;
  departments = ['Engineering', 'HR', 'Marketing', 'Sales', 'Finance'];
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.employeeForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      department: ['', Validators.required],
      role: ['', Validators.required],
      salary: ['', [Validators.required, Validators.min(1000)]],
      dateJoined: [new Date().toISOString().substring(0, 10)]
    });
  }

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.paramMap.get('id');
    if (this.employeeId) {
      this.isEditMode = true;
      this.employeeService.getEmployeeById(this.employeeId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (emp) => {
            this.employeeForm.patchValue(emp);
          },
          error: () => {
            this.loadError = true;
          }
        });
    }
  }

  onSubmit(): void {
    if (this.employeeForm.invalid || this.isSubmitting) {
      this.employeeForm.markAllAsTouched();
      return;
    }

    const payload = this.createPayload();
    this.isSubmitting = true;

    if (this.isEditMode && this.employeeId) {
      this.employeeService.updateEmployee(this.employeeId, payload)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.router.navigate(['/employees']);
          },
          error: () => {
            this.isSubmitting = false;
          }
        });
      return;
    }

    this.employeeService.addEmployee(payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.router.navigate(['/employees']);
        },
        error: () => {
          this.isSubmitting = false;
        }
      });
  }

  onCancel(): void {
    this.router.navigate(['/employees']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createPayload(): Employee {
    const formValue = this.employeeForm.value;

    return {
      id: this.employeeId ?? this.createEmployeeId(),
      name: String(formValue.name).trim(),
      email: String(formValue.email).trim().toLowerCase(),
      department: String(formValue.department),
      role: String(formValue.role).trim(),
      salary: Number(formValue.salary),
      dateJoined: String(formValue.dateJoined)
    };
  }

  private createEmployeeId(): string {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    return `emp-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  }
}
