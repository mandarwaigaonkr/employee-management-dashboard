import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './employee-list.component.html'
})
export class EmployeeListComponent implements OnInit {
  // Define the property, but don't assign it yet
  employees$;

  constructor(private service: EmployeeService) {
    // FIX: Assign it INSIDE the constructor, where 'this.service' is ready
    this.employees$ = this.service.getEmployees();
  }

  ngOnInit() {}

  delete(id: number) {
    if(confirm('Are you sure?')) this.service.deleteEmployee(id);
  }
}
