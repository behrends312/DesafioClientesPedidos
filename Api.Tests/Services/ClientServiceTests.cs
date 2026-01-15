using System;
using System.Threading;
using System.Threading.Tasks;
using Api.DTOs.Clients;
using Api.Repositories;
using Api.Services;
using Api.Tests.Infrastructure;
using FluentAssertions;
using Xunit;

namespace Api.Tests.Services;

public class ClientServiceTests
{
    [Fact]
    public async Task CreateAsync_ShouldCreateClient_WithCreatedAt()
    {
        using var factory = new DbContextFactory();
        using var ctx = factory.CreateContext();

        var repo = new ClientRepository(ctx);
        var service = new ClientService(repo);

        var dto = new ClientCreateDto("Carlos", "carlos@teste.com");

        var created = await service.CreateAsync(dto, CancellationToken.None);

        created.Id.Should().BeGreaterThan(0);
        created.Name.Should().Be("Carlos");
        created.Email.Should().Be("carlos@teste.com");
        created.CreatedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(10));
    }

    [Fact]
    public async Task CreateAsync_ShouldFail_WhenEmailIsInvalid()
    {
        using var factory = new DbContextFactory();
        using var ctx = factory.CreateContext();

        var repo = new ClientRepository(ctx);
        var service = new ClientService(repo);

        var dto = new ClientCreateDto("Carlos", "email-invalido");

        Func<Task> act = async () => await service.CreateAsync(dto, CancellationToken.None);

        await act.Should().ThrowAsync<ArgumentException>()
        .WithMessage("*Email inválido*");
    }
}
