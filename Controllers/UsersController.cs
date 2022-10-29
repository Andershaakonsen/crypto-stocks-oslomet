using Microsoft.AspNetCore.Mvc;
using crypto_stocks.Helpers;
using crypto_stocks.Entities;

namespace crypto_stocks.Controllers;

[ApiController]
[Route("[controller]")]
public class UsersController : ControllerBase
{
    private readonly DataContext db;
    private readonly String API_KEY = Environment.GetEnvironmentVariable("COINBASE_API_KEY")!;

    public UsersController(DataContext db)
    {
        this.db = db;
    }

    // [HttpPost]
    // public async Task<ActionResult<User>> CreateUser()
    // {
    //     var insertUser = new User();
    //     insertUser.Name = "John Doe";

    //     var foundUser = await db.Users.FindAsync(1);
    //     User user;
    //     if (foundUser == null)
    //     {
    //         db.Users.Add(insertUser);
    //         await db.SaveChangesAsync();
    //         user = insertUser;
    //     }
    //     else user = foundUser;

    //     Response.Cookies.Append("metfi:user_id", user.Id.ToString(), new CookieOptions
    //     {
    //         Expires = DateTimeOffset.Now.AddHours(1)
    //     });

    //     return user;
    // }
}