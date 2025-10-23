import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Departments } from './pages/departments/departments';
import { Employee } from './pages/employee/employee';
import { Login } from './pages/login/login';
import { EmployeeDashboard } from './pages/employee-dashboard/employee-dashboard';
import { Profile } from './pages/profile/profile';
import { Leaves } from './pages/leaves/leaves';
import { Attendance } from './pages/attendance/attendance';

export const routes: Routes = [
  {path : "", component : Home},
  {path : "employee-dashboard", component : EmployeeDashboard},
  {path : "departments", component : Departments},
  {path : "employee" , component : Employee },
  {path : "login" , component : Login },
  {path : "profile" , component : Profile },
  {path : "leaves" , component : Leaves },
  {path : "attendance", component : Attendance },
  {path : "attendance/:id", component : Attendance },
];
