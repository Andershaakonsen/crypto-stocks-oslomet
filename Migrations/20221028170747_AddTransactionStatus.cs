using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace crypto_stocks.Migrations
{
    public partial class AddTransactionStatus : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "status",
                table: "Transaction",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "status",
                table: "Transaction");
        }
    }
}
