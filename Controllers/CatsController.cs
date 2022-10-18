using Microsoft.AspNetCore.Mvc;
using crypto_stocks.Helpers;
using crypto_stocks.Entities;
namespace crypto_stocks.Controllers;

[ApiController]
[Route("[controller]")]
public class CatsController : ControllerBase
{
    private readonly DataContext db;

    public CatsController(DataContext db)
    {
        this.db = db;
    }

    [HttpPost]
    // Async task
    public async Task<ActionResult<Cat>> Create([FromBody] Cat cat)
    {
        
        await db.Cats.AddAsync(cat);
    
        return cat;
    }
}
