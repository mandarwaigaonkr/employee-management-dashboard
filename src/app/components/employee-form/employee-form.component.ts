import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card border-0 shadow-sm rounded-4 p-4">
            <h3 class="fw-bold mb-4">{{isEdit ? 'Edit' : 'New'}} Employee</h3>
            <form [formGroup]="form" (ngSubmit)="submit()">
              
              <div class="row mb-3">
                <div class="col">
                  <label class="form-label small text-muted">First Name</label>
                  <input type="text" class="form-control" formControlName="firstName">
                </div>
                <div class="col">
                  <label class="form-label small text-muted">Last Name</label>
                  <input type="text" class="form-control" formControlName="lastName">
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label small text-muted">Email Address</label>
                <input type="email" class="form-control" formControlName="email">
              </div>

              <div class="row mb-3">
                <div class="col">
                  <label class="form-label small text-muted">Department</label>
                  <select class="form-select" formControlName="department">
                    <option>Engineering</option><option>Design</option><option>Product</option><option>HR</option>
                  </select>
                </div>
                <div class="col">
                  <label class="form-label small text-muted">Role</label>
                  <input type="text" class="form-control" formControlName="role">
                </div>
              </div>

              <div class="mb-4">
                <label class="form-label small text-muted">Status</label>
                <select class="form-select" formControlName="status">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div class="d-grid gap-2">
                <button type="submit" [disabled]="form.invalid" class="btn btn-primary py-2">Save Employee</button>
                <a routerLink="/" class="btn btn-light py-2">Cancel</a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `
})
export class EmployeeFormComponent implements OnInit {
  form: FormGroup;
  isEdit = false;
  id: number | null = null;

  constructor(
    private fb: FormBuilder,
    private service: EmployeeService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      department: ['Engineering'],
      role: ['', Validators.required],
      status: ['Active']
    });
  }

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    if (this.id) {
      this.isEdit = true;
      const emp = this.service.getEmployee(this.id);
      if (emp) this.form.patchValue(emp);
    }
  }

  submit() {
    if (this.form.valid) {
      const data = { ...this.form.value, id: this.id || 0 };
      this.isEdit ? this.service.updateEmployee(data) : this.service.addEmployee(data);
      this.router.navigate(['/']);
    }
  }
}
