using Api.DTOs.Clients;
using Api.DTOs.ViewModels;
using Api.Entities;
using Api.Repositories;

namespace Api.Services;

public class ClientService(IClientRepository repo) : IClientService
{
    public async Task<List<ClientVm>> GetAllAsync(CancellationToken ct)
    {
        var clients = await repo.GetAllAsync(ct);
        return clients.Select(MapClientVm).ToList();
    }

    public async Task<ClientVm> GetByIdAsync(int id, CancellationToken ct)
    {
        var client = await repo.GetByIdAsync(id, ct);
        if (client is null) throw new KeyNotFoundException("Client not found.");
        return MapClientVm(client);
    }

    public async Task<ClientVm> CreateAsync(ClientCreateDto dto, CancellationToken ct)
    {
        var existing = await repo.GetByEmailAsync(dto.Email, ct);
        if (existing is not null) throw new InvalidOperationException("Email already in use.");

        var client = new Client
        {
            Name = dto.Name.Trim(),
            Email = dto.Email.Trim(),
            CreatedAt = DateTime.UtcNow
        };

        var created = await repo.AddAsync(client, ct);
        return MapClientVm(created);
    }

    public async Task<ClientVm> UpdateAsync(int id, ClientUpdateDto dto, CancellationToken ct)
    {
        var client = await repo.GetByIdAsync(id, ct);
        if (client is null) throw new KeyNotFoundException("Client not found.");

        var emailOwner = await repo.GetByEmailAsync(dto.Email, ct);
        if (emailOwner is not null && emailOwner.Id != id)
            throw new InvalidOperationException("Email already in use.");

        client.Name = dto.Name.Trim();
        client.Email = dto.Email.Trim();

        await repo.UpdateAsync(client, ct);
        return MapClientVm(client);
    }

    public async Task DeleteAsync(int id, CancellationToken ct)
    {
        var client = await repo.GetByIdAsync(id, ct);
        if (client is null) throw new KeyNotFoundException("Client not found.");
        await repo.DeleteAsync(client, ct);
    }

    public async Task<List<ClientWithOrdersVm>> GetAllWithOrdersAsync(CancellationToken ct)
    {
        var clients = await repo.GetAllWithOrdersAsync(ct);
        return clients.Select(c => new ClientWithOrdersVm(
            c.Id,
            c.Name,
            c.Email,
            c.CreatedAt,
            c.Orders.Select(o => new OrderVm(o.Id, o.ClientId, o.TotalAmount, o.OrderedAt)).ToList()
        )).ToList();
    }

    private static ClientVm MapClientVm(Client c) => new(c.Id, c.Name, c.Email, c.CreatedAt);
}
