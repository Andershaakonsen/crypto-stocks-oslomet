namespace crypto_stocks.Helpers;
using crypto_stocks.Entities;

using Microsoft.EntityFrameworkCore;

public class DataContext : DbContext
{
    protected readonly IConfiguration Configuration;

    public DataContext(IConfiguration configuration)
    {
        Configuration = configuration;
    }

    protected override void OnConfiguring(DbContextOptionsBuilder options)
    {
        // connect to sqlite database
        options.UseSqlite(Configuration.GetConnectionString("WebApiDatabase"));
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // create a unique index on the user name
        modelBuilder.Entity<User>().HasData(new { Id = 1, Name = "John Doe" });
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Wallet> Wallets { get; set; }

    public DbSet<Transaction> Transactions { get; set; }
}