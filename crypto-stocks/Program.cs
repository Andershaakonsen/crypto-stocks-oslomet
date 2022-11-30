using System.Security.Claims;
using crypto_stocks.Entities;
using crypto_stocks.Helpers;
using crypto_stocks.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
{
    var services = builder.Services;
    var env = builder.Environment;

    // add db context
    services.AddDbContext<DataContext>();

    services.AddScoped<IWalletService, WalletService>();
    services.AddScoped<IStockService, StockService>();
    services.AddScoped<IAuthService, AuthService>();
    services.AddScoped<ICMCService, CMCService>();
    // Initialize auth
    services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    }).AddJwtBearer(options =>
    { // Setup JWT token validation
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = "https://localhost:5001",
            ValidAudience = "https://localhost:5001",
            IssuerSigningKey = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(Environment.GetEnvironmentVariable("JWT_SECRET")!))
        };

        // Whenever a token is validated, we want to add the user to the context
        options.Events = new JwtBearerEvents()
        {
            OnTokenValidated = context =>
            {
                var userId = int.Parse(context.Principal.FindFirstValue(ClaimTypes.NameIdentifier));
                var user = context.HttpContext.RequestServices.GetRequiredService<DataContext>().Users.Find(userId);
                if (user == null)
                {
                    context.Fail("Unauthorized");
                }

                // Using HttpContext.Features to store the user object while the request is being processed
                context.HttpContext.Features.Set<User>(user);
                return Task.CompletedTask;

            }
        };
    });
}


builder.Services.AddControllersWithViews();
builder.Services.AddResponseCaching(); // Add response caching to not drain coinbase API key limits


var app = builder.Build();
// Load .env file
DotNetEnv.Env.Load();

// migrate any database changes on startup (includes initial db creation)
using (var scope = app.Services.CreateScope())
{
    var dataContext = scope.ServiceProvider.GetRequiredService<DataContext>();
    dataContext.Database.EnsureCreated();
}

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();


app.UseResponseCaching(); // https://learn.microsoft.com/en-us/aspnet/core/performance/caching/response?view=aspnetcore-6.0
app.UseStaticFiles();
app.UseAuthentication();
app.UseRouting();
app.UseAuthorization();
app.UseMiddleware<ExceptionFilter>(); // Add custom exception filter middleware to handle uncaught exceptions

// All API endpoints here
app.UseEndpoints(endpoints =>
{
    endpoints.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");
});



app.MapFallbackToFile("index.html");

app.Run();
