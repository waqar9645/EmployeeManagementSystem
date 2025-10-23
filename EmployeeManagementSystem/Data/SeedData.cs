using EmployeeManagementSystem.Entities;
using EmployeeManagementSystem.Services;

namespace EmployeeManagementSystem.Data
{
    public class SeedData
    {
        private readonly AppDbContext _context;

        public SeedData(AppDbContext context)
        {
            _context = context;
        }

        public void InsertData()
        {

            if (!_context.Users.Any())
            {
                var passwordHelper = new PasswordHelper();
                _context.Users.Add(new User()
                {
                    Email = "admin@test.com",
                    Password = passwordHelper.HashPassword("123456"),
                    Role = "Admin",
                    ProfileImage = ""
                });
                _context.Users.Add(new User()
                {
                    Email = "emp@test.com",
                    Password = passwordHelper.HashPassword("12345"),
                    Role = "Employee",
                    ProfileImage = ""
                });
            }
            _context.SaveChanges();
        }



    }
}
