using Microsoft.AspNetCore.Mvc;
using crypto_stocks.Helpers;
using crypto_stocks.Entities;
using crypto_stocks.DTO;
namespace crypto_stocks.Controllers;

[ApiController]
[Route("[controller]")]
public class WalletController : ControllerBase
{
    private readonly DataContext db;

    public WalletController(DataContext db)
    {
        this.db = db;
    }

    [HttpPost]
    // Async task
    public async Task<ActionResult<Wallet>> DepositToUserWallet([FromBody] DepositDTO deposit)
    {

        var query = from w in db.Wallets
                    where w.UserId == deposit.UserId
                    select w;

        var wallet = query.FirstOrDefault<Wallet>();

        if (wallet == null)
        {
            return NotFound();
        }

        wallet.Balance += deposit.Amount;

        var result = await db.SaveChangesAsync();
        if (result > 0)
        {
            return Ok(wallet);
        }
        else
        {
            return BadRequest();
        }
    }
}
