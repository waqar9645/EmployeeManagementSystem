import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ApplyLeave } from '../../components/apply-leave/apply-leave';
import { MatDialog } from '@angular/material/dialog';
import { LeaveService } from '../../services/leave-service';

@Component({
  selector: 'app-employee-dashboard',
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './employee-dashboard.html',
  styleUrl: './employee-dashboard.scss',
})
export class EmployeeDashboard {
  leaveService = inject(LeaveService);

  applyLeave() {
    this.openDialog();
  }

  readonly dialog = inject(MatDialog);
  openDialog() {
    let ref = this.dialog.open(ApplyLeave, {
      panelClass: 'm-auto',
    });
    ref.afterClosed().subscribe(() => {});
  }

  markAttendance() {
    this.leaveService.markPresent().subscribe({
      next: (result) => {
        alert('You are mark present for today');
      },
      error: (e: any) => {
        alert(e.error);
      },
    });
  }
}
