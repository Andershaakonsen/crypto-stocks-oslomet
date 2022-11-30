using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using crypto_stocks.Controllers;
using crypto_stocks.DTO;
using crypto_stocks.Entities;
using crypto_stocks.Helpers;
using crypto_stocks.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Moq;

namespace crypto_stocks_tests;

public class AuthControllerTest
{

    public AuthControllerTest()
    {
        Environment.SetEnvironmentVariable("JWT_SECRET", "test2342483509@@xsdlsdlsd");
    }

    public RegisterDTO registerDTO = new RegisterDTO
    {
        Email = "john@doe.com",
        UserName = "John Doe",
        Password = "doe123"
    };

    public LoginDTO loginDTO = new LoginDTO
    {
        Email = "john",
        Password = "doe123"
    };


    [Fact]
    public async Task Login()
    {
        // Arrange
        var mockService = new Mock<IAuthService>();
        mockService.Setup(repo => repo.Authenticate("john", "doe123")).Returns(GetAccessToken());

        var controller = new AuthController(mockService.Object);

        // Act
        var result = await controller.Login(loginDTO);

        // Assert
        var taskResult = Assert.IsType<ActionResult<string>>(result);
        var okResult = Assert.IsType<OkObjectResult>(taskResult.Result);
        var token = Assert.IsType<string>(okResult.Value);

        Assert.Equal(await GetAccessToken(), token);
    }

    [Fact]
    public async Task Login_Fail()
    {
        // Arrange
        var mockService = new Mock<IAuthService>();
        mockService.Setup(repo => repo.Authenticate("john", "doe123")).Returns(GetNull());

        var controller = new AuthController(mockService.Object);

        // Act
        var result = await controller.Login(loginDTO);

        // Assert
        var taskResult = Assert.IsType<ActionResult<string>>(result);
        var badResult = Assert.IsType<UnauthorizedObjectResult>(taskResult.Result);
        var message = Assert.IsType<string>(badResult.Value);

        Assert.Equal("Invalid credentials", message);
    }

    [Fact]
    public async Task Register()
    {

        // Arrange 
        var mockService = new Mock<IAuthService>();
        mockService.Setup(repo => repo.Register(It.IsAny<RegisterDTO>())).Returns(GetUser());

        mockService.Setup(repo => repo.Authenticate(It.IsAny<string>(), It.IsAny<string>())).Returns(GetAccessToken());

        var controller = new AuthController(mockService.Object);

        // Act
        var result = await controller.Register(registerDTO);

        // Assert
        var taskResult = Assert.IsType<ActionResult<string>>(result);
        var okResult = Assert.IsType<OkObjectResult>(taskResult.Result);
        var token = Assert.IsType<string>(okResult.Value);

        Assert.Equal(await GetAccessToken(), token);
    }

    [Fact]
    public async Task Register_Fail()
    {
        // Arrange
        var mockService = new Mock<IAuthService>();
        mockService.Setup(repo => repo.Register(It.IsAny<RegisterDTO>())).Throws(new ServiceException("User already exists"));

        var controller = new AuthController(mockService.Object);

        // Act

        var result = await controller.Register(registerDTO);

        // Assert
        var taskResult = Assert.IsType<ActionResult<string>>(result);
        var badResult = Assert.IsType<BadRequestObjectResult>(taskResult.Result);
        var message = Assert.IsType<string>(badResult.Value);

        Assert.Equal("User already exists", message);
    }

    [Fact]
    public async Task Register_NoToken()
    {
        // Arrange
        var mockService = new Mock<IAuthService>();
        mockService.Setup(repo => repo.Register(It.IsAny<RegisterDTO>())).Returns(GetUser());

        mockService.Setup(repo => repo.Authenticate(It.IsAny<string>(), It.IsAny<string>())).Returns(GetNull());

        var controller = new AuthController(mockService.Object);

        // Act
        var result = await controller.Register(registerDTO);

        // Assert
        var taskResult = Assert.IsType<ActionResult<string>>(result);
        var badResult = Assert.IsType<UnauthorizedObjectResult>(taskResult.Result);
        var message = Assert.IsType<string>(badResult.Value);

        Assert.Equal("Invalid credentials", message);
    }

    public async Task<User> GetUser()
    {

        return new User
        {
            Id = 1,
            Email = "john",
            Password = "Salted",
            UserName = "John Doe"
        };
    }

    public async Task<string?> GetNull()
    {
        return null;
    }

    public async Task<string> GetAccessToken()
    {

        var secretKey = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(Environment.GetEnvironmentVariable("JWT_SECRET")!));
        var signingCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>(){
            new Claim(ClaimTypes.Name, "john"),
            new Claim(ClaimTypes.Email, "john@doe.com"),
            new Claim(ClaimTypes.NameIdentifier, "1")
        };

        var tokenOptions = new JwtSecurityToken(
            issuer: "https://localhost:5001",
            audience: "https://localhost:5001",
            claims: claims,
            expires: DateTime.Now.AddMinutes(3),
            signingCredentials: signingCredentials
        );

        var tokenString = new JwtSecurityTokenHandler().WriteToken(tokenOptions);

        return tokenString;
    }
}