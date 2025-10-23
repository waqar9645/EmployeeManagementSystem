using EmployeeManagementSystem.Data;
using EmployeeManagementSystem.Entities;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Linq.Expressions;

namespace EmployeeManagementSystem.Services
{
    public class AttendanceService : IAttendanceService
    {
        private readonly AppDbContext _context;

        public AttendanceService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Attendance>> GetAttendanceListAsync()
        {
            var attendances = await _context.Attendances.ToListAsync();
            return attendances;
        }
        public async Task<List<Attendance>> GetAttendanceListAsync(Expression<Func<Attendance, bool>> filter)
        {
            var attendances = await _context.Attendances.AsQueryable().Where(filter).ToListAsync();
            return attendances!;
        }
        public async Task<Attendance> GetAttendanceByIdAsync(int id)
        {
            var attendance = await _context.Attendances.FindAsync(id);
            return attendance!;
        }
        public async Task AddAttendanceAsync(Attendance model)
        {
            await _context.Attendances.AddAsync(model);
            await _context.SaveChangesAsync();
        }
        public void UpdateAttendanceAsync(Attendance model)
        {
            _context.Attendances.Update(model);
        }
        public async Task DeleteAttendanceAsync(int id)
        {
            var attendance = await _context.Attendances.FindAsync(id);
            _context.Attendances.Remove(attendance!);
            await _context.SaveChangesAsync();
        }
        public async Task<int> SaveChangesAsync()
        {
            return (await _context.SaveChangesAsync());
        }


    }
}
