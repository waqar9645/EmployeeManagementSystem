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
    public class DepartmentController : ControllerBase
    {
        private readonly IDepartmentService _departmentService;
        public DepartmentController(IDepartmentService departmentService)
        {
            _departmentService = departmentService;
        }
        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetDepartmentList([FromQuery] SearchOptionDto searchOption)
        {
            var depts = await _departmentService.GetDepartmentListAsync();
            var pagedData = new PagedData<Department>();
            pagedData.TotalData = depts.Count;
            if (searchOption.PageIndex.HasValue)
            {
                pagedData.Data = depts.Skip(searchOption.PageIndex.Value * searchOption.PageSize!.Value)
                    .Take(searchOption.PageSize.Value).ToList();
            }
            else
            {
                pagedData.Data = depts;
            }
            return Ok(pagedData);
        }
        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetDepartmentById(int id)
        {
            var dept = await _departmentService.GetDepartmentByIdAsync(id);
            return Ok(dept);
        }
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AddDepartment([FromBody] Department model)
        {
            await _departmentService.AddDepartmentAsync(model);
            await _departmentService.SaveChangesAsync();
            return Ok();
        }
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateDepartment([FromBody] Department model , int id)
        {
            var dept = await _departmentService.GetDepartmentByIdAsync(id);
            if (dept == null)
                return BadRequest("Department not availiable");
            dept.Name = model.Name;
            _departmentService.UpdateDepartmentAsync(dept);
            await _departmentService.SaveChangesAsync();
            return Ok();
        }
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteDepartment(int id)
        {
            await _departmentService.DeleteDepartmentAsync(id);
            await _departmentService.SaveChangesAsync();
            return Ok();
        }
    }
}
