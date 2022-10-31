using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace crypto_stocks.Migrations
{
    public partial class RevertTransactionMode : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Mode",
                table: "Transactions");

            migrationBuilder.DropColumn(
                name: "status",
                table: "Transactions");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Mode",
                table: "Transactions",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "status",
                table: "Transactions",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }
    }
}
