using Microsoft.AspNetCore.Identity;
namespace crypto_stocks.Entities;

public class Auth : IdentityUser
{
    public string? DisplayName { get; set; }

    public string? Email { get; set; }

    public string? Password { get; set; }
}
