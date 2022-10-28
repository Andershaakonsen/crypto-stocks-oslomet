namespace crypto_stocks.Entities;

public class Wallet
{
    public int Id { get; set; }

    public int Balance { get; set; } = 0;

    public int UserId { get; set; }

    public User User { get; set; }
}
