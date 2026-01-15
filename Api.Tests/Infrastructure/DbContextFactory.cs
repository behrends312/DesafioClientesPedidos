using System;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Api.Data;

namespace Api.Tests.Infrastructure;

public sealed class DbContextFactory : IDisposable
{
    private readonly SqliteConnection _connection;

    public DbContextFactory()
    {
        _connection = new SqliteConnection("DataSource=:memory:");
        _connection.Open();
    }

    public AppDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseSqlite(_connection)
            .Options;

        var ctx = new AppDbContext(options);
        ctx.Database.EnsureCreated();
        return ctx;
    }

    public void Dispose()
    {
        _connection.Close();
        _connection.Dispose();
    }
}
