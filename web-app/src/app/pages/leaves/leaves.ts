import { Component, inject } from '@angular/core';
import { LeaveService } from '../../services/leave-service';
import { PagedData } from '../../interfaces/paged-data';
import { ILeave, LeaveStatus, LeaveType } from '../../interfaces/ileave';
import { Table } from '../../components/table/table';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-leaves',
  imports: [Table],
  templateUrl: './leaves.html',
  styleUrl: './leaves.scss',
})
export class Leaves {
  leaveService = inject(LeaveService);
  authService = inject(AuthService);
  showCol = [
    'id',
    {
      key: 'type',
      format: (rowData: ILeave) => {
        switch (rowData.type) {
          case LeaveType.Casual:
            return 'Casual Leave';
          case LeaveType.Sick:
            return 'Sick Leave';
          case LeaveType.Earned:
            return 'Earned Leave';
        }
      },
    },
    'reason',
    'leaveDate',
    {
      key: 'status',
      format: (rowData: ILeave) => {
        switch (rowData.status) {
          case LeaveStatus.Pending:
            return 'Pending';
          case LeaveStatus.Accepted:
            return 'Accepted';
          case LeaveStatus.Rejected:
            return 'Rejected';
          case LeaveStatus.Cancelled:
            return 'Cancelled';
        }
      },
    },
    {
      key: 'action',
      format: (rowData: ILeave) => {
        if (this.authService.isEmployee) {
          if (rowData.status == LeaveStatus.Pending) return ['Cancel'];
          else return [];
        } else {
          if (rowData.status == LeaveStatus.Pending)
            return ['Reject', 'Accept'];
          else return [];
        }
      },
    },
  ];
  filter = {
    pageIndex: 0,
    pageSize: 5,
  };
  ngOnInit() {
    this.getLeaveData();
  }

  data!: PagedData<ILeave>;
  getLeaveData() {
    this.leaveService.getLeaves(this.filter).subscribe((result) => {
      console.log(result);
      this.data = result;
    });
  }

  pageChange(event: any) {
    console.log(event);
    this.filter.pageIndex = event.pageIndex;
    this.getLeaveData();
  }

  onRowClick(event: any) {
    console.log(event);
    switch (event.btn) {
      case 'Cancel':
        this.leaveService
          .updateLeaveStatus(event.rowData.id, LeaveStatus.Cancelled)
          .subscribe(() => {
            alert('Leave request has cancelled');
            this.getLeaveData();
          });
        break;
      case 'Accept':
        this.leaveService
          .updateLeaveStatus(event.rowData.id, LeaveStatus.Accepted)
          .subscribe(() => {
            alert('Leave request has accepted');
            this.getLeaveData();
          });
        break;
      case 'Reject':
        this.leaveService
          .updateLeaveStatus(event.rowData.id, LeaveStatus.Rejected)
          .subscribe(() => {
            alert('Leave request has rejected');
            this.getLeaveData();
          });
        break;
    }
  }
}
