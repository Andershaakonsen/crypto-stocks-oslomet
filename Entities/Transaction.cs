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

    public String status { get; set; } = "pending"; // pending, completed

    public String Mode { get; set; } = "buy"; // buy, sell

    public User User { get; set; }

    public int WalletId { get; set; }
    public Wallet Wallet { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.Now;

    public DateTime UpdatedAt { get; set; } = DateTime.Now;
}