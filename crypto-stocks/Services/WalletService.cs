using crypto_stocks.Entities;
using crypto_stocks.Helpers;
using Microsoft.EntityFrameworkCore;

namespace crypto_stocks.Services;



public class WalletService : IWalletService
{
    private readonly DataContext db;

    public WalletService(DataContext db)
    {
        this.db = db;
    }

    public async Task<List<Wallet>> GetWalletsByUserId(int userId)
    {
        return await db.Wallets.Where(w => w.UserId == userId).ToListAsync();
    }

    public async Task<Wallet?> GetUSDWallet(int userId)
    {
        return await db.Wallets.Where(w => w.UserId == userId && w.Symbol == "USD").FirstOrDefaultAsync();
    }

    public async Task<Wallet?> GetWalletById(int id)
    {
        return await db.Wallets.FindAsync(id);
    }

    /**
    * Upselects (creates or gets) a wallet for a user
    */
    public async Task<Wallet> UpselectWallet(int userId, string symbol)
    {
        var wallet = await db.Wallets.Where(w => w.UserId == userId && w.Symbol == symbol).FirstOrDefaultAsync();

        if (wallet == null)
        {
            wallet = new Wallet()
            {
                UserId = userId,
                Symbol = symbol,
                Balance = 0
            };

            await db.Wallets.AddAsync(wallet);
            await db.SaveChangesAsync();
        }


        return wallet;
    }


    public async Task<Wallet> DepositToUserWallet(int userId, float amount)
    {
        // Query for wallet 
        var query = from w in db.Wallets
                    where w.UserId == userId && w.Symbol == "USD"
                    select w;

        var wallet = query.FirstOrDefault<Wallet>();

        // If wallet does not exist, just create it
        if (wallet == null)
        {
            wallet = new Wallet();
            wallet.UserId = userId;
            wallet.Balance = amount;
            db.Wallets.Add(wallet);
        }
        else
        {
            wallet.Balance += amount;
        }

        await db.SaveChangesAsync();

        return wallet;
    }

    public async Task<Wallet?> WithdrawFromUserWallet(int userId, float amount)
    {
        // Query for wallet 
        var query = from w in db.Wallets
                    where w.UserId == userId && w.Symbol == "USD"
                    select w;

        var wallet = query.FirstOrDefault<Wallet>();

        // If wallet does not exist return null
        if (wallet == null) return null;

        if (wallet.Balance < amount) return null;

        wallet.Balance -= amount;

        await db.SaveChangesAsync();

        return wallet;
    }
}

public interface IWalletService
{
    Task<List<Wallet>> GetWalletsByUserId(int userId);
    Task<Wallet?> GetUSDWallet(int userId);
    Task<Wallet> DepositToUserWallet(int userId, float amount);
    Task<Wallet?> WithdrawFromUserWallet(int userId, float amount);

    Task<Wallet> UpselectWallet(int userId, string symbol);

    Task<Wallet?> GetWalletById(int id);

}
