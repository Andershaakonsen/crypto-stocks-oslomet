using Microsoft.AspNetCore.Mvc;
using crypto_stocks.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using crypto_stocks.Services;
using crypto_stocks.DTO;

namespace crypto_stocks.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]

public class WalletsController : ControllerBase
{
    private readonly IWalletService walletService;

    public WalletsController(IWalletService walletService)
    {
        this.walletService = walletService;
    }

    [HttpGet]
    public async Task<ActionResult<List<Wallet>>> Get([FromQuery] int userId)
    {
        var wallets = await walletService.GetWalletsByUserId(userId);

        return Ok(wallets == null ? new List<Wallet>() : wallets);
    }

    [HttpPost]
    public async Task<ActionResult<Wallet>> DepositToUserWallet([FromBody] DepositDTO deposit)
    {
        var wallet = await walletService.DepositToUserWallet(deposit.userId, deposit.amount);
        if (wallet != null)
        {
            return Ok(wallet);
        }
        else
        {
            return BadRequest("Deposit failed");
        }
    }

    [HttpPatch]
    public async Task<ActionResult<Wallet>> WithdrawFromUserWallet([FromBody] DepositDTO withdrawal)
    {
        var wallet = await walletService.WithdrawFromUserWallet(withdrawal.userId, withdrawal.amount);
        if (wallet != null)
        {
            return Ok(wallet);
        }
        else
        {
            return BadRequest("Withdraw failed");
        }
    }
}
