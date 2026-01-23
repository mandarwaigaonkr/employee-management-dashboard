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
    <div class="container animate-slide-in" style="max-width: 600px;">
      <div class="mat-card">
        <h2 class="mb-4">{{isEdit ? 'Edit Profile' : 'New Team Member'}}</h2>
        
        <form [formGroup]="form" (ngSubmit)="submit()">
          <div class="row g-3 mb-3">
            <div class="col-md-6">
              <label class="small text-muted-custom mb-1">First Name</label>
              <input type="text" class="mat-input" formControlName="firstName" placeholder="e.g. John">
            </div>
            <div class="col-md-6">
              <label class="small text-muted-custom mb-1">Last Name</label>
              <input type="text" class="mat-input" formControlName="lastName" placeholder="e.g. Doe">
            </div>
          </div>

          <div class="mb-3">
            <label class="small text-muted-custom mb-1">Email</label>
            <input type="email" class="mat-input" formControlName="email" placeholder="john@company.com">
          </div>

          <div class="row g-3 mb-3">
            <div class="col-md-6">
              <label class="small text-muted-custom mb-1">Department</label>
              <select class="mat-input" formControlName="department">
                <option>Engineering</option><option>Design</option><option>Product</option><option>HR</option>
              </select>
            </div>
            <div class="col-md-6">
              <label class="small text-muted-custom mb-1">Role</label>
              <input type="text" class="mat-input" formControlName="role" placeholder="e.g. Developer">
            </div>
          </div>

          <div class="mb-4">
             <label class="small text-muted-custom mb-1">Status</label>
             <div class="d-flex gap-3 mt-1">
               <label class="d-flex align-items-center gap-2" style="cursor:pointer">
                 <input type="radio" formControlName="status" value="Active"> Active
               </label>
               <label class="d-flex align-items-center gap-2" style="cursor:pointer">
                 <input type="radio" formControlName="status" value="Inactive"> Inactive
               </label>
             </div>
          </div>

          <div class="d-flex justify-content-end gap-2 mt-5">
            <a routerLink="/" class="btn btn-mat-ghost text-decoration-none py-2 px-4 rounded-pill">Cancel</a>
            <button type="submit" [disabled]="form.invalid" class="btn-mat">Save Changes</button>
          </div>
        </form>
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
