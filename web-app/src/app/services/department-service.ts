import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IDepartment } from '../interfaces/idepartment';
import { filter } from 'rxjs';
import { PagedData } from '../interfaces/paged-data';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  apiURL = 'https://localhost:7218';
  http = inject(HttpClient);

  constructor() {}

  getDepartments(filter: any) {
    var params = new HttpParams({ fromObject: filter });
    return this.http.get<PagedData<IDepartment>>(
      `${this.apiURL}/api/Department?${params}`
    );
  }
  addDepartment(name: string) {
    return this.http.post(`${this.apiURL}/api/Department`, {
      name: name,
    });
  }
  updateDepartment(id: number, name: string) {
    return this.http.put(`${this.apiURL}/api/Department/${id}`, {
      id: id,
      name: name,
    });
  }
  deleteDepartment(id: number) {
    return this.http.delete(`${this.apiURL}/api/Department/${id}`);
  }
}
