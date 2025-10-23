import { Component, inject } from '@angular/core';
import { Table } from '../../components/table/table';
import { LeaveService } from '../../services/leave-service';
import { AuthService } from '../../services/auth-service';
import { PagedData } from '../../interfaces/paged-data';
import { AttendanceType, IAttendance } from '../../interfaces/iattendance';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-attendance',
  imports: [Table],
  templateUrl: './attendance.html',
  styleUrl: './attendance.scss',
})
export class Attendance {
  leaveService = inject(LeaveService);
  authService = inject(AuthService);
  showCol = [
    {
      key: 'date',
      format: (rowData: IAttendance) => {
        let date = new Date(rowData.date);
        return (
          date.getDate() +
          '/' +
          (date.getMonth() + 1) +
          '/' +
          date.getFullYear()
        );
      },
    },
    {
      key: 'type',
      format: (rowData: IAttendance) => {
        switch (rowData.type) {
          case AttendanceType.Leave:
            return 'Leave';
          case AttendanceType.Present:
            return 'Present';
        }
      },
    },
  ];
  filter = {
    pageIndex: 0,
    pageSize: 5,
    employeeId: '',
  };
  data!: PagedData<IAttendance>;
  empId!: string;
  route = inject(ActivatedRoute);
  ngOnInit() {
    this.empId = this.route.snapshot.params['id'];
    this.getAttendanceData();
  }

  getAttendanceData() {
    if (this.empId) {
      this.filter.employeeId = this.empId;
    }
    this.leaveService.getAttendanceHistory(this.filter).subscribe((result) => {
      console.log(result);
      this.data = result;
    });
  }

  pageChange(event: any) {
    console.log(event);
    this.filter.pageIndex = event.pageIndex;
    this.getAttendanceData();
  }
}
