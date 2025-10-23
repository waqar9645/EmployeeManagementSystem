import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IDashboard, IDepartmentData } from '../interfaces/idashboard';
import { ILeave } from '../interfaces/ileave';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  apiURL = 'https://localhost:7218';
  http = inject(HttpClient);

  getDashboardData() {
    return this.http.get<IDashboard>(`${this.apiURL}/api/Dashboard/dashboard`);
  }

  getDepartmentData() {
    return this.http.get<IDepartmentData[]>(
      `${this.apiURL}/api/Dashboard/department-data`
    );
  }

  getTodayOnLeaveData() {
    return this.http.get<ILeave[]>(
      `${this.apiURL}/api/Dashboard/employee-leave-today`
    );
  }

}
