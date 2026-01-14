using Api.Data;
using Api.Entities;
using Microsoft.EntityFrameworkCore;

namespace Api.Repositories;

public class OrderRepository(AppDbContext db) : IOrderRepository
{
    public Task<List<Order>> GetAllAsync(CancellationToken ct) =>
        db.Orders.AsNoTracking().OrderBy(o => o.Id).ToListAsync(ct);

    public Task<Order?> GetByIdAsync(int id, CancellationToken ct) =>
        db.Orders.FirstOrDefaultAsync(o => o.Id == id, ct);

    public async Task<Order> AddAsync(Order order, CancellationToken ct)
    {
        db.Orders.Add(order);
        await db.SaveChangesAsync(ct);
        return order;
    }

    public async Task UpdateAsync(Order order, CancellationToken ct)
    {
        db.Orders.Update(order);
        await db.SaveChangesAsync(ct);
    }

    public async Task DeleteAsync(Order order, CancellationToken ct)
    {
        db.Orders.Remove(order);
        await db.SaveChangesAsync(ct);
    }
}
