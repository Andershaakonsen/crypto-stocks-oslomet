using System.ComponentModel.DataAnnotations;

namespace crypto_stocks.DTO;

public class CreateOrderDTO
{
    [Required]
    public String symbol { get; set; } = null!;

    [Required]
    public decimal units { get; set; }

    [Required]
    public int userId { get; set; }

}

public class UpdateOrderDTO
{
    [Required]
    public decimal units { get; set; }
}