using EmployeeManagementSystem.DTOs;
using EmployeeManagementSystem.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeManagementSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardController : ControllerBase
    {
        private readonly IEmployeeService _employeeService;
        private readonly IDepartmentService _departmentService;
        private readonly ILeaveService _leaveService;

        public DashboardController(IEmployeeService employeeService , IDepartmentService departmentService , ILeaveService leaveService)
        {
            _employeeService = employeeService;
            _departmentService = departmentService;
            _leaveService = leaveService;
        }

        [HttpGet("dashboard")]
        [Authorize(Roles ="Admin")]
        public async Task<IActionResult> AdminDashboard()
        {
            var empList = await _employeeService.GetEmployeeListAsync();
            var totalSalery = empList.Sum(x => x.Salery ?? 0);
            var employeeCount = empList.Count;
            var depts = await _departmentService.GetDepartmentListAsync();
            var departmentCount = depts.Count;
            return Ok(new
            {
                TotalSalery = totalSalery,
                EmployeeCount = employeeCount,
                DepartmentCount = departmentCount,
            });
        }

        [HttpGet("department-data")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetDepartmentData()
        {
            var deptsList = await _departmentService.GetDepartmentListAsync();
            var empList = await _employeeService.GetEmployeeListAsync();
            var result = empList.GroupBy(x => x.DepartmentId).Select(y => new DepartmentDataDto()
            {
                Name = deptsList.FirstOrDefault(z => z.Id == y.Key)?.Name!,
                EmployeeCount = y.Count(),
            });
            return Ok(result);
        }

        [HttpGet("employee-leave-today")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetEmployeeOnLeave()
        {
            var onLeaveList = await _leaveService.GetLeaveListAsync(x =>
                        DateTime.Compare(x.LeaveDate.Date, DateTime.UtcNow.Date) == 0);
            var employeeIds = onLeaveList.Select(x => x.EmployeeId).ToList();
            var employeeList = await _employeeService.GetEmployeeListAsync(x => employeeIds.Contains(x.Id));
            var employeeOnLeave = onLeaveList.Select(x => new LeaveDto()
            {
                EmployeeId = x.Id,
                Reason = x.Reason,
                Type = x.Type,
                Status = x.Status,
                EmployeeName = employeeList.FirstOrDefault(y => y.Id == x.EmployeeId)?.Name!
            }).ToList();
            return Ok(employeeOnLeave);
        }

    }
}
