using Microsoft.AspNetCore.Mvc;
using crypto_stocks.Helpers;
using crypto_stocks.Entities;
using crypto_stocks.DTO;
namespace crypto_stocks.Controllers;

[ApiController]
[Route("[controller]")]
public class WalletsController : ControllerBase
{
    private readonly DataContext db;

    public WalletsController(DataContext db)
    {
        this.db = db;
    }

    [HttpGet]
    public IActionResult Get([FromQuery] int userId)
    {
        var wallets = db.Wallets
            .Where(w => w.UserId == userId).ToList();

        var response = new ResponseData();
        if (wallets == null) response.data = new List<Wallet>();
        else response.data = wallets;

        return Ok(response);
    }


    /**
    * Update the balance of the USD WALLET. Deposits are NOT possible for crypto wallets.
    **/
    [HttpPost]
    public async Task<ActionResult<Wallet>> DepositToUserWallet([FromBody] DepositDTO deposit)
    {

        // Query for wallet 
        var query = from w in db.Wallets
                    where w.UserId == deposit.userId
                    select w;

        var wallet = query.FirstOrDefault<Wallet>();

        // If wallet does not exist, just create it
        if (wallet == null)
        {
            wallet = new Wallet();
            wallet.UserId = deposit.userId;
            wallet.Balance = deposit.amount;
            db.Wallets.Add(wallet);
        }
        else
        {
            wallet.Balance += deposit.amount;
        }

        var result = await db.SaveChangesAsync();
        if (result > 0)
        {
            return Ok(new ResponseData { data = wallet, success = true, message = "Deposit successful" });
        }
        else
        {
            return BadRequest(new ResponseData { success = false, message = "Deposit failed", code = Codes.DATABASE_ERROR });
        }
    }

    /**
    * Update the balance of the USD WALLET. Withdrawals are NOT possible for crypto wallets.
    **/
    [HttpPatch]
    public async Task<ActionResult> WithdrawFromUserWallet([FromBody] DepositDTO withdrawal)
    {

        // Query for wallet 
        var query = from w in db.Wallets
                    where w.UserId == withdrawal.userId
                    select w;

        var wallet = query.FirstOrDefault<Wallet>();

        // If wallet does not exist, respond with not found
        if (wallet == null)
        {
            return NotFound(new { message = "Wallet does not exist", code = Codes.NOT_FOUND });
        }

        // If wallet balance is less than withdrawal amount, respond with insufficient funds
        if (wallet.Balance < withdrawal.amount)
        {
            return BadRequest(new { message = "Insufficient funds to withdraw", code = Codes.INSUFFICIENT_FUNDS });
        }


        wallet.Balance -= withdrawal.amount;


        var result = await db.SaveChangesAsync();
        if (result > 0)
        {
            return Ok(new { data = wallet, message = "success" });
        }
        else
        {
            return BadRequest(new { message = "Could not withdraw funds", code = Codes.DATABASE_ERROR });
        }
    }
}
