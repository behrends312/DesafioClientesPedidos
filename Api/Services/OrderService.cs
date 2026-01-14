using Api.DTOs.Orders;
using Api.DTOs.ViewModels;
using Api.Entities;
using Api.Repositories;

namespace Api.Services;

public class OrderService(IOrderRepository orders, IClientRepository clients) : IOrderService
{
    public async Task<List<OrderVm>> GetAllAsync(CancellationToken ct)
    {
        var list = await orders.GetAllAsync(ct);
        return list.Select(MapOrderVm).ToList();
    }

    public async Task<OrderVm> GetByIdAsync(int id, CancellationToken ct)
    {
        var order = await orders.GetByIdAsync(id, ct);
        if (order is null) throw new KeyNotFoundException("Order not found.");
        return MapOrderVm(order);
    }

    public async Task<OrderVm> CreateAsync(OrderCreateDto dto, CancellationToken ct)
    {
        var client = await clients.GetByIdAsync(dto.ClientId, ct);
        if (client is null) throw new KeyNotFoundException("Client not found.");

        var order = new Order
        {
            ClientId = dto.ClientId,
            TotalAmount = dto.TotalAmount,
            OrderedAt = DateTime.UtcNow
        };

        var created = await orders.AddAsync(order, ct);
        return MapOrderVm(created);
    }

    public async Task<OrderVm> UpdateAsync(int id, OrderUpdateDto dto, CancellationToken ct)
    {
        var order = await orders.GetByIdAsync(id, ct);
        if (order is null) throw new KeyNotFoundException("Order not found.");

        order.TotalAmount = dto.TotalAmount;
        await orders.UpdateAsync(order, ct);

        return MapOrderVm(order);
    }

    public async Task DeleteAsync(int id, CancellationToken ct)
    {
        var order = await orders.GetByIdAsync(id, ct);
        if (order is null) throw new KeyNotFoundException("Order not found.");
        await orders.DeleteAsync(order, ct);
    }

    private static OrderVm MapOrderVm(Order o) => new(o.Id, o.ClientId, o.TotalAmount, o.OrderedAt);
}
