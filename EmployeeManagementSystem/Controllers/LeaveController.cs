using EmployeeManagementSystem.Data;
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
    public class LeaveController : ControllerBase
    {
        private readonly ILeaveService _leaveService;
        private readonly IAttendanceService _attendanceService;
        private readonly UserHelper _userHelper;

        public LeaveController(ILeaveService leaveService , IAttendanceService attendanceService , UserHelper userHelper)
        {
            _leaveService = leaveService;
            _attendanceService = attendanceService;
            _userHelper = userHelper;
        }

        [HttpPost("apply")]
        [Authorize(Roles="Employee")]
        public async Task<IActionResult> ApplyLeave([FromBody]LeaveDto model)
        {
            var date = TimeZoneInfo.ConvertTimeFromUtc(model.LeaveDate!.Value, TimeZoneInfo.Local);
            var employeeId = await _userHelper.GetEmployeeId(User);
            var leave = new Leave()
            {
                EmployeeId = employeeId.Value,
                Type = (int)model.Type!,
                Reason = model.Reason!,
                LeaveDate = date,
                Status = (int)LeaveStatus.Pending
            };
            await _leaveService.AddLeaveAsync(leave);
            await _leaveService.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("update-status")]
        [Authorize]
        public async Task<IActionResult> UpdateLeaveStatus([FromBody] LeaveDto model)
        {
            var leave = await _leaveService.GetLeaveByIdAsync(model.Id!.Value);
            var isAdmin = _userHelper.IsAdmin(User);
            if (isAdmin)
            {
                leave.Status = model.Status!.Value;

                if(model.Status.Value == (int)LeaveStatus.Accepted)
                {
                    await _attendanceService.AddAttendanceAsync(new Attendance()
                    {
                        Date = leave.LeaveDate,
                        EmployeeId = leave.EmployeeId,
                        Type = (int)AttendanceType.Leave
                    });
                }
            }
            else
            {
                if(model.Status == (int)LeaveStatus.Cancelled)
                {
                    leave.Status = model.Status!.Value;
                }
                else
                {
                    return BadRequest(ModelState);
                }
            }
            _leaveService.UpdateLeaveAsync(leave);
            await _leaveService.SaveChangesAsync();
            return Ok();
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> List([FromRoute]SearchOptionDto searchOption)
        {
            List<Leave> leaves;
            if (_userHelper.IsAdmin(User))
            {
                leaves = await _leaveService.GetLeaveListAsync();
            }
            else
            {
                var employeeId = await _userHelper.GetEmployeeId(User);
                leaves = await _leaveService.GetLeaveListAsync(x => x.EmployeeId == employeeId);
            }
            var pagedData = new PagedData<Leave>();
            pagedData.TotalData = leaves.Count;
            if (searchOption.PageIndex.HasValue)
            {
                pagedData.Data = leaves.Skip(searchOption.PageIndex.Value * searchOption.PageSize!.Value)
                    .Take(searchOption.PageSize.Value).ToList();
            }
            else
            {
                pagedData.Data = leaves;
            }
            return Ok(pagedData);
        }


    }
}
