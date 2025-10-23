import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { LeaveService } from '../../services/leave-service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-apply-leave',
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatIconModule,
  ],
  templateUrl: './apply-leave.html',
  styleUrl: './apply-leave.scss',
})
export class ApplyLeave {
  fb = inject(FormBuilder);
  leaveForm = this.fb.group({
    type: [, [Validators.required]],
    leaveDate: [, [Validators.required]],
    reason: [],
  });

  leaveService = inject(LeaveService);
  dialogRef = inject(MatDialogRef<ApplyLeave>);
  onSubmit() {
    if (this.leaveForm.invalid) {
      alert("Please select and provide all the fields");
    }
    let leave: any = this.leaveForm.value;
    this.leaveService
      .applyLeave(leave.type, leave.reason, leave.leaveDate)
      .subscribe((result) => {
        alert('Leave applied');
        this.dialogRef.close();
      });
  }
}
