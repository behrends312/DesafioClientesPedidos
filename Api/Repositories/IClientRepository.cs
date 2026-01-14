using Api.Entities;

namespace Api.Repositories;

public interface IClientRepository
{
    Task<List<Client>> GetAllAsync(CancellationToken ct);
    Task<Client?> GetByIdAsync(int id, CancellationToken ct);
    Task<Client?> GetByEmailAsync(string email, CancellationToken ct);
    Task<Client> AddAsync(Client client, CancellationToken ct);
    Task UpdateAsync(Client client, CancellationToken ct);
    Task DeleteAsync(Client client, CancellationToken ct);
    Task<List<Client>> GetAllWithOrdersAsync(CancellationToken ct);
}
