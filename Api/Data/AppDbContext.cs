using Api.Entities;
using Microsoft.EntityFrameworkCore;

namespace Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Client> Clients => Set<Client>();
    public DbSet<Order> Orders => Set<Order>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Client>()
            .HasIndex(c => c.Email)
            .IsUnique();

        modelBuilder.Entity<Client>()
            .HasMany(c => c.Orders)
            .WithOne(o => o.Client!)
            .HasForeignKey(o => o.ClientId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
