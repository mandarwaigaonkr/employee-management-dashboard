import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Employee } from '../models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  // THE REAL DATA
  private employees: Employee[] = [
    { 
      id: 1, 
      firstName: 'Mandar', 
      lastName: 'Waigaonkar', 
      email: 'waigaonkarmandar@gmail.com', 
      department: 'Engineering', 
      role: 'Tech Lead', 
      status: 'Active' 
    },
    { 
      id: 2, 
      firstName: 'Charushree', 
      lastName: '.S', 
      email: 'charushree.s@gmail.com', 
      department: 'Design', 
      role: 'Senior UX Designer', 
      status: 'Active' 
    },
    { 
      id: 3, 
      firstName: 'Sarthak', 
      lastName: 'Sharma', 
      email: 'sarthak@gmail.com', 
      department: 'Engineering', 
      role: 'Frontend Developer', 
      status: 'Active' 
    },
    { 
      id: 4, 
      firstName: 'Akshat', 
      lastName: 'Tiwari', 
      email: 'akshat@gmail.com', 
      department: 'Product', 
      role: 'Product Manager', 
      status: 'Active' 
    },
    { 
      id: 5, 
      firstName: 'Adithya', 
      lastName: 'Raj', 
      email: 'adithyaraj@gmail.com', 
      department: 'Engineering', 
      role: 'Backend Developer', 
      status: 'Inactive' 
    },
    { 
      id: 6, 
      firstName: 'Akhil', 
      lastName: 'Joji', 
      email: 'akhil.joji@gmail.com', 
      department: 'HR', 
      role: 'HR Specialist', 
      status: 'Active' 
    }
  ];

  private employeesSubject = new BehaviorSubject<Employee[]>(this.employees);

  constructor() { }

  getEmployees(): Observable<Employee[]> {
    return this.employeesSubject.asObservable();
  }

  getEmployeeById(id: number): Employee | undefined {
    return this.employees.find(e => e.id === id);
  }

  addEmployee(employee: Employee): void {
    employee.id = this.employees.length > 0 ? Math.max(...this.employees.map(e => e.id)) + 1 : 1;
    this.employees.unshift(employee); // Add to top of list
    this.employeesSubject.next([...this.employees]);
  }

  updateEmployee(updatedEmployee: Employee): void {
    const index = this.employees.findIndex(e => e.id === updatedEmployee.id);
    if (index !== -1) {
      this.employees[index] = updatedEmployee;
      this.employeesSubject.next([...this.employees]);
    }
  }

  deleteEmployee(id: number): void {
    this.employees = this.employees.filter(e => e.id !== id);
    this.employeesSubject.next([...this.employees]);
  }
}
