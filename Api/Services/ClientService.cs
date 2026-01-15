using System.Text.RegularExpressions;
using Api.DTOs.Clients;
using Api.DTOs.ViewModels;
using Api.Entities;
using Api.Repositories;

namespace Api.Services;

public class ClientService(IClientRepository repo) : IClientService
{
    private static readonly Regex EmailRegex =
        new(@"^[^\s@]+@[^\s@]+\.[^\s@]+$", RegexOptions.Compiled);

    public async Task<List<ClientVm>> GetAllAsync(CancellationToken ct)
    {
        var clients = await repo.GetAllAsync(ct);
        return clients.Select(MapClientVm).ToList();
    }

    public async Task<ClientVm> GetByIdAsync(int id, CancellationToken ct)
    {
        var client = await repo.GetByIdAsync(id, ct);
        if (client is null) throw new KeyNotFoundException("Cliente não encontrado");
        return MapClientVm(client);
    }

    public async Task<ClientVm> CreateAsync(ClientCreateDto dto, CancellationToken ct)
    {
        Validate(dto.Name, dto.Email);

        var email = dto.Email.Trim();
        var existing = await repo.GetByEmailAsync(email, ct);
        if (existing is not null) throw new InvalidOperationException("Email em uso.");

        var client = new Client
        {
            Name = dto.Name.Trim(),
            Email = email,
            CreatedAt = DateTime.UtcNow
        };

        var created = await repo.AddAsync(client, ct);
        return MapClientVm(created);
    }

    public async Task<ClientVm> UpdateAsync(int id, ClientUpdateDto dto, CancellationToken ct)
    {
        Validate(dto.Name, dto.Email);

        var client = await repo.GetByIdAsync(id, ct);
        if (client is null) throw new KeyNotFoundException("Cliente não encontrado.");

        var email = dto.Email.Trim();
        var emailOwner = await repo.GetByEmailAsync(email, ct);
        if (emailOwner is not null && emailOwner.Id != id)
            throw new InvalidOperationException("Email em uso.");

        client.Name = dto.Name.Trim();
        client.Email = email;

        await repo.UpdateAsync(client, ct);
        return MapClientVm(client);
    }

    public async Task DeleteAsync(int id, CancellationToken ct)
    {
        var client = await repo.GetByIdAsync(id, ct);
        if (client is null) throw new KeyNotFoundException("Cliente não encontrado.");
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

    private static void Validate(string name, string email)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Nome é obrigatório.");

        if (string.IsNullOrWhiteSpace(email))
            throw new ArgumentException("Email é obrigatório.");

        var normalized = email.Trim();
        if (!EmailRegex.IsMatch(normalized))
            throw new ArgumentException("Email inválido.");
    }

    private static ClientVm MapClientVm(Client c) => new(c.Id, c.Name, c.Email, c.CreatedAt);
}
