namespace crypto_stocks.Entities;

public class User
{
    public int Id { get; set; }
    public string Name { get; set; }

    public Wallet? Wallet { get; set; }
}
