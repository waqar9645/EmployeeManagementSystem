import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IEmployee } from '../interfaces/iemployee';
import { PagedData } from '../interfaces/paged-data';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  apiURL = 'https://localhost:7218';
  http = inject(HttpClient);
  
  constructor() { }

  getEmployeeList(filter:any) {
    var params = new HttpParams({fromObject : filter });
    return this.http.get<PagedData<IEmployee>>(`${this.apiURL}/api/Employee?${params.toString()}`);
  }

  getEmployeeById(id: number) {
    return this.http.get<IEmployee>(`${this.apiURL}/api/Employee/${id}`);
  }

  addEmployee(employee: IEmployee) {
    return this.http.post(`${this.apiURL}/api/Employee`, employee);
  }

  editEmployee(id: number , employee: IEmployee) {
    return this.http.put(`${this.apiURL}/api/Employee/${id}`, employee);
  }

  deleteEmployee(id: number) {
    return this.http.delete(`${this.apiURL}/api/Employee/${id}`);
  }

}