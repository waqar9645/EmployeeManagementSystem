using EmployeeManagementSystem.Entities;
using System.Linq.Expressions;

namespace EmployeeManagementSystem.Services
{
    public interface IEmployeeService
    {
        Task<List<Employee>> GetEmployeeListAsync();
        Task<List<Employee>> GetEmployeeListAsync(Expression<Func<Employee, bool>> filter);
        Task<Employee> GetEmployeeByIdAsync(int id);
        Task AddEmployeeAsync(Employee model);
        void UpdateEmployeeAsync(Employee model);
        Task DeleteEmployeeAsync(int id);
        Task<int> SaveChangesAsync();
    }
}
