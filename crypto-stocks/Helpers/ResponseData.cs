namespace crypto_stocks.Helpers;

public class ResponseData
{
    public object? data { get; set; }
    public string message { get; set; } = "success";
    public bool success { get; set; } = true;

    public string code { get; set; } = "SUCCESS";
}


// Response code strings
public static class Codes
{
    public static string SUCCESS = "SUCCESS";
    public static string DATABASE_ERROR = "DATABASE_ERROR";
    public static string NOT_FOUND = "NOT_FOUND";
    public static string INSUFFICIENT_FUNDS = "INSUFFICIENT_FUNDS";

}