namespace crypto_stocks.Controllers;

using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using crypto_stocks.Helpers;
using crypto_stocks.DTO;
using crypto_stocks.Entities;
using System.Security.Claims;


using BCrypt.Net;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly DataContext db;

    public AuthController(DataContext db)
    {
        this.db = db;
    }


    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginDTO user)
    {
        if (user == null) return BadRequest(new ResponseData()
        {
            success = false,
            message = "Invalid payload"
        });

        // Check if the user exists
        var query = from u in db.Users
                    where u.Email == user.Email
                    select u;

        var userFromDb = db.Users.Where(u => u.Email == user.Email).FirstOrDefault();

        if (userFromDb == null) return NotFound(new ResponseData()
        {
            success = false,
            message = "Invalid credentials"
        });

        // Check if the password is correct
        if (!BCrypt.Verify(user.Password, userFromDb.Password)) return Unauthorized(new ResponseData()
        {
            success = false,
            message = "Invalid credentials"
        });

        var secretKey = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(Environment.GetEnvironmentVariable("JWT_SECRET")!));
        var signingCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>(){
            new Claim(ClaimTypes.Name, userFromDb.UserName),
            new Claim(ClaimTypes.Email, userFromDb.Email),
            new Claim(ClaimTypes.NameIdentifier, userFromDb.Id.ToString()),
        };

        var tokenOptions = new JwtSecurityToken(
            issuer: "https://localhost:5001",
            audience: "https://localhost:5001",
            claims: claims,
            expires: DateTime.Now.AddMinutes(60),
            signingCredentials: signingCredentials
        );

        tokenOptions.Payload["uid"] = userFromDb.Id;
        tokenOptions.Payload["email"] = userFromDb.Email;

        var tokenString = new JwtSecurityTokenHandler().WriteToken(tokenOptions);

        // Generate a JWT token
        return Ok(new ResponseData()
        {
            success = true,
            data = tokenString
        });
    }

    [HttpPost("register")]

    public IActionResult Register([FromBody] RegisterDTO user)
    {
        if (user == null) return BadRequest(new ResponseData()
        {
            success = false,
            message = "Invalid payload"
        });

        // Check if the user exists
        var query = from u in db.Users
                    where u.Email == user.Email
                    select u;

        var userFromDb = db.Users.Where(u => u.Email == user.Email).FirstOrDefault();

        if (userFromDb != null) return BadRequest(new ResponseData()
        {
            success = false,
            message = "User already exists"
        });

        // Create a new user
        var newUser = new User()
        {
            Email = user.Email,
            Password = BCrypt.HashPassword(user.Password),
            UserName = user.UserName
        };

        db.Users.Add(newUser);
        db.SaveChanges();

        return Ok(new ResponseData()
        {
            success = true,
            message = "User created successfully"
        });
    }


    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [HttpGet("user")]
    public IActionResult GetUser([FromHeader] string authorization)
    {
        var user = HttpContext.Features.Get<User>();
        return Ok(new ResponseData()
        {
            success = true,
            message = "User found",
            data = user,
        });
    }
}