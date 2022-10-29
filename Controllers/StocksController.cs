using Microsoft.AspNetCore.Mvc;
using crypto_stocks.Helpers;
using crypto_stocks.DTO;
using crypto_stocks.Entities;
using crypto_stocks.Services;
using Newtonsoft.Json;

namespace crypto_stocks.Controllers;

[ApiController]
[Route("[controller]")]
public class StocksController : ControllerBase
{
    private readonly DataContext db;
    private readonly ICMCService cmcService = new CMCService();

    public StocksController(DataContext db)
    {
        this.db = db;
    }

    // route for [controller]/transactions
    [HttpGet]
    [Route("transactions")]
    public async Task<ActionResult> getTransactions([FromQuery] int limit = 10)
    {
        // Grab the newest transactions from the database
        var transactions = await Task.Run(() => db.Transactions
            .OrderByDescending(t => t.CreatedAt)
            .Take(limit)
            .ToList());

        return Ok(new ResponseData()
        {
            success = true,
            data = transactions
        });
    }

    // Async task
    [HttpGet]
    [ResponseCache(VaryByHeader = "User-Agent", Duration = 3600)] // Cache the response for an hour to limit API calls being abused
    public async Task<ActionResult> FetchStocksList()
    {
        var content = await cmcService.FetchStocksList();

        return Content(content, "application/json");
    }

    [HttpPost]

    public async Task<ActionResult> CreateOrder([FromBody] CreateOrderDTO orderDTO)
    {
        System.Console.WriteLine(JsonConvert.SerializeObject(orderDTO));
        // Check if the user has enough money to buy the stock
        var query = from w in db.Wallets
                    where w.UserId == orderDTO.userId && w.Symbol == "USD"
                    select w;


        var usdWallet = await Task.Run(() => query.FirstOrDefault<Wallet>());

        if (usdWallet == null) return NotFound(new ResponseData()
        {
            message = "Wallet not found",
            code = "NOT_FOUND"
        });

        decimal amountDecimal = orderDTO.units;
        var usdRate = await cmcService.GetUSDExchangeRate(amountDecimal, orderDTO.symbol);

        // Check if the user has enough money to buy the stock
        if (usdWallet.Balance < ((float)usdRate))
        {
            return BadRequest(new ResponseData()
            {
                message = "Insufficient funds",
                code = Codes.INSUFFICIENT_FUNDS
            });
        }

        // Create or update wallet for the stock
        var stockWallet = await Task.Run(() => db.Wallets.Where(w => w.UserId == orderDTO.userId && w.Symbol == orderDTO.symbol).FirstOrDefault<Wallet>());

        if (stockWallet == null)
        {
            stockWallet = new Wallet()
            {
                UserId = orderDTO.userId,
                Symbol = orderDTO.symbol,
                Balance = 0
            };

            await db.Wallets.AddAsync(stockWallet);
        }

        System.Console.WriteLine("Stock wallet: " + JsonConvert.SerializeObject(stockWallet));

        var transaction = new Transaction()
        {
            UserId = orderDTO.userId,
            Symbol = orderDTO.symbol,
            Amount = ((float)usdRate),
            Units = orderDTO.units,
            WalletId = stockWallet.Id
        };

        db.Transactions.Add(transaction);

        // TODO - Move to the finalize transaction handler
        // // Update the USD wallet 
        // usdWallet.Balance -= ((float)usdRate);
        // db.Wallets.Update(usdWallet);
        // stockWallet.Balance += (float)orderDTO.units;

        var changes = await db.SaveChangesAsync();

        if (changes > 0)
        {
            return Ok(new ResponseData()
            {
                message = "Order created",
                code = Codes.SUCCESS,
                data = transaction
            });
        }

        return BadRequest(new ResponseData()
        {
            message = "Failed to create order",
            code = Codes.DATABASE_ERROR
        });
    }


}