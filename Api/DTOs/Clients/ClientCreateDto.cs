using System.ComponentModel.DataAnnotations;

namespace Api.DTOs.Clients;

public record ClientCreateDto(
    [Required, MaxLength(200)] string Name,
    [Required, EmailAddress, MaxLength(200)] string Email
);
