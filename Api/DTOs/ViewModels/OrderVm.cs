namespace Api.DTOs.ViewModels;

public record OrderVm(int Id, int ClientId, decimal TotalAmount, DateTime OrderedAt);
