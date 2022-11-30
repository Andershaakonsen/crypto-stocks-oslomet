using crypto_stocks.Controllers;
using crypto_stocks.Entities;
using crypto_stocks.Services;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit.Abstractions;

namespace crypto_stocks_tests;

public class WalletsControllerTest
{

    [Fact]
    public async Task Get()
    {
        // Arrange
        var mockRepo = new Mock<IWalletService>();
        mockRepo.Setup(repo => repo.GetWalletsByUserId(1))
            .Returns(GetTestWallets());
        var controller = new WalletsController(mockRepo.Object);

        // Act
        var result = await controller.Get(1);


        // Assert
        var taskResult = Assert.IsType<ActionResult<List<Wallet>>>(result);
        var okResult = Assert.IsType<OkObjectResult>(taskResult.Result);
        var list = Assert.IsType<List<Wallet>>(okResult.Value);

        Assert.Equal(2, list.Count);
    }

    [Fact]
    public async Task DepositToUserWallet()
    {
        // Arrange
        var mockRepo = new Mock<IWalletService>();

        mockRepo.Setup(repo => repo.DepositToUserWallet(1, 100))
            .Returns(GetTestWallet());

        var controller = new WalletsController(mockRepo.Object);

        // Act
        var result = await controller.DepositToUserWallet(new DepositDTO { userId = 1, amount = 100 });

        // Assert

        var taskResult = Assert.IsType<ActionResult<Wallet>>(result);
        var okResult = Assert.IsType<OkObjectResult>(taskResult.Result);
        var wallet = Assert.IsType<Wallet>(okResult.Value);

        Assert.Equal(1, wallet.UserId);
    }

    [Fact]
    public async Task DepositToUserWallet_Fail()
    {
        // Arrange
        var mockRepo = new Mock<IWalletService>();

        mockRepo.Setup(repo => repo.DepositToUserWallet(1, 100))
            .Returns(Task.FromResult<Wallet>(null));

        var controller = new WalletsController(mockRepo.Object);

        // Act
        var result = await controller.DepositToUserWallet(new DepositDTO { userId = 1, amount = 100 });

        // Assert

        var taskResult = Assert.IsType<ActionResult<Wallet>>(result);
        var badResult = Assert.IsType<BadRequestObjectResult>(taskResult.Result);
        Assert.Equal("Deposit failed", badResult.Value);
    }

    [Fact]
    public async Task WithdrawFromUserWallet()
    {
        // Arrange
        var mockRepo = new Mock<IWalletService>();

        mockRepo.Setup(repo => repo.WithdrawFromUserWallet(1, 100))
            .Returns(GetTestWallet());

        var controller = new WalletsController(mockRepo.Object);

        // Act
        var result = await controller.WithdrawFromUserWallet(new DepositDTO { userId = 1, amount = 100 });

        // Assert

        var taskResult = Assert.IsType<ActionResult<Wallet>>(result);
        var okResult = Assert.IsType<OkObjectResult>(taskResult.Result);
        var wallet = Assert.IsType<Wallet>(okResult.Value);

        Assert.Equal(1, wallet.UserId);
    }

    [Fact]
    public async Task WithdrawFromUserWallet_Fail()
    {
        // Arrange
        var mockRepo = new Mock<IWalletService>();

        mockRepo.Setup(repo => repo.WithdrawFromUserWallet(1, 100))
            .Returns(Task.FromResult<Wallet>(null));

        var controller = new WalletsController(mockRepo.Object);

        // Act
        var result = await controller.WithdrawFromUserWallet(new DepositDTO { userId = 1, amount = 100 });

        // Assert

        var taskResult = Assert.IsType<ActionResult<Wallet>>(result);
        var badResult = Assert.IsType<BadRequestObjectResult>(taskResult.Result);
        Assert.Equal("Withdraw failed", badResult.Value);
    }

    private async Task<List<Wallet>> GetTestWallets()
    {
        var wallets = new List<Wallet>
        {
            new Wallet { Id = 1, UserId = 1, Symbol = "USD", Balance = 100 },
            new Wallet { Id = 2, UserId = 1, Symbol = "BTC", Balance = 1.5f }
        };

        return wallets;
    }

    private async Task<Wallet> GetTestWallet()
    {
        var wallet = new Wallet { Id = 1, UserId = 1, Symbol = "USD", Balance = 100 };
        return wallet;
    }
}