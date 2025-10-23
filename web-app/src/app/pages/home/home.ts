import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { DashboardService } from '../../services/dashboard-service';
import { IDashboard, IDepartmentData } from '../../interfaces/idashboard';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Table } from '../../components/table/table';
import { PagedData } from '../../interfaces/paged-data';
import { ILeave, LeaveStatus, LeaveType } from '../../interfaces/ileave';

@Component({
  selector: 'app-home',
  imports: [MatCardModule, BaseChartDirective, Table],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  dashboardService = inject(DashboardService);
  saleryForMonth!: number;
  employeeCount!: number;
  departmentCount!: number;
  departmentData!: IDepartmentData[];

  public barChartLegend = true;
  public barChartPlugins = [];
  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Employee Count',
      },
    ],
  };

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: false,
  };

  ngOnInit() {
    this.getTotalSalery();
    this.getEmployeeOnLeaveData();
    this.getDepartmentData();
  }

  getDepartmentData() {
    this.dashboardService.getDepartmentData().subscribe((res) => {
      console.log(res);
      this.barChartData.labels = res.map((x) => x.name);
      this.barChartData.datasets[0].data = res.map((x) => x.employeeCount);
      this.departmentData = res;
    });
  }

  getTotalSalery() {
    this.dashboardService.getDashboardData().subscribe((res: IDashboard) => {
      console.log(res);
      this.saleryForMonth = res.totalSalery;
      this.employeeCount = res.employeeCount;
      this.departmentCount = res.departmentCount;
    });
  }

  getEmployeeOnLeaveData() {
    this.dashboardService.getTodayOnLeaveData().subscribe((result) => {
      console.log(result);
      this.leaveData = {
        data: result,
        totalData: result.length,
      };
    });
  }

  leaveData!: PagedData<ILeave>;
  showCol = [
    'employeeName',
    'reason',
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
  ];
}
