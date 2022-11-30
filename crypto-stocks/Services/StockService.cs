
using System.Net;
using crypto_stocks.Entities;
using crypto_stocks.Helpers;

namespace crypto_stocks.Services;

public class StockService : IStockService
{
    private readonly DataContext db;
    private readonly IWalletService walletService;

    private readonly ICMCService cmcService = new CMCService();

    public StockService(DataContext db, IWalletService walletService)
    {
        this.db = db;
        this.walletService = walletService;
    }

    public async Task<List<Transaction>> GetTransactionsByUser(int userId, int limit)
    {
        var transactions = await Task.Run(() => db.Transactions.Where(t => t.UserId == userId).OrderByDescending(t => t.CreatedAt).Take(limit).ToList());

        return transactions;
    }

    public async Task<Transaction?> GetTransactionById(int id)
    {
        var transaction = await Task.Run(() => db.Transactions.Find(id));
        return transaction;
    }

    public async Task<Transaction?> GetTransactionByUser(int userId, int transactionId)
    {
        var transaction = await Task.Run(() => db.Transactions.Where(t => t.UserId == userId && t.Id == transactionId).FirstOrDefault());

        return transaction;
    }

    public async Task<Transaction> CreateTransaction(int userId, decimal units, string symbol)
    {
        var usdWallet = await walletService.GetUSDWallet(userId);

        if (usdWallet == null)
        {
            throw new ServiceException("User does not have a USD wallet");
        }

        // Get the current usd exchange rate from CMC service
        var usdRate = await cmcService.GetUSDExchangeRate(units, symbol);

        // Check if the user has enough money to buy the stock
        if (usdWallet.Balance < ((float)usdRate))
        {
            throw new ServiceException("Insufficient funds");
        }

        // Create or update wallet for the stock

        var stockWallet = await walletService.UpselectWallet(userId, symbol);

        // Create a transaction
        var transaction = new Transaction()
        {
            UserId = userId,
            Units = units,
            Symbol = symbol,
            Amount = (float)usdRate,
            Wallet = stockWallet,
        };

        db.Transactions.Add(transaction);

        // Update the USD wallet
        usdWallet.Balance -= (float)usdRate;
        stockWallet.Balance += (float)units;

        await db.SaveChangesAsync();

        return transaction;
    }

    public async Task<bool> DeleteTransaction(int userId, int transactionId)
    {
        var transaction = await GetTransactionByUser(userId, transactionId);
        if (transaction == null)
        {
            throw new ServiceException("Transaction not found", HttpStatusCode.NotFound);
        }

        var stockWallet = await walletService.GetWalletById(transaction.WalletId);

        if (stockWallet == null)
        {
            throw new ServiceException("Wallet not found", HttpStatusCode.NotFound);
        }

        var usdWallet = await walletService.GetUSDWallet(userId);

        if (usdWallet == null)
        {
            throw new ServiceException("User does not have a USD wallet", HttpStatusCode.NotFound);
        }

        // Call to API to get the current USD exchange rate
        var usdRate = await cmcService.GetUSDExchangeRate(transaction.Units, transaction.Symbol);
        // Update wallets
        usdWallet.Balance += (float)usdRate;
        stockWallet.Balance -= (float)transaction.Units;
        db.Transactions.Remove(transaction);

        await db.SaveChangesAsync();

        return true;
    }

    public async Task<Transaction> UpdateTransactionUnits(int userId, int transactionId, decimal units)
    {
        var transaction = await GetTransactionByUser(userId, transactionId);
        if (transaction == null) throw new ServiceException("Transaction not found", HttpStatusCode.NotFound);


        var stockWallet = await walletService.GetWalletById(transaction.WalletId);
        if (stockWallet == null) throw new ServiceException("Wallet not found", HttpStatusCode.NotFound);


        var usdWallet = await walletService.GetUSDWallet(userId);
        if (usdWallet == null) throw new ServiceException("User does not have a USD wallet", HttpStatusCode.NotFound);

        // Units are the same, no need to update
        if (units == transaction.Units) return transaction;

        // Sell the difference
        if (units < transaction.Units)
        {
            var difference = transaction.Units - units;
            var usdRate = await cmcService.GetUSDExchangeRate(difference, transaction.Symbol);
            usdWallet.Balance += (float)usdRate;
            stockWallet.Balance -= (float)difference;
            transaction.Amount -= (float)usdRate;
            transaction.Units -= difference;
        }
        else
        {
            // Buy the difference
            var difference = units - transaction.Units;
            var usdRate = await cmcService.GetUSDExchangeRate(difference, transaction.Symbol);
            if (usdWallet.Balance < (float)usdRate) throw new ServiceException("Insufficient funds");
            usdWallet.Balance -= (float)usdRate;
            stockWallet.Balance += (float)difference;
            transaction.Amount += (float)usdRate;
            transaction.Units += difference;
        }

        await db.SaveChangesAsync();

        return transaction;
    }
}

public interface IStockService
{
    Task<List<Transaction>> GetTransactionsByUser(int userId, int limit);

    Task<Transaction?> GetTransactionById(int id);

    Task<Transaction> CreateTransaction(int userId, decimal units, string symbol);

    Task<bool> DeleteTransaction(int userId, int transactionId);

    Task<Transaction?> GetTransactionByUser(int userId, int transactionId);

    Task<Transaction> UpdateTransactionUnits(int userId, int transactionId, decimal units);

}