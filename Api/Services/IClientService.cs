using Api.DTOs.Clients;
using Api.DTOs.ViewModels;

namespace Api.Services;

public interface IClientService
{
    Task<List<ClientVm>> GetAllAsync(CancellationToken ct);
    Task<ClientVm> GetByIdAsync(int id, CancellationToken ct);
    Task<ClientVm> CreateAsync(ClientCreateDto dto, CancellationToken ct);
    Task<ClientVm> UpdateAsync(int id, ClientUpdateDto dto, CancellationToken ct);
    Task DeleteAsync(int id, CancellationToken ct);
    Task<List<ClientWithOrdersVm>> GetAllWithOrdersAsync(CancellationToken ct);
}
