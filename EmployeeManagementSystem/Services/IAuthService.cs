using EmployeeManagementSystem.Entities;
using System.Linq.Expressions;

namespace EmployeeManagementSystem.Services
{
    public interface IAuthService
    {
        Task<List<User>> GetUsersListAsync();
        Task<List<User>> GetUsersListAsync(Expression<Func<User , bool>> filter);
        Task<User> GetUserByIdAsync(int id);
        Task AddUserAsync(User model);
        void UpdateUserAsync(User model);
        Task DeleteUserAsync(int id);
        Task<int> SaveChangesAsync();
    }
}
