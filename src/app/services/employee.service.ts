import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Employee } from '../models/employee.model';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private employees: Employee[] = [
    { id: 1, firstName: 'Liam', lastName: 'Novak', email: 'liam@novak.dev', role: 'Frontend Lead', department: 'Engineering', status: 'Active' },
    { id: 2, firstName: 'Emma', lastName: 'Clarke', email: 'emma@design.io', role: 'UX Researcher', department: 'Design', status: 'Active' },
    { id: 3, firstName: 'Noah', lastName: 'Reddy', email: 'noah@prod.net', role: 'Product Manager', department: 'Product', status: 'Inactive' },
    { id: 4, firstName: 'Sarah', lastName: 'Jenkins', email: 'sarah@hr.com', role: 'Talent Acquisition', department: 'HR', status: 'Active' }
  ];
  private sub = new BehaviorSubject<Employee[]>(this.employees);

  getEmployees() { return this.sub.asObservable(); }
  
  getEmployee(id: number) { return this.employees.find(e => e.id === id); }

  addEmployee(emp: Employee) {
    emp.id = Math.max(0, ...this.employees.map(e => e.id)) + 1;
    this.employees = [emp, ...this.employees]; // Add to top
    this.sub.next(this.employees);
  }

  updateEmployee(emp: Employee) {
    const idx = this.employees.findIndex(e => e.id === emp.id);
    if (idx !== -1) {
      this.employees[idx] = emp;
      this.sub.next([...this.employees]);
    }
  }

  deleteEmployee(id: number) {
    this.employees = this.employees.filter(e => e.id !== id);
    this.sub.next([...this.employees]);
  }
}
