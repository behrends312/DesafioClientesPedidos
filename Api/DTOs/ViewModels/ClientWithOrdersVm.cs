namespace Api.DTOs.ViewModels;

public record ClientWithOrdersVm(
    int Id,
    string Name,
    string Email,
    DateTime CreatedAt,
    IReadOnlyList<OrderVm> Orders
);
