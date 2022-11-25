using crypto_stocks.Entities;
using crypto_stocks.Helpers;
using Microsoft.AspNetCore.Identity;
// using identity

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
{
    var services = builder.Services;
    var env = builder.Environment;

    // add db context
    services.AddDbContext<DataContext>();
    // Initialize auth
    services.AddAuthentication();
    services.AddIdentity<Auth, IdentityRole>(o =>
    {
        o.Password.RequireDigit = false;
        o.Password.RequireLowercase = false;
        o.Password.RequireNonAlphanumeric = false;
        o.Password.RequireUppercase = false;
        o.User.RequireUniqueEmail = true;
    }).AddEntityFrameworkStores<DataContext>().AddDefaultTokenProviders();
}


builder.Services.AddControllersWithViews();
builder.Services.AddResponseCaching(); // Add response caching to not drain coinbase API key limits


var app = builder.Build();
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

// All API endpoints here
app.UseEndpoints(endpoints =>
{
    endpoints.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");
});



app.MapFallbackToFile("index.html");

app.Run();
