using System.Net;
using System.Text.Json;

namespace Api.Middlewares;

public class ExceptionHandlingMiddleware(RequestDelegate next)
{
    public async Task Invoke(HttpContext ctx)
    {
        try
        {
            await next(ctx);
        }
        catch (Exception ex)
        {
            ctx.Response.ContentType = "application/json";

            var (status, message) = ex switch
            {
                KeyNotFoundException => (HttpStatusCode.NotFound, ex.Message),
                InvalidOperationException => (HttpStatusCode.BadRequest, ex.Message),
                _ => (HttpStatusCode.InternalServerError, "Unexpected error.")
            };

            ctx.Response.StatusCode = (int)status;

            var payload = JsonSerializer.Serialize(new { error = message });
            await ctx.Response.WriteAsync(payload);
        }
    }
}
