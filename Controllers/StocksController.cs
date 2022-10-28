using Microsoft.AspNetCore.Mvc;
using crypto_stocks.Helpers;
using System;
using System.Net;
using System.Net.Http;

namespace crypto_stocks.Controllers;

[ApiController]
[Route("[controller]")]
public class StocksController : ControllerBase
{
    private readonly DataContext db;
    private readonly String API_KEY = Environment.GetEnvironmentVariable("COINBASE_API_KEY")!;

    public StocksController(DataContext db)
    {
        this.db = db;
    }

    // Async task
    [HttpGet]
    [ResponseCache(VaryByHeader = "User-Agent", Duration = 3600)] // Cache the response for an hour to limit API calls being abused
    public async Task<ActionResult> FetchStocksList()
    {
        var client = new HttpClient();
        var url = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=10";
        client.DefaultRequestHeaders.Add("X-CMC_PRO_API_KEY", API_KEY);
        client.DefaultRequestHeaders.Add("Accept", "application/json");

        var response = await client.GetAsync(url);
        var content = await response.Content.ReadAsStringAsync();


        return Content(content, "application/json");
    }


}