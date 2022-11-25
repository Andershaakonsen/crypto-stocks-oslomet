
using System.ComponentModel.DataAnnotations;

namespace crypto_stocks.DTO;

public class RegisterDTO
{
    [Required]
    [EmailAddress]
    public string Email { get; init; } = null!;
    [Required]
    public string Password { get; init; } = null!;
    [Required]
    [MinLength(3)]
    public string UserName { get; init; } = null!;
}