export interface ILeave {
  type: LeaveType;
  reson: string;
  leaveDate: string;
  status: LeaveStatus;
  employeeId?: number;
  employeeName?: string;
}

export enum LeaveType {
  Sick = 1,
  Casual = 2,
  Earned = 3,
}

export enum LeaveStatus {
  Pending = 0,
  Accepted = 1,
  Rejected = 2,
  Cancelled = 3,
}
