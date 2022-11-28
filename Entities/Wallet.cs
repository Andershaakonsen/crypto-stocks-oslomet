using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;

namespace crypto_stocks.Entities;

[Index(nameof(UserId), nameof(Symbol), IsUnique = true)]
public class Wallet
{
    public int Id { get; set; }

    public float Balance { get; set; } = 0;

    public String Symbol { get; set; } = "USD"; // Default to USD

    public int UserId { get; set; }

    [JsonIgnore]
    public User? User { get; set; }

    public List<Transaction>? Transactions { get; set; }
}
