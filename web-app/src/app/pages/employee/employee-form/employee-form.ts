import { Component, inject, Input } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { IDepartment } from '../../../interfaces/idepartment';
import { DepartmentService } from '../../../services/department-service';
import { EmployeeService } from '../../../services/employee-service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-employee-form',
  imports: [
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatSelectModule,
    MatButtonModule,
    MatRadioModule,
    MatDatepickerModule,
    MatIconModule,
  ],
  templateUrl: './employee-form.html',
  styleUrl: './employee-form.scss',
})
export class EmployeeForm {
  fb = inject(FormBuilder);
  @Input() employeeId!: number;
  employeeForm = this.fb.group({
    id: [0],
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
    gender: [1, [Validators.required]],
    salery: [null, [Validators.required, Validators.min(0)]],
    departmentId: ['', [Validators.required]],
    jobTitle: ['', [Validators.required]],
    dateOfBirth: [null, [Validators.required]],
    joiningDate: [null, [Validators.required]],
    lastWorkingDate: [],
  });

  dialogRef = inject(MatDialogRef<EmployeeForm>);
  data = inject<EmployeeForm>(MAT_DIALOG_DATA);

  httpDepartmentService = inject(DepartmentService);
  httpEmployeeService = inject(EmployeeService);
  departments: IDepartment[] = [];
  ngOnInit() {
    this.httpDepartmentService
      .getDepartments({})
      .subscribe((deptsData) => {
        this.departments = deptsData.data;
        console.log(deptsData);
      });
    console.log('Employee ID', this.data);
    if (this.data) {
      this.httpEmployeeService
        .getEmployeeById(this.data.employeeId)
        .subscribe((empData) => {
          console.log(empData);
          this.employeeForm.patchValue(empData as any);
          this.employeeForm.get('dateOfBirth')?.disable();
          this.employeeForm.get('joiningDate')?.disable();
          this.employeeForm.get('gender')?.disable();
        });
    }
  }

  onSubmit() {
    if (this.data) {
      let value: any = this.employeeForm.value;
      this.httpEmployeeService
        .editEmployee(this.data.employeeId, value)
        .subscribe(() => {
          alert('Employee Updated successfully');
          this.employeeForm.reset();
          this.dialogRef.close();
        });
    } else {
      console.log(this.employeeForm.value);
      console.log('Valid', this.employeeForm.valid);
      let value: any = this.employeeForm.value;
      this.httpEmployeeService.addEmployee(value).subscribe(() => {
        alert('Employee added successfully');
        this.employeeForm.reset();
        this.dialogRef.close();
      });
    }
  }
}
