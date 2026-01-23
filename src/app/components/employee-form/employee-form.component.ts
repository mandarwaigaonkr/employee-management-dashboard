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
