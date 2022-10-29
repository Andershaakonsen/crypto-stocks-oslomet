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
builder.Services.AddResponseCaching();


var app = builder.Build();
DotNetEnv.Env.Load();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
    app.UseHttpsRedirection();
}

// app.UseHttpsRedirection();
app.UseResponseCaching(); // https://learn.microsoft.com/en-us/aspnet/core/performance/caching/response?view=aspnetcore-6.0
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
// if (app.Environment.IsDevelopment())
// {
//     // app.UseSpa(spa =>
//     // {
//     //     /* If request is unhandled redirect to Vite server */
//     //     spa.UseProxyToSpaDevelopmentServer("http://localhost:3000");
//     // });

//     // app.MapFallback(context =>
//     // {
//     //     Console.WriteLine(context.Request.Path);
//     //     // context.Response.Redirect("http://localhost:3000");
//     //     return Task.CompletedTask;
//     // });
// }
// else
// {
//     app.MapFallbackToFile("index.html");
// }

// app.MapFallbackToFile("index.html");
// app.MapFallbackToFile("/login", "/login.html");
// app.MapFallbackToFile("/history", "/history.html");


app.Run();
