using EmployeeManagementSystem.Data;
using EmployeeManagementSystem.Entities;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Linq.Expressions;

namespace EmployeeManagementSystem.Services
{
    public class EmployeeService : IEmployeeService
    {
        private readonly AppDbContext _context;

        public EmployeeService(AppDbContext context)
        {
            _context = context;
        }
        public async Task<List<Employee>> GetEmployeeListAsync()
        {
            var emps = await _context.Employees.ToListAsync();
            return emps;
        }
        public async Task<List<Employee>> GetEmployeeListAsync(Expression<Func<Employee, bool>> filter)
        {
            var emp = await _context.Employees.AsQueryable().Where(filter).ToListAsync();
            return emp!;
        }
        public async Task<Employee> GetEmployeeByIdAsync(int id)
        {
            var emp = await _context.Employees.FindAsync(id);
            return emp!;
        }
        public async Task AddEmployeeAsync(Employee model)
        {
            await _context.Employees.AddAsync(model);
            await _context.SaveChangesAsync();
        }
        public void UpdateEmployeeAsync(Employee model)
        {
            _context.Employees.Update(model);
        }
        public async Task DeleteEmployeeAsync(int id)
        {
            var emp = await _context.Employees.FindAsync(id);
            _context.Employees.Remove(emp!);
            await _context.SaveChangesAsync();
        }
        public async Task<int> SaveChangesAsync()
        {
            return( await _context.SaveChangesAsync());
        }
    }
}
