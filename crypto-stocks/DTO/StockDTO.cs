namespace crypto_stocks.DTO;

public class CreateOrderDTO
{
    public String symbol { get; set; } = null!;

    public decimal units { get; set; }

    public int userId { get; set; }

}

public class UpdateOrderDTO
{
    public decimal units { get; set; }
}