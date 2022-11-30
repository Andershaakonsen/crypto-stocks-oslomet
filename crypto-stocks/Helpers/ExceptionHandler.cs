using System.ComponentModel.DataAnnotations;
using System.Net;
using System.Text.Json;

namespace crypto_stocks.Helpers;

/**
* ExceptionHandler
* Custom implementation of https://jasonwatmore.com/post/2022/01/17/net-6-global-error-handler-tutorial-with-example
*/
public class ExceptionFilter
{
    private readonly RequestDelegate next;
    private readonly ILogger<ExceptionFilter> logger;

    public ExceptionFilter(RequestDelegate next, ILogger<ExceptionFilter> logger)
    {
        this.next = next;
        this.logger = logger;
    }

    public async Task Invoke(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, ex.Message);
            await HandleExceptionAsync(context, ex);
        }
    }

    private static Task HandleExceptionAsync(HttpContext context, Exception error)
    {
        context.Response.ContentType = "application/json";

        switch (error)
        {
            case ApplicationException e:
                context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                break;

            case ValidationException e:
                context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                break;

            case KeyNotFoundException e:
                context.Response.StatusCode = (int)HttpStatusCode.NotFound;
                break;

            case UnauthorizedAccessException e:
                context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                break;

            default:
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                break;
        }


        var result = JsonSerializer.Serialize(new { message = error?.Message });
        return context.Response.WriteAsync(result);
    }
}