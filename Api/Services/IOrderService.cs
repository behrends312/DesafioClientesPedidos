using Api.DTOs.Orders;
using Api.DTOs.ViewModels;

namespace Api.Services;

public interface IOrderService
{
    Task<List<OrderVm>> GetAllAsync(CancellationToken ct);
    Task<OrderVm> GetByIdAsync(int id, CancellationToken ct);
    Task<OrderVm> CreateAsync(OrderCreateDto dto, CancellationToken ct);
    Task<OrderVm> UpdateAsync(int id, OrderUpdateDto dto, CancellationToken ct);
    Task DeleteAsync(int id, CancellationToken ct);
}
