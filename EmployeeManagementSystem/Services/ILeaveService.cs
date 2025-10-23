using EmployeeManagementSystem.Entities;
using System.Linq.Expressions;

namespace EmployeeManagementSystem.Services
{
    public interface ILeaveService
    {
        Task<List<Leave>> GetLeaveListAsync();
        Task<List<Leave>> GetLeaveListAsync(Expression<Func<Leave, bool>> filter);
        Task<Leave> GetLeaveByIdAsync(int id);
        Task AddLeaveAsync(Leave model);
        void UpdateLeaveAsync(Leave model);
        Task DeleteLeaveAsync(int id);
        Task<int> SaveChangesAsync();
    }
}
