using EmployeeManagementSystem.Data;
using EmployeeManagementSystem.Entities;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Linq.Expressions;

namespace EmployeeManagementSystem.Services
{
    public class DepartmentService : IDepartmentService
    {
        private readonly AppDbContext _context;

        public DepartmentService(AppDbContext context)
        {
            _context = context;
        }
        public async Task<List<Department>> GetDepartmentListAsync()
        {
            var depts = await _context.Departments.ToListAsync();
            return depts;
        }
        public async Task<List<Department>> GetDepartmentListAsync(Expression<Func<Department, bool>> filter)
        {
            var depts =  await _context.Departments.AsQueryable().Where(filter).ToListAsync();
            return depts!;
        }
        public async Task<Department> GetDepartmentByIdAsync(int id)
        {
            var dept = await _context.Departments.FindAsync(id);
            return dept!;
        }
        public async Task AddDepartmentAsync(Department model)
        {
            await _context.Departments.AddAsync(model);
        }
        public void UpdateDepartmentAsync(Department model)
        {
            _context.Departments.Update(model);
        }
        public async Task DeleteDepartmentAsync(int id)
        {
            var dept = await _context.Departments.FindAsync(id);
            _context.Departments.Remove(dept!);
        }
        public async Task<int> SaveChangesAsync()
        {
            return (await _context.SaveChangesAsync());
        }
    }
}
