import { Injectable } from '@angular/core';
import { Employee } from '../models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  // Mock in-memory employee data
  private employees: Employee[] = [
    {
      id: 1,
      name: 'Amit Sharma',
      email: 'amit.sharma@company.com',
      department: 'Engineering',
      role: 'Software Engineer',
      salary: 75000,
      isActive: true,
      dateOfJoining: new Date('2022-01-15')
    },
    {
      id: 2,
      name: 'Priya Verma',
      email: 'priya.verma@company.com',
      department: 'HR',
      role: 'HR Manager',
      salary: 65000,
      isActive: true,
      dateOfJoining: new Date('2021-08-10')
    },
    {
      id: 3,
      name: 'Rahul Mehta',
      email: 'rahul.mehta@company.com',
      department: 'Finance',
      role: 'Accountant',
      salary: 60000,
      isActive: false,
      dateOfJoining: new Date('2020-05-01')
    }
  ];

  constructor() {}

  // READ: Get all employees
  getEmployees(): Employee[] {
    return this.employees;
  }

  // READ: Get employee by ID
  getEmployeeById(id: number): Employee | undefined {
    return this.employees.find(emp => emp.id === id);
  }

  // CREATE: Add new employee
  addEmployee(employee: Employee): void {
    const newId = this.employees.length
      ? Math.max(...this.employees.map(e => e.id)) + 1
      : 1;

    this.employees.push({
      ...employee,
      id: newId
    });
  }

  // UPDATE: Update existing employee
  updateEmployee(updatedEmployee: Employee): void {
    const index = this.employees.findIndex(
      emp => emp.id === updatedEmployee.id
    );

    if (index !== -1) {
      this.employees[index] = updatedEmployee;
    }
  }

  // DELETE: Remove employee
  deleteEmployee(id: number): void {
    this.employees = this.employees.filter(emp => emp.id !== id);
  }
}
