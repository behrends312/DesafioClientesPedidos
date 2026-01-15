using System;
using System.Threading;
using System.Threading.Tasks;
using Api.DTOs.Clients;
using Api.DTOs.Orders;
using Api.Repositories;
using Api.Services;
using Api.Tests.Infrastructure;
using FluentAssertions;
using Xunit;

namespace Api.Tests.Services;

public class OrderServiceTests
{
    [Fact]
    public async Task CreateAsync_ShouldCreateOrder_WhenClientExists()
    {
        using var factory = new DbContextFactory();
        using var ctx = factory.CreateContext();

        var clientRepo = new ClientRepository(ctx);
        var orderRepo = new OrderRepository(ctx);

        var clientService = new ClientService(clientRepo);
        var orderService = new OrderService(orderRepo, clientRepo);

        var client = await clientService.CreateAsync(
            new ClientCreateDto("Rodrigo", "rodrigo@teste.com"),
            CancellationToken.None
        );

        var created = await orderService.CreateAsync(
            new OrderCreateDto(client.Id, 200m),
            CancellationToken.None
        );

        created.Id.Should().BeGreaterThan(0);
        created.ClientId.Should().Be(client.Id);
        created.TotalAmount.Should().Be(200m);
        created.OrderedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(10));
    }

    [Fact]
    public async Task CreateAsync_ShouldFail_WhenClientDoesNotExist()
    {
        using var factory = new DbContextFactory();
        using var ctx = factory.CreateContext();

        var clientRepo = new ClientRepository(ctx);
        var orderRepo = new OrderRepository(ctx);

        var orderService = new OrderService(orderRepo, clientRepo);

        Func<Task> act = async () =>
            await orderService.CreateAsync(new OrderCreateDto(9999, 100m), CancellationToken.None);

        await act.Should().ThrowAsync<Exception>();
    }
}
