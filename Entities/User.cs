using System.ComponentModel.DataAnnotations.Schema;

namespace crypto_stocks.Entities;

public class User
{
    public int Id { get; set; }
    public string UserName { get; set; }

    public string? Email { get; set; }

    public string? Password { get; set; }

    public List<Wallet> Wallets { get; set; }

    public List<Transaction> Transactions { get; set; }
}
