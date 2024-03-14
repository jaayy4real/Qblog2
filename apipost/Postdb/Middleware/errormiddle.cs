using System.Net;
using System.Text.Json;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

public class Exceptionhandler : IMiddleware
{
    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        try
        {
            await next(context);
        }
        catch (Exception ex)
        { 
           var response = context.Response;

           response.StatusCode = 500;

           var problem = new ProblemDetails{

            Type="https://datatracker.ietf.org/doc/html/rfc9110#section-15.6.1",
            Title="server error",
            Status=(int)HttpStatusCode.InternalServerError,
            Detail=ex.Message
            
                 };  

            string json = JsonSerializer.Serialize(problem);

            context.Response.ContentType = "application/problem+json";

            await context.Response.WriteAsync(json);

          
        }
    }
}