using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace crypto_stocks.Migrations
{
    public partial class AddMode : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Mode",
                table: "Transactions",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Mode",
                table: "Transactions");
        }
    }
}
