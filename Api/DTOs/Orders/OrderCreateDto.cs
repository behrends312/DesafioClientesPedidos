using System.ComponentModel.DataAnnotations;

namespace Api.DTOs.Orders;

public record OrderCreateDto(
    [Required] int ClientId,
    decimal TotalAmount
);
