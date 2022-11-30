
using System.ComponentModel.DataAnnotations;

namespace crypto_stocks.DTO;
/**
* Deposit DTO for incoming deposits and withdrawals
*/
public class DepositDTO
{
    [Required]
    public int userId { get; set; }
    [Required]
    public long amount { get; set; }
}