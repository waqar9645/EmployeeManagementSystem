using EmployeeManagementSystem.Entities;
using Microsoft.AspNetCore.Identity;

namespace EmployeeManagementSystem.Services
{
    public class PasswordHelper
    {
        public string HashPassword(string password)
        {
            var hasher = new PasswordHasher<User>();
            return hasher.HashPassword(null , password);
        }

        public bool VerifyPassword(string hash, string password)
        {
            var hasher = new PasswordHasher<User>();
            var result = hasher.VerifyHashedPassword(null, hash, password);
            return result == PasswordVerificationResult.Success ? true : false;
        }

    }
}
