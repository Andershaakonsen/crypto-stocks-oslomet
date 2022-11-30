using Microsoft.AspNetCore.Mvc;
using crypto_stocks.DTO;
using crypto_stocks.Entities;
using crypto_stocks.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;

namespace crypto_stocks.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
public class StocksController : ControllerBase
{
    private readonly IStockService stockService;
    private readonly ICMCService cmcService;

    public StocksController(IStockService stockService, ICMCService cmcService)
    {
        this.stockService = stockService;
        this.cmcService = cmcService;
    }

    [HttpGet]
    public async Task<ActionResult<List<Transaction>>> GetTransactions([FromQuery] int limit = 10)
    {
        var user = HttpContext.Features.Get<User>()!;
        // Grab the newest transactions from the database
        var transactions = await stockService.GetTransactionsByUser(user.Id, limit);

        return Ok(transactions);
    }

    [HttpGet]
    [Route("currencies")]
    [ResponseCache(VaryByHeader = "User-Agent", Duration = 3600)] // Cache the response for an hour to limit API calls being abused
    public async Task<ActionResult> FetchStocksList()
    {
        var content = await cmcService.FetchStocksList();

        return Content(content, "application/json");
    }

    [HttpGet]
    [Route("{id}")]
    public async Task<ActionResult<Transaction>> GetTransaction(int id)
    {
        var transaction = await stockService.GetTransactionById(id);

        if (transaction == null)
        {
            return NotFound("Transaction not found");
        }

        return Ok(transaction);
    }

    [HttpPost]
    public async Task<ActionResult<Transaction>> CreatePosition([FromBody] CreateOrderDTO orderDTO)
    {
        try
        {
            var transaction = await stockService.CreateTransaction(orderDTO.userId, orderDTO.units, orderDTO.symbol);

            return Ok(transaction);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }


    [HttpDelete]
    [Route("{id}")]
    public async Task<ActionResult<string>> SellPosition([FromRoute] int id)
    {
        var user = HttpContext.Features.Get<User>()!;
        try
        {
            var transaction = await stockService.DeleteTransaction(user.Id, id);
            if (!transaction) return BadRequest("Could not sell position");

            return Ok("Position sold");
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpPatch]
    [Route("{id}")]

    public async Task<ActionResult<Transaction>> UpdatePosition([FromRoute] int id, [FromBody] UpdateOrderDTO orderDTO)
    {
        var user = HttpContext.Features.Get<User>()!;
        try
        {
            var transaction = await stockService.UpdateTransactionUnits(user.Id, id, orderDTO.units);

            return Ok(transaction);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }
}