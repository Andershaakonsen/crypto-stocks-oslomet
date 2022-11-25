using Microsoft.AspNetCore.Mvc;
using crypto_stocks.Helpers;
using crypto_stocks.DTO;
using crypto_stocks.Entities;
using crypto_stocks.Services;

namespace crypto_stocks.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StocksController : ControllerBase
{
    private readonly DataContext db;
    private readonly ICMCService cmcService = new CMCService();

    public StocksController(DataContext db)
    {
        this.db = db;
    }

    // Route for [controller]/transactions
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

    public async Task<ActionResult> CreatePosition([FromBody] CreateOrderDTO orderDTO)
    {
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
        var stockWallet = db.Wallets.Where(w => w.UserId == orderDTO.userId && w.Symbol == orderDTO.symbol).FirstOrDefault<Wallet>();

        if (stockWallet == null)
        {
            stockWallet = new Wallet();

            stockWallet.UserId = orderDTO.userId;
            stockWallet.Symbol = orderDTO.symbol;
            stockWallet.Balance = 0;

            db.Wallets.Add(stockWallet);
        }

        var transaction = new Transaction()
        {
            UserId = orderDTO.userId,
            Symbol = orderDTO.symbol,
            Amount = ((float)usdRate),
            Units = orderDTO.units,
            Wallet = stockWallet,
        };

        db.Transactions.Add(transaction);


        // Update the USD wallet 
        usdWallet.Balance -= ((float)usdRate);
        stockWallet.Balance += (float)orderDTO.units;

        try
        {
            var changes = await db.SaveChangesAsync();

            if (changes > 0)
            {

                return Ok(new ResponseData()
                {
                    message = "Order created",
                    code = Codes.SUCCESS,
                });
            }

            return BadRequest(new ResponseData()
            {
                message = "Failed to create order",
                code = Codes.DATABASE_ERROR
            });
        }
        catch (Exception e)
        {
            Console.WriteLine("Error saving changes: " + e.Message);
            System.Console.Write(e);

            return BadRequest(new ResponseData()
            {
                message = "Failed to create order",
                code = Codes.DATABASE_ERROR
            });
        }
    }


    [HttpDelete]
    [Route("{id}")]
    public async Task<ActionResult> SellPosition([FromRoute] int id)
    {
        // Make sure all required rows exists in the database
        var transaction = await Task.Run(() => db.Transactions.Where(t => t.Id == id).FirstOrDefault<Transaction>());

        if (transaction == null) return NotFound(new ResponseData()
        {
            message = "Transaction not found",
            code = Codes.NOT_FOUND
        });

        var stockWallet = await Task.Run(() => db.Wallets.Where(w => w.Id == transaction.WalletId).FirstOrDefault<Wallet>());

        if (stockWallet == null) return NotFound(new ResponseData()
        {
            message = "Wallet not found",
            code = Codes.NOT_FOUND
        });

        var usdWallet = await Task.Run(() => db.Wallets.Where(w => w.UserId == transaction.UserId && w.Symbol == "USD").FirstOrDefault<Wallet>());

        if (usdWallet == null) return NotFound(new ResponseData()
        {
            message = "Wallet not found",
            code = Codes.NOT_FOUND
        });


        // Call API to get the current USD rate for the stock
        var usdRate = await cmcService.GetUSDExchangeRate(transaction.Units, transaction.Symbol);

        usdWallet.Balance += ((float)usdRate);
        stockWallet.Balance -= (float)transaction.Units;
        db.Wallets.Update(usdWallet);
        db.Wallets.Update(stockWallet);
        db.Transactions.Remove(transaction);

        await db.SaveChangesAsync();

        return Ok(new ResponseData()
        {
            message = "Order deleted",
            code = Codes.SUCCESS
        });
    }

    [HttpPatch]
    [Route("{id}")]

    public async Task<ActionResult> UpdatePosition([FromRoute] int id, [FromBody] UpdateOrderDTO orderDTO)
    {
        var transaction = await Task.Run(() => db.Transactions.Where(t => t.Id == id).FirstOrDefault<Transaction>());

        if (transaction == null) return NotFound(new ResponseData()
        {
            message = "Transaction not found",
            code = Codes.NOT_FOUND
        });

        var stockWallet = await Task.Run(() => db.Wallets.Where(w => w.Id == transaction.WalletId).FirstOrDefault<Wallet>());

        if (stockWallet == null) return NotFound(new ResponseData()
        {
            message = "Wallet not found",
            code = Codes.NOT_FOUND
        });

        var usdWallet = await Task.Run(() => db.Wallets.Where(w => w.UserId == transaction.UserId && w.Symbol == "USD").FirstOrDefault<Wallet>());

        if (usdWallet == null) return NotFound(new ResponseData()
        {
            message = "Wallet not found",
            code = Codes.NOT_FOUND
        });


        // Check the amount of units in the orderDTO and compare it to the current units
        // If the units are less than the current units, sell the difference, otherwise buy the difference. 
        // If the units are the same then just return a success message and status not modified
        if (orderDTO.units == transaction.Units)
        {
            return Ok(new ResponseData()
            {
                message = "No changes made",
                code = Codes.SUCCESS
            });
        }


        if (orderDTO.units < transaction.Units)
        {
            // Sell the difference
            var difference = transaction.Units - orderDTO.units;
            var differenceUSD = await cmcService.GetUSDExchangeRate(difference, transaction.Symbol);

            usdWallet.Balance += ((float)differenceUSD);
            stockWallet.Balance -= (float)difference;
            transaction.Amount -= ((float)differenceUSD);
            db.Wallets.Update(usdWallet);
            db.Wallets.Update(stockWallet);
        }
        else if (orderDTO.units > transaction.Units)
        {
            // Buy the difference
            var difference = orderDTO.units - transaction.Units;
            var differenceUSD = await cmcService.GetUSDExchangeRate(difference, transaction.Symbol);

            if (usdWallet.Balance < ((float)differenceUSD))
            {
                return BadRequest(new ResponseData()
                {
                    message = "Insufficient funds",
                    code = Codes.INSUFFICIENT_FUNDS
                });
            }

            usdWallet.Balance -= ((float)differenceUSD);
            stockWallet.Balance += (float)difference;
            transaction.Amount += ((float)differenceUSD);
            db.Wallets.Update(usdWallet);
            db.Wallets.Update(stockWallet);
        }

        transaction.Units = orderDTO.units;

        db.Transactions.Update(transaction);

        await db.SaveChangesAsync();

        return Ok(new ResponseData()
        {
            message = "Order updated",
            code = Codes.SUCCESS
        });


    }

}