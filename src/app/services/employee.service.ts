import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Employee } from '../models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private employees: Employee[] = [
    { id: 1, firstName: 'Liam', lastName: 'Novak', email: 'liam@company.com', role: 'Frontend Dev', department: 'Engineering', status: 'Active' },
    { id: 2, firstName: 'Emma', lastName: 'Clarke', email: 'emma@company.com', role: 'UI Designer', department: 'Design', status: 'Active' },
    { id: 3, firstName: 'Noah', lastName: 'Rodriguez', email: 'noah@company.com', role: 'Product Manager', department: 'Product', status: 'Inactive' }
  ];

  private employeesSubject = new BehaviorSubject<Employee[]>(this.employees);

  getEmployees(): Observable<Employee[]> {
    return this.employeesSubject.asObservable();
  }

  getEmployee(id: number): Employee | undefined {
    return this.employees.find(e => e.id === id);
  }

  addEmployee(employee: Employee) {
    employee.id = this.employees.length > 0 ? Math.max(...this.employees.map(e => e.id)) + 1 : 1;
    this.employees.push(employee);
    this.employeesSubject.next([...this.employees]);
  }

  updateEmployee(updatedEmployee: Employee) {
    const index = this.employees.findIndex(e => e.id === updatedEmployee.id);
    if (index !== -1) {
      this.employees[index] = updatedEmployee;
      this.employeesSubject.next([...this.employees]);
    }
  }

  deleteEmployee(id: number) {
    this.employees = this.employees.filter(e => e.id !== id);
    this.employeesSubject.next([...this.employees]);
  }
}
