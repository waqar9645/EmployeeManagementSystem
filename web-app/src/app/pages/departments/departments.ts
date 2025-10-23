import { Component, inject } from '@angular/core';
import { DepartmentService } from '../../services/department-service';
import { IDepartment } from '../../interfaces/idepartment';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { PagedData } from '../../interfaces/paged-data';
import { Table } from '../../components/table/table';

@Component({
  selector: 'app-departments',
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    Table
  ],
  templateUrl: './departments.html',
  styleUrl: './departments.scss',
})
export class Departments {
  departments!: PagedData<IDepartment>;
  httpService = inject(DepartmentService);
  isFormOpen = false;
  showCol = ['id', 'name', 'action'];
  filter ={
    pageIndex : 0,
    pageSize : 2
  }

  ngOnInit() {
    this.getDepartmentList();
  }
  getDepartmentList() {
    this.httpService.getDepartments(this.filter).subscribe((res) => {
      console.log(res);
      this.departments = res;
    });
  }

  departmentName!: string;
  addDeaprtment() {
    console.log(this.departmentName);
    this.httpService.addDepartment(this.departmentName).subscribe(() => {
      alert('Department Added Successfully');
      this.isFormOpen = false;
      this.getDepartmentList();
    });
  }
  editId = 0;
  editDepartment(department: IDepartment) {
    this.departmentName = department.name;
    this.isFormOpen = true;
    this.editId = department.id;
  }
  updateDepartment() {
    this.httpService
      .updateDepartment(this.editId, this.departmentName)
      .subscribe(() => {
        alert('Department Updated Successfully');
        this.isFormOpen = false;
        this.getDepartmentList();
        this.editId = 0;
      });
  }
  deleteDepartment(department:IDepartment) {
    this.httpService.deleteDepartment(department.id).subscribe(() => {
      alert('Department Deleted Successfully');
      this.getDepartmentList();
    });
  }

  pageChange(event:any){
    console.log(event)
    this.filter.pageIndex = event.pageIndex;
    this.getDepartmentList();
  }

}
