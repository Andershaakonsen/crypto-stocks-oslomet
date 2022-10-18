using crypto_stocks.Helpers;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
{
    var services = builder.Services;
    var env = builder.Environment;

    // add db context
    services.AddDbContext<DataContext>();
}

builder.Services.AddControllersWithViews();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
    app.UseHttpsRedirection();
}

// app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

app.UseEndpoints(endpoints =>
{
    endpoints.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");
});

/**
* If we are in dev mode, init SPA dev server and proxy requests
* This is added to replace Webpack bundler with Vite which is much more modern and easy to setup. 
*/
if (app.Environment.IsDevelopment())
{   
    app.UseSpa(spa =>
    {
        /* If request is unhandled redirect to Vite server */
        spa.UseProxyToSpaDevelopmentServer("http://localhost:3000");
    });
}
else
{
    app.MapFallbackToFile("index.html");
}

app.Run();
