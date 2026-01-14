using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Api.Entities;

public class Order
{
    public int Id { get; set; }

    [Required]
    public int ClientId { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal TotalAmount { get; set; }

    public DateTime OrderedAt { get; set; } = DateTime.UtcNow;

    public Client? Client { get; set; }
}
