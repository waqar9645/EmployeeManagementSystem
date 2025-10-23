using EmployeeManagementSystem.Entities;
using System.Linq.Expressions;

namespace EmployeeManagementSystem.Services
{
    public interface IDepartmentService
    {
        Task<List<Department>> GetDepartmentListAsync();
        Task<List<Department>> GetDepartmentListAsync(Expression<Func<Department, bool>> filter);
        Task<Department> GetDepartmentByIdAsync(int id);
        Task AddDepartmentAsync(Department model);
        void UpdateDepartmentAsync(Department model);
        Task DeleteDepartmentAsync(int id);
        Task<int> SaveChangesAsync();

    }
}
