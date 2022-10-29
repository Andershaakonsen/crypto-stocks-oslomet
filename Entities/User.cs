namespace crypto_stocks.Entities;

public class User
{
    public int Id { get; set; }
    public string Name { get; set; }

    public List<Wallet> Wallets { get; set; }

    public List<Transaction> Transactions { get; set; }
}
