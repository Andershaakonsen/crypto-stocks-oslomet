using Microsoft.AspNetCore.Identity;
namespace crypto_stocks.Entities;

public class Auth : IdentityUser
{
    public string? DisplayName { get; set; }
}
