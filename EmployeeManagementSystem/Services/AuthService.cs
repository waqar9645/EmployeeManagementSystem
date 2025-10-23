using EmployeeManagementSystem.Data;
using EmployeeManagementSystem.Entities;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace EmployeeManagementSystem.Services
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _context;

        public AuthService(AppDbContext context)
        {
            _context = context;
        }
        public async Task<List<User>> GetUsersListAsync()
        {
            var users = await _context.Users.ToListAsync();
            return users;
        }
        public async Task<List<User>> GetUsersListAsync(Expression<Func<User , bool>> filter)
        {
            var user = await _context.Users.AsQueryable().Where(filter).ToListAsync();
            return user!;
        }
        public async Task<User> GetUserByIdAsync(int id)
        {
            var user = await _context.Users.FindAsync(id);
            return user!;
        }
        public async Task AddUserAsync(User model)
        {
            await _context.Users.AddAsync(model);
            await _context.SaveChangesAsync();
        }
        public void UpdateUserAsync(User model)
        {
            _context.Users.Update(model);
        }
        public async Task DeleteUserAsync(int id)
        {
            var user = await _context.Users.FindAsync(id);
            _context.Users.Remove(user!);
            await _context.SaveChangesAsync();
        }
        public async Task<int> SaveChangesAsync()
        {
            return (await _context.SaveChangesAsync());
        }

        
    }
}
