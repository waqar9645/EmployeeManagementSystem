using EmployeeManagementSystem.Entities;
using System.Linq.Expressions;

namespace EmployeeManagementSystem.Services
{
    public interface IAttendanceService
    {
        Task<List<Attendance>> GetAttendanceListAsync();
        Task<List<Attendance>> GetAttendanceListAsync(Expression<Func<Attendance, bool>> filter);
        Task<Attendance> GetAttendanceByIdAsync(int id);
        Task AddAttendanceAsync(Attendance model);
        void UpdateAttendanceAsync(Attendance model);
        Task DeleteAttendanceAsync(int id);
        Task<int> SaveChangesAsync();
    }
}
