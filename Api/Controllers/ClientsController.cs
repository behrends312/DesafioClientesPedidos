using Api.DTOs.Clients;
using Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[ApiController]
[Route("api/v1/clients")]
public class ClientsController(IClientService service) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken ct) =>
        Ok(await service.GetAllAsync(ct));

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id, CancellationToken ct) =>
        Ok(await service.GetByIdAsync(id, ct));

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] ClientCreateDto dto, CancellationToken ct)
    {
        var created = await service.CreateAsync(dto, ct);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] ClientUpdateDto dto, CancellationToken ct) =>
        Ok(await service.UpdateAsync(id, dto, ct));

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, CancellationToken ct)
    {
        await service.DeleteAsync(id, ct);
        return NoContent();
    }

    [HttpGet("with-orders")]
    public async Task<IActionResult> GetAllWithOrders(CancellationToken ct) =>
        Ok(await service.GetAllWithOrdersAsync(ct));
}
