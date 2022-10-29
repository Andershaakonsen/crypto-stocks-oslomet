using Newtonsoft.Json.Linq;

namespace crypto_stocks.Services;
public interface ICMCService
{
    Task<String> FetchStocksList();
    Task<decimal?> GetUSDExchangeRate(decimal amount, String symbol);
}

public class CMCService : ICMCService
{
    public async Task<String> FetchStocksList()
    {
        var client = new HttpClient();
        var url = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=10";
        client.DefaultRequestHeaders.Add("X-CMC_PRO_API_KEY", Environment.GetEnvironmentVariable("COINBASE_API_KEY")!);
        client.DefaultRequestHeaders.Add("Accept", "application/json");

        var response = await client.GetAsync(url);
        var content = await response.Content.ReadAsStringAsync();

        return content;
    }


    public async Task<decimal?> GetUSDExchangeRate(decimal amount, String symbol)
    {
        var client = new HttpClient();
        var url = "https://pro-api.coinmarketcap.com/v2/tools/price-conversion?amount=" + amount + "&symbol=" + symbol + "&convert=USD";

        client.DefaultRequestHeaders.Add("X-CMC_PRO_API_KEY", Environment.GetEnvironmentVariable("COINBASE_API_KEY")!);
        client.DefaultRequestHeaders.Add("Accept", "application/json");

        var response = await client.GetAsync(url);
        var content = await response.Content.ReadAsStringAsync();

        // Using Newtonsoft.Json.Linq here to parse the JSON response since we dont just send them out.
        var jObject = JObject.Parse(content);
        var price = jObject["data"]?[0]?["quote"]?["USD"]?["price"]?.Value<decimal>();

        if (price == null)
        {
            throw new Exception("Price is null");
        }

        return price;
    }
}