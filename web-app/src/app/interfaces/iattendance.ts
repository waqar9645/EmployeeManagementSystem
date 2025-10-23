export interface IAttendance{
  date : string,
  type : AttendanceType
}

export enum AttendanceType{
  Present = 1,
  Leave = 2
}