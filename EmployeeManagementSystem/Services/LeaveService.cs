using EmployeeManagementSystem.Data;
using EmployeeManagementSystem.Entities;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Linq.Expressions;

namespace EmployeeManagementSystem.Services
{
    public class LeaveService : ILeaveService
    {
        private readonly AppDbContext _context;

        public LeaveService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Leave>> GetLeaveListAsync()
        {
            var leaves = await _context.Leaves.ToListAsync();
            return leaves;
        }

        public async Task<List<Leave>> GetLeaveListAsync(Expression<Func<Leave, bool>> filter)
        {
            var leaves = await _context.Leaves.AsQueryable().Where(filter).ToListAsync();
            return leaves!;
        }
        public async Task<Leave> GetLeaveByIdAsync(int id)
        {
            var leave = await _context.Leaves.FindAsync(id);
            return leave!;
        }
        public async Task AddLeaveAsync(Leave model)
        {
            await _context.Leaves.AddAsync(model);
            await _context.SaveChangesAsync();
        }
        public void UpdateLeaveAsync(Leave model)
        {
            _context.Leaves.Update(model);
        }
        public async Task DeleteLeaveAsync(int id)
        {
            var leave = await _context.Leaves.FindAsync(id);
            _context.Leaves.Remove(leave!);
            await _context.SaveChangesAsync();
        }
        public async Task<int> SaveChangesAsync()
        {
            return (await _context.SaveChangesAsync());
        }
    }
}
