using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;

namespace crypto_stocks.Entities;

[Index(nameof(Email), IsUnique = true)]

public class User
{
    public int Id { get; set; }
    public string UserName { get; set; }

    public string Email { get; set; }

    [JsonIgnore]
    public string? Password { get; set; }

    public List<Wallet> Wallets { get; set; }

    public List<Transaction> Transactions { get; set; }
}
