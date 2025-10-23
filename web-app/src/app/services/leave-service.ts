import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ILeave } from '../interfaces/ileave';
import { PagedData } from '../interfaces/paged-data';
import { IAttendance } from '../interfaces/iattendance';

@Injectable({
  providedIn: 'root',
})
export class LeaveService {
  apiURL = 'https://localhost:7218';
  http = inject(HttpClient);

  applyLeave(type: number, reason: string, leaveDate: string) {
    return this.http.post(`${this.apiURL}/api/Leave/apply`, {
      type,
      reason,
      leaveDate,
    });
  }

  getLeaves(filter: any) {
    var params = new HttpParams({ fromObject: filter });
    return this.http.get<PagedData<ILeave>>(
      `${this.apiURL}/api/Leave?${params.toString()}`
    );
  }

  updateLeaveStatus(id: number, status: number) {
    return this.http.post(`${this.apiURL}/api/Leave/update-status`, {
      id,
      status,
    });
  }

  markPresent() {
    return this.http.post(`${this.apiURL}/api/Attendance/mark-present`, {});
  }

  getAttendanceHistory(filter : any){
    var params = new HttpParams({ fromObject: filter });
    return this.http.get<PagedData<IAttendance>>(
      `${this.apiURL}/api/Attendance?${params.toString()}`
    );
  }


}
