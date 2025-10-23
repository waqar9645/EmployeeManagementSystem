using EmployeeManagementSystem.DTOs;
using EmployeeManagementSystem.Entities;
using EmployeeManagementSystem.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeManagementSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AttendanceController : ControllerBase
    {
        private readonly IAttendanceService _attendanceService;
        private readonly UserHelper _userHelper;

        public AttendanceController(IAttendanceService attendanceService,UserHelper userHelper)
        {
            _attendanceService = attendanceService;
            _userHelper = userHelper;
        }

        [HttpPost("mark-present")]
        [Authorize(Roles="Employee")]
        public async Task<IActionResult> MarkAttendance()
        {
            var employeeId = await _userHelper.GetEmployeeId(User);
            var attendanceList = await _attendanceService.GetAttendanceListAsync(x => x.EmployeeId == employeeId.Value
                                                            && DateTime.Compare(x.Date.Date, DateTime.UtcNow.Date) == 0);
            if(attendanceList.Count > 0)
            {
                return BadRequest("Already present marked for today");
            }
            var attendance = new Attendance()
            {
                Date = DateTime.UtcNow,
                EmployeeId = employeeId.Value,
                Type = (int)AttendanceType.Present
            };
            await _attendanceService.AddAttendanceAsync(attendance);
            await _attendanceService.SaveChangesAsync();
            return Ok();
        }

        [HttpGet]
        public async Task<IActionResult> GetAttendanceHistory([FromQuery] SearchOptionDto searchOption)
        {
            if (!_userHelper.IsAdmin(User))
            {
                searchOption.EmployeeId = await _userHelper.GetEmployeeId(User);
            }
            var attendances = await _attendanceService.GetAttendanceListAsync(x =>
                                x.EmployeeId == searchOption.EmployeeId!.Value);
            var pagedData = new PagedData<Attendance>();
            pagedData.TotalData = attendances.Count;
            if (searchOption.PageIndex.HasValue)
            {
                attendances = attendances.Skip(searchOption.PageIndex.Value * searchOption.PageSize!.Value)
                    .Take(searchOption.PageSize.Value).ToList();
            }
            pagedData.Data = attendances;
            return Ok(pagedData);
            
        }

    }
}
