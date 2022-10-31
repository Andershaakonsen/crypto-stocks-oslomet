using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace crypto_stocks.Migrations
{
    public partial class RemoveIndexWallet : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Wallets_UserId_Symbol",
                table: "Wallets");

            migrationBuilder.CreateIndex(
                name: "IX_Wallets_UserId",
                table: "Wallets",
                column: "UserId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Wallets_UserId",
                table: "Wallets");

            migrationBuilder.CreateIndex(
                name: "IX_Wallets_UserId_Symbol",
                table: "Wallets",
                columns: new[] { "UserId", "Symbol" },
                unique: true);
        }
    }
}
