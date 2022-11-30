namespace crypto_stocks.Services;

using crypto_stocks.Entities;
using crypto_stocks.Helpers;
using BCrypt.Net;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using crypto_stocks.DTO;
using System.Net;

public interface IAuthService
{
    Task<string?> Authenticate(string email, string password);
    Task<User> Register(RegisterDTO register);

    User GetUserFromRequest(HttpContext context);
}

public class AuthService : IAuthService
{

    private readonly DataContext db;
    public AuthService(DataContext db)
    {
        this.db = db;
    }

    public async Task<string?> Authenticate(string email, string password)
    {
        // Check if the user exists
        var user = Task.Run(() => db.Users.Where(u => u.Email == email).FirstOrDefault()).Result;
        if (user == null) return null;

        if (!BCrypt.Verify(password, user.Password)) return null;

        var secretKey = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(Environment.GetEnvironmentVariable("JWT_SECRET")!));

        var signingCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>(){
            new Claim(ClaimTypes.Name, user.UserName),
            new Claim(ClaimTypes.Email, user.Email!),
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
        };

        var tokenOptions = new JwtSecurityToken(
            issuer: "https://localhost:5001",
            audience: "https://localhost:5001",
            claims: claims,
            expires: DateTime.Now.AddMinutes(60),
            signingCredentials: signingCredentials
        );

        tokenOptions.Payload["uid"] = user.Id;
        tokenOptions.Payload["email"] = user.Email;

        var tokenString = new JwtSecurityTokenHandler().WriteToken(tokenOptions);

        return tokenString;
    }

    public async Task<User> Register(RegisterDTO register)
    {
        // Check if the user exists
        var existing = Task.Run(() => db.Users.Where(u => u.Email == register.Email).FirstOrDefault()).Result;
        if (existing != null) throw new ServiceException("User already exists");

        var user = new User()
        {
            UserName = register.UserName,
            Email = register.Email,
            Password = BCrypt.HashPassword(register.Password)
        };

        db.Users.Add(user);
        await db.SaveChangesAsync();

        return user;
    }

    public User GetUserFromRequest(HttpContext context)
    {
        var user = context.Features.Get<User>()!;

        if (user == null) throw new ServiceException("User not found", HttpStatusCode.Unauthorized);

        return user;
    }
}