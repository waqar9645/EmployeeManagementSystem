import { Component, inject } from '@angular/core';
import { EmployeeService } from '../../services/employee-service';
import { Table } from '../../components/table/table';
import { IEmployee } from '../../interfaces/iemployee';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { EmployeeForm } from './employee-form/employee-form';
import { MatInputModule } from '@angular/material/input';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { debounceTime } from 'rxjs';
import { PagedData } from '../../interfaces/paged-data';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee',
  imports: [
    Table,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule,
    MatFormFieldModule
  ],
  templateUrl: './employee.html',
  styleUrl: './employee.scss',
})
export class Employee {
  employyeservice = inject(EmployeeService);
  pagedEmployeeData!: PagedData<IEmployee>;
  showCol = ['id', 'name', 'email', 'phone', 'jobTitle', {
    key:'action',
    format:()=>{
      return ["Edit","Delete","Attendance"]
    }
  }];
  filter: any = {
    pageIndex:0,
    pageSize:2
  };
  router = inject(Router)

  constructor() {}

  ngOnInit() {
    this.getLatestemployeeData();
    this.searchControl.valueChanges
      .pipe(debounceTime(500))
      .subscribe((res: String | null) => {
        console.log(res);
        this.filter.search = res;
        this.filter.pageIndex = 0;
        this.getLatestemployeeData();
      });
  }

  searchControl = new FormControl('');

  totalData! : number;
  getLatestemployeeData() {
    this.employyeservice.getEmployeeList(this.filter).subscribe((result) => {
      console.log(result);
      this.pagedEmployeeData = result;
    });
  }

  addEmployee() {
    this.openDialog();
  }

  readonly dialog = inject(MatDialog);
  openDialog() {
    let ref = this.dialog.open(EmployeeForm, {
      panelClass: 'm-auto',
    });
    ref.afterClosed().subscribe((result) => {
      this.getLatestemployeeData();
    });
  }

  pageChange(event:any){
    console.log(event)
    this.filter.pageIndex = event.pageIndex;
    this.getLatestemployeeData();
  }


  editEmployee(employee: IEmployee) {
    console.log('Edit Employee', employee);
    let ref = this.dialog.open(EmployeeForm, {
      panelClass: 'm-auto',
      data: { employeeId: employee.id },
    });
    ref.afterClosed().subscribe((result) => {
      this.getLatestemployeeData();
    });
  }

  deleteEmployee(employee: IEmployee) {
    console.log('Delete Employee', employee);
    this.employyeservice.deleteEmployee(employee.id).subscribe(() => {
      alert('Employee Deleted Successfully');
      this.getLatestemployeeData();
    });
  }

  onRowClick(event:any){
    if(event.btn==='Edit'){
      this.editEmployee(event.rowData);
    }
    else if(event.btn==='Delete'){
      this.deleteEmployee(event.rowData);
    }
    else if(event.btn==='Attendance'){
      this.router.navigateByUrl("/attendance/"+event.rowData.id)
    }
  }
  


}
