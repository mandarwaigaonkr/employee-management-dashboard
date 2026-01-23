import { Routes } from '@angular/router';
import { EmployeeListComponent } from './components/employee-list/employee-list.component';
import { DepartmentListComponent } from './components/department-list/department-list.component';

export const routes: Routes = [
    { path: '', component: EmployeeListComponent },
    { path: 'departments', component: DepartmentListComponent },
    { path: '**', redirectTo: '' }
];
