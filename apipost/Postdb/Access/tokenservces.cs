using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

public class Tokenaccess:Itoken{

    private readonly Validator _validator;

    public Tokenaccess(IOptions<Validator> validator)
    {
        _validator = validator.Value;
    }

    
    public string gentoken(string username,string email,string userid){


        var signcredentials= new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_validator.secret)),SecurityAlgorithms.HmacSha256);

        var claims= new[]{
            new Claim(ClaimTypes.Name,username),
            new Claim(ClaimTypes.NameIdentifier,userid),
            new Claim(JwtRegisteredClaimNames.Email,email),
            new Claim(JwtRegisteredClaimNames.Jti,Guid.NewGuid().ToString())
        };

        var securitytoken = new JwtSecurityToken(
            issuer:_validator.Issuer,
            audience:_validator.Audience,
            expires:DateTime.UtcNow.AddMinutes(10),
            claims:claims,
            signingCredentials:signcredentials

        );

        return new JwtSecurityTokenHandler().WriteToken(securitytoken);

      }

      public string genrefreshtoken()
    {
        var randomNumber = new byte[64];

            using var generator = RandomNumberGenerator.Create();

            generator.GetBytes(randomNumber);

            return Convert.ToBase64String(randomNumber);
    }


}