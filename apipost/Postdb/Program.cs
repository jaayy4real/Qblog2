using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Postdb.data;
using Postdb.gmodel.post;

var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<Validator>(builder.Configuration.GetSection("Validator"));
builder.Services.Configure<ConnectionStrings>(builder.Configuration.GetSection("ConnectionStrings"));


// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddTransient<Itoken,Tokenaccess>();
builder.Services.AddScoped<Ipost,Mongodata>();
builder.Services.AddScoped<Ilike,Mongodata>();
builder.Services.AddTransient<Iauth,Authuser>();
builder.Services.AddScoped<Ifollow,Authuser>();
builder.Services.AddTransient<Exceptionhandler>();


using var loggerFactory = LoggerFactory.Create(b => b.SetMinimumLevel(LogLevel.Trace).AddConsole());


builder.Services.AddAuthentication(defaultScheme:JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options => {

                    var jwtoptions = builder.Configuration.GetSection("Validator").Get<Validator>();

//                 options.SaveToken=true;
                    options.TokenValidationParameters = new TokenValidationParameters(){

                    ValidIssuer=jwtoptions?.Issuer,
                    ValidAudience=jwtoptions?.Audience,
                    IssuerSigningKey=new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtoptions.secret)),
                    ValidateIssuer=true,
                    ValidateLifetime=true,
                    ValidateIssuerSigningKey=true,
                    ValidateAudience=true,

                    };

                    options.Events = new JwtBearerEvents{

                        OnChallenge = opt => LogAttempt(opt.Request.Headers,"OnChallenge"),
                        OnTokenValidated=opt=> LogAttempt(opt.Request.Headers,"OnTokenValidated"),

                    };

                });
builder.Services.AddAuthorization();


builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

if(builder.Environment.IsDevelopment())
{
    builder.Services.AddCors(options =>
    {
        
        options.AddDefaultPolicy(
            policy =>
            {
                policy.AllowAnyOrigin()
                    .AllowAnyHeader()
                    .AllowAnyMethod();
            });
    });
}

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();

}


app.UseCors();
app.UseMiddleware<Exceptionhandler>();
app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();


app.MapControllers();

app.Run();

Task LogAttempt(IHeaderDictionary headers, string eventType)
{
    var logger = loggerFactory.CreateLogger<Program>();

    var authorizationHeader = headers["Authorization"].FirstOrDefault();

    if (authorizationHeader is null)
        logger.LogInformation($"{eventType}. JWT not present");
    else
    {
        string jwtString = authorizationHeader.Substring("Bearer ".Length);

        var jwt = new JwtSecurityToken(jwtString);

        logger.LogInformation($"{eventType}. Expiration: {jwt.ValidTo.ToLongTimeString()}. System time: {DateTime.UtcNow.ToLongTimeString()}");
    }

    return Task.CompletedTask;
}