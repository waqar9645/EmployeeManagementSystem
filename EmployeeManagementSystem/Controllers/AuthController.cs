using EmployeeManagementSystem.DTOs;
using EmployeeManagementSystem.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace EmployeeManagementSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly IConfiguration _configuration;
        private readonly IEmployeeService _employeeService;

        public AuthController(IAuthService authService , IConfiguration configuration , IEmployeeService employeeService)
        {
            _authService = authService;
            _configuration = configuration;
            _employeeService = employeeService;
        }


        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody]LoginDto model)
        {
            var user = (await _authService.GetUsersListAsync(x => x.Email == model.Email)).FirstOrDefault();
            if (user == null)
                return new BadRequestObjectResult(new { message = "user not found" });
            var passwordHelper = new PasswordHelper();
            if(!passwordHelper.VerifyPassword(user.Password , model.Password))
                return new BadRequestObjectResult(new { message = "Email or password is incorrect" });

            // return token
            var token = GenerateToken(user.Email, user.Role);
            return Ok(new TokenDto()
            {
                Id = user.Id,
                Email = user.Email,
                Token = token,
                Role = user.Role
            });
        }
        private string GenerateToken(string email , string role)
        {
            var jwt = _configuration.GetSection("Jwt");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt["Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.Name , email),
                new Claim(ClaimTypes.Role , role)
            };

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(double.Parse(jwt["expiry"]!)),
                signingCredentials: creds
                );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        [HttpGet("profile")]
        [Authorize]
        public async Task<IActionResult> GetProfile()
        {
            var email = User.FindFirstValue(ClaimTypes.Name);
            var user = (await _authService.GetUsersListAsync(x => x.Email == email)).First();
            var emp = (await _employeeService.GetEmployeeListAsync(x => x.UserId == user.Id)).FirstOrDefault();
            return Ok(new ProfileDto()
            {
                Name = emp?.Name,
                Email = user.Email,
                Phone = emp?.Phone,
                ProfileImage = user.ProfileImage,
                Salery = emp?.Salery,
            });
        }

        [HttpPost("profile")]
        [Authorize]
        public async Task<IActionResult> UpdateProfile([FromBody]ProfileDto model)
        {
            var email = User.FindFirstValue(ClaimTypes.Name);
            var user = (await _authService.GetUsersListAsync(x => x.Email == email)).First();
            var emp = (await _employeeService.GetEmployeeListAsync(x => x.UserId == user.Id)).FirstOrDefault();
            if(emp != null)
            {
                if (!string.IsNullOrEmpty(model.Name))
                    emp.Name = model.Name;
                if (!string.IsNullOrEmpty(model.Phone))
                    emp.Phone = model.Phone;
                _employeeService.UpdateEmployeeAsync(emp);
            }
            if (!string.IsNullOrEmpty(model.Password))
            {
                var passwordHelper = new PasswordHelper();
                user.Password = passwordHelper.HashPassword(model.Password);
            }
            if (!string.IsNullOrEmpty(model.ProfileImage))
                user.ProfileImage = model.ProfileImage;
            _authService.UpdateUserAsync(user);
            await _employeeService.SaveChangesAsync();
            await _authService.SaveChangesAsync();
            return Ok();
        }

    }
}
