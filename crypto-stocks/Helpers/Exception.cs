using System.Net;

namespace crypto_stocks.Helpers;

public class ServiceException : Exception
{
    public HttpStatusCode Code;
    public ServiceException(string message, HttpStatusCode code = HttpStatusCode.BadRequest) : base(message)
    {
        Code = code;
    }
}