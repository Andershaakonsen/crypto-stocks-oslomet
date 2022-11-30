namespace crypto_stocks_tests;

using crypto_stocks.Controllers;
using crypto_stocks.DTO;
using crypto_stocks.Entities;
using crypto_stocks.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Newtonsoft.Json.Linq;

public class StocksControllerTest
{
    [Fact]
    public async Task GetTransactions()
    {
        // Arrange
        var mockService = new Mock<IStockService>();
        mockService.Setup(repo => repo.GetTransactionsByUser(1, 10)).Returns(GetFakeTransactions());

        var controller = new StocksController(mockService.Object, null);
        // Populate feature data to simulate JWT request succeeded
        controller.ControllerContext = new ControllerContext();
        controller.ControllerContext.HttpContext = new DefaultHttpContext();
        controller.ControllerContext.HttpContext.Features.Set<User>(new User { Id = 1 });


        // Act
        var result = await controller.GetTransactions(10);

        // Assert
        var taskResult = Assert.IsType<ActionResult<List<Transaction>>>(result);
        var okResult = Assert.IsType<OkObjectResult>(taskResult.Result);
        var transactions = Assert.IsType<List<Transaction>>(okResult.Value);

        Assert.Equal(2, transactions.Count);
    }

    [Fact]
    public async Task FetchStocksList()
    {
        // Arrange
        var mockService = new Mock<IStockService>();
        var cmcService = new Mock<ICMCService>();
        cmcService.Setup(repo => repo.FetchStocksList()).Returns(GetFakeStocksList());

        var controller = new StocksController(mockService.Object, cmcService.Object);

        // Act
        var result = await controller.FetchStocksList();

        System.Console.WriteLine(result.GetType());
        // Assert
        var taskResult = Assert.IsType<ContentResult>(result);

        Assert.Equal("application/json", taskResult.ContentType);
    }

    [Fact]
    public async Task GetTransaction()
    {
        // Arrange
        var mockService = new Mock<IStockService>();
        mockService.Setup(repo => repo.GetTransactionById(10)).Returns(GetFakeTransaction());

        var controller = new StocksController(mockService.Object, null!);

        // Act
        var result = await controller.GetTransaction(10);

        // Assert
        var taskResult = Assert.IsType<ActionResult<Transaction>>(result);
        var okResult = Assert.IsType<OkObjectResult>(taskResult.Result);
        var transaction = Assert.IsType<Transaction>(okResult.Value);

        Assert.Equal(10, transaction.Id);
    }

    [Fact]
    public async Task GetTransaction_NotFound()
    {
        // Arrange
        var mockService = new Mock<IStockService>();
        mockService.Setup(repo => repo.GetTransactionById(10)).Returns(GetNullTransaction());

        var controller = new StocksController(mockService.Object, null!);

        // Act
        var result = await controller.GetTransaction(10);

        // Assert
        var taskResult = Assert.IsType<ActionResult<Transaction>>(result);
        var notFoundResult = Assert.IsType<NotFoundObjectResult>(taskResult.Result);

        Assert.Equal("Transaction not found", notFoundResult.Value);
    }

    [Fact]
    public async Task CreatePosition()
    {
        // Arrange
        var mockService = new Mock<IStockService>();
        mockService.Setup(repo => repo.CreateTransaction(1, 1, "BTC")).Returns(GetFakeTransaction());

        var controller = new StocksController(mockService.Object, null!);

        var orderDTO = new CreateOrderDTO
        {
            units = 1,
            symbol = "BTC",
            userId = 1
        };
        // Act
        var result = await controller.CreatePosition(orderDTO);

        // Assert
        var taskResult = Assert.IsType<ActionResult<Transaction>>(result);
        var okResult = Assert.IsType<OkObjectResult>(taskResult.Result);
        var transaction = Assert.IsType<Transaction>(okResult.Value);

        Assert.Equal(1, transaction.Units);
    }

    [Fact]
    public async Task CreatePosition_Fail()
    {
        // Arrange
        var mockService = new Mock<IStockService>();
        mockService.Setup(repo => repo.CreateTransaction(1, 1, "BTC")).Throws(new Exception("Insufficient funds"));

        var controller = new StocksController(mockService.Object, null!);

        var orderDTO = new CreateOrderDTO
        {
            units = 1,
            symbol = "BTC",
            userId = 1
        };
        // Act
        var result = await controller.CreatePosition(orderDTO);

        // Assert
        var taskResult = Assert.IsType<ActionResult<Transaction>>(result);
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(taskResult.Result);

        Assert.Equal("Insufficient funds", badRequestResult.Value);
    }

    [Fact]
    public async Task SellPosition()
    {
        // Arrange
        var mockService = new Mock<IStockService>();
        mockService.Setup(repo => repo.DeleteTransaction(1, 1)).Returns(Task.Run(() => true));

        var controller = new StocksController(mockService.Object, null!);
        // Populate feature data to simulate JWT request succeeded
        controller.ControllerContext = new ControllerContext();
        controller.ControllerContext.HttpContext = new DefaultHttpContext();
        controller.ControllerContext.HttpContext.Features.Set<User>(new User { Id = 1 });

        // Act
        var result = await controller.SellPosition(1);

        // Assert
        var taskResult = Assert.IsType<ActionResult<string>>(result);
        var okResult = Assert.IsType<OkObjectResult>(taskResult.Result);
        var success = Assert.IsType<string>(okResult.Value);
    }

    [Fact]
    public async Task SellPosition_Error()
    {
        // Arrange
        var mockService = new Mock<IStockService>();
        mockService.Setup(repo => repo.DeleteTransaction(1, 1)).Throws(new Exception("Could not sell position"));

        var controller = new StocksController(mockService.Object, null!);
        // Populate feature data to simulate JWT request succeeded
        controller.ControllerContext = new ControllerContext();
        controller.ControllerContext.HttpContext = new DefaultHttpContext();
        controller.ControllerContext.HttpContext.Features.Set<User>(new User { Id = 1 });

        // Act
        var result = await controller.SellPosition(1);

        // Assert
        var taskResult = Assert.IsType<ActionResult<string>>(result);
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(taskResult.Result);

        Assert.Equal("Could not sell position", badRequestResult.Value);
    }

    [Fact]
    public async Task SellPosition_Fail()
    {
        // Arrange
        var mockService = new Mock<IStockService>();
        mockService.Setup(repo => repo.DeleteTransaction(1, 1)).Returns(Task.Run(() => false));

        var controller = new StocksController(mockService.Object, null!);
        // Populate feature data to simulate JWT request succeeded
        controller.ControllerContext = new ControllerContext();
        controller.ControllerContext.HttpContext = new DefaultHttpContext();
        controller.ControllerContext.HttpContext.Features.Set<User>(new User { Id = 1 });

        // Act
        var result = await controller.SellPosition(1);

        // Assert
        var taskResult = Assert.IsType<ActionResult<string>>(result);
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(taskResult.Result);

        Assert.Equal("Could not sell position", badRequestResult.Value);
    }

    [Fact]
    public async Task UpdatePosition()
    {
        // Arrange
        var mockService = new Mock<IStockService>();
        mockService.Setup(repo => repo.UpdateTransactionUnits(1, 1, 1)).Returns(GetFakeTransaction());

        var controller = new StocksController(mockService.Object, null!);
        // Populate feature data to simulate JWT request succeeded
        controller.ControllerContext = new ControllerContext();
        controller.ControllerContext.HttpContext = new DefaultHttpContext();
        controller.ControllerContext.HttpContext.Features.Set<User>(new User { Id = 1 });

        var orderDTO = new UpdateOrderDTO
        {
            units = 1,
        };

        // Act
        var result = await controller.UpdatePosition(1, orderDTO);

        // Assert
        var taskResult = Assert.IsType<ActionResult<Transaction>>(result);
        var okResult = Assert.IsType<OkObjectResult>(taskResult.Result);
        var transaction = Assert.IsType<Transaction>(okResult.Value);

        Assert.Equal(1, transaction.Units);
    }

    [Fact]
    public async Task UpdatePosition_Fail()
    {
        // Arrange
        var mockService = new Mock<IStockService>();
        mockService.Setup(repo => repo.UpdateTransactionUnits(1, 1, 1)).Throws(new Exception("Could not update position"));

        var controller = new StocksController(mockService.Object, null!);
        // Populate feature data to simulate JWT request succeeded
        controller.ControllerContext = new ControllerContext();
        controller.ControllerContext.HttpContext = new DefaultHttpContext();
        controller.ControllerContext.HttpContext.Features.Set<User>(new User { Id = 1 });

        var orderDTO = new UpdateOrderDTO
        {
            units = 1,
        };

        // Act
        var result = await controller.UpdatePosition(1, orderDTO);

        // Assert
        var taskResult = Assert.IsType<ActionResult<Transaction>>(result);
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(taskResult.Result);

        Assert.Equal("Could not update position", badRequestResult.Value);
    }


    private async Task<List<Transaction>> GetFakeTransactions()
    {
        return new List<Transaction> {
            new Transaction {
                Id = 1,
                UserId = 1,
                Symbol = "BTC",
                Units = 1,
                Amount = 10000,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now
            },
            new Transaction {
                Id = 2,
                UserId = 1,
                Symbol = "ETH",
                Units = 1,
                Amount = 3600,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now
            },
        };
    }

    private async Task<Transaction> GetFakeTransaction()
    {
        return new Transaction
        {
            Id = 10,
            UserId = 1,
            Symbol = "BTC",
            Units = 1,
            Amount = 10000,
            CreatedAt = DateTime.Now,
            UpdatedAt = DateTime.Now
        };
    }

    private async Task<string> GetFakeStocksList()
    {
        JObject o = new JObject(
            new JProperty("symbol", "btc"),
            new JProperty("price", 14400)
        );

        JObject o2 = new JObject(
            new JProperty("symbol", "eth"),
            new JProperty("price", 3600)
        );

        JObject oList = new JObject(
            new JProperty("data", new JArray(o, o2))
        );

        return oList.ToString();
    }

    private async Task<Transaction> GetNullTransaction()
    {
        return null;
    }
}