
using System.ComponentModel.DataAnnotations;

namespace crypto_stocks.DTO;

public class RegisterDTO
{
    [Required]
    [EmailAddress]
    public string Email { get; init; } = null!;
    [Required]
    [MinLength(8)]
    [RegularExpression(@"^(?=.*\d).+$", ErrorMessage = "Password must contain a number")]
    public string Password { get; init; } = null!;
    [Required]
    [MinLength(3)]
    public string UserName { get; init; } = null!;
}

public class LoginDTO
{
    [Required]
    [EmailAddress]
    public string Email { get; init; } = null!;
    [Required]
    [MinLength(8)]
    public string Password { get; init; } = null!;
}