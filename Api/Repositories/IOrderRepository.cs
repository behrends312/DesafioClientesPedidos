using Api.Entities;

namespace Api.Repositories;

public interface IOrderRepository
{
    Task<List<Order>> GetAllAsync(CancellationToken ct);
    Task<Order?> GetByIdAsync(int id, CancellationToken ct);
    Task<Order> AddAsync(Order order, CancellationToken ct);
    Task UpdateAsync(Order order, CancellationToken ct);
    Task DeleteAsync(Order order, CancellationToken ct);
}
