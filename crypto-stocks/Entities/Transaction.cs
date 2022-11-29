using System.Text.Json.Serialization;

namespace crypto_stocks.Entities;
/**
* Represents the transaction history of a user
* Full Crud support on this element.
*/
public class Transaction
{
    public int Id { get; set; }

    public String Symbol { get; set; } // BTC, XRP, ETH, etc.

    public float Amount { get; set; }

    public decimal Units { get; set; }

    public int UserId { get; set; }

    [JsonIgnore]
    public User User { get; set; }

    public int WalletId { get; set; }
    [JsonIgnore]
    public Wallet Wallet { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.Now;

    public DateTime UpdatedAt { get; set; } = DateTime.Now;
}