using EmployeeManagementSystem.Data;
using EmployeeManagementSystem.DTOs;
using EmployeeManagementSystem.Entities;
using EmployeeManagementSystem.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Diagnostics;

namespace EmployeeManagementSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        private readonly IEmployeeService _employeeService;
        private readonly IAuthService _authService;

        public EmployeeController(IEmployeeService employeeService , IAuthService authService)
        {
            _employeeService = employeeService;
            _authService = authService;
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetEmployeeList([FromQuery]SearchOptionDto searchOption)
        {
            var pagedData = new PagedData<Employee>();
            if (string.IsNullOrEmpty(searchOption.Search))
            {
                pagedData.Data = await _employeeService.GetEmployeeListAsync();
            }
            else
            {
                pagedData.Data = await _employeeService.GetEmployeeListAsync(x =>
                x.Name.Contains(searchOption.Search!) ||
                x.Phone.Contains(searchOption.Search!) ||
                x.Email.Contains(searchOption.Search!) ||
                x.JobTitle.Contains(searchOption.Search!)
                );
            }
            pagedData.TotalData = pagedData.Data.Count;
            if (searchOption.PageIndex.HasValue)
            {
                pagedData.Data = pagedData.Data.Skip(searchOption.PageIndex.Value * searchOption.PageSize!.Value)
                    .Take(searchOption.PageSize.Value).ToList();
            }
            return Ok(pagedData);
        }
        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetEmployeeById(int id)
        {
            var emp = await _employeeService.GetEmployeeByIdAsync(id);
            return Ok(emp);
        }
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AddEmployee([FromBody]Employee model)
        {
            var user = new User()
            {
                Email = model.Email,
                Role = "Employee",
                Password = (new PasswordHelper()).HashPassword("12345")
            };
            await _authService.AddUserAsync(user);
            model.User = user;
            await _employeeService.AddEmployeeAsync(model);
            await _employeeService.SaveChangesAsync();
            return Ok();
        }
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateEmployee([FromBody]Employee model , int id)
        {
            var emp = await _employeeService.GetEmployeeByIdAsync(id);
            if (emp == null)
                return BadRequest("Employee not found");
            emp.Name = model.Name;
            emp.Phone = model.Phone;
            emp.JobTitle = model.JobTitle;
            emp.Salery = model.Salery;
            emp.LastWorkingDate = model.LastWorkingDate;

            _employeeService.UpdateEmployeeAsync(emp);
            await _employeeService.SaveChangesAsync();
            return Ok();
        }
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteEmployee(int id)
        {
            await _employeeService.DeleteEmployeeAsync(id);
            await _employeeService.SaveChangesAsync();
            return Ok();
        }

    }
}
