using EmployeeManagementSystem.Entities;
using System.Security.Claims;

namespace EmployeeManagementSystem.Services
{
    public class UserHelper
    {
        private readonly IAuthService _authService;
        private readonly IEmployeeService _employeeService;

        public UserHelper(IAuthService authService , IEmployeeService employeeService)
        {
            _authService = authService;
            _employeeService = employeeService;
        }

        public async Task<int> GetUserId(ClaimsPrincipal userClaim)
        {
            var email = userClaim.FindFirstValue(ClaimTypes.Name);
            var user = (await _authService.GetUsersListAsync(x => x.Email == email)).First();
            return user.Id;
        }
        public async Task<int?> GetEmployeeId(ClaimsPrincipal userClaim)
        {
            var email = userClaim.FindFirstValue(ClaimTypes.Name);
            var user = (await _authService.GetUsersListAsync(x => x.Email == email)).First();
            var emp = (await _employeeService.GetEmployeeListAsync(x => x.UserId == user.Id)).FirstOrDefault();
            return emp?.Id;
        }
        public bool IsAdmin(ClaimsPrincipal userClaim)
        {
            var role = userClaim.FindFirstValue(ClaimTypes.Role);
            return role == "Admin";
        }

    }
}
