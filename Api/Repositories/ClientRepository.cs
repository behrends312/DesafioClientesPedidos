using Api.Data;
using Api.Entities;
using Microsoft.EntityFrameworkCore;

namespace Api.Repositories;

public class ClientRepository(AppDbContext db) : IClientRepository
{
    public Task<List<Client>> GetAllAsync(CancellationToken ct) =>
        db.Clients.AsNoTracking().OrderBy(c => c.Id).ToListAsync(ct);

    public Task<Client?> GetByIdAsync(int id, CancellationToken ct) =>
        db.Clients.FirstOrDefaultAsync(c => c.Id == id, ct);

    public Task<Client?> GetByEmailAsync(string email, CancellationToken ct) =>
        db.Clients.FirstOrDefaultAsync(c => c.Email == email, ct);

    public async Task<Client> AddAsync(Client client, CancellationToken ct)
    {
        db.Clients.Add(client);
        await db.SaveChangesAsync(ct);
        return client;
    }

    public async Task UpdateAsync(Client client, CancellationToken ct)
    {
        db.Clients.Update(client);
        await db.SaveChangesAsync(ct);
    }

    public async Task DeleteAsync(Client client, CancellationToken ct)
    {
        db.Clients.Remove(client);
        await db.SaveChangesAsync(ct);
    }

    public Task<List<Client>> GetAllWithOrdersAsync(CancellationToken ct) =>
        db.Clients
            .AsNoTracking()
            .Include(c => c.Orders.OrderBy(o => o.Id))
            .OrderBy(c => c.Id)
            .ToListAsync(ct);
}
