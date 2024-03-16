



using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Bson;
using MongoDB.Driver;

public class Authuser : Iauth, Ifollow
{    

    private readonly ConnectionStrings _connect;
    private readonly Itoken key;

    private readonly Validator _validator;

    

    public Authuser(IOptions<ConnectionStrings> connect,Itoken key,IOptions<Validator> validator)
    {
        _connect = connect.Value;
        this.key = key;
        _validator=validator.Value;
    }

    string database = "User";

    string collectionname= "users";

    private IMongoCollection<T> getcollection<T>(in string collect){

        var connect = new MongoClient(_connect.MongoDbConnectionString);
        var db = connect.GetDatabase(database);

        return db.GetCollection<T>(collect);


    }

    public Tempuser Identity(string id, string username, string email)
    {
        var response = new Tempuser{id=id,username=username,email=email};

        return response;
    }



    public Responseuser login(string username, string password)
    {
        var collect = getcollection<User>(collectionname);

        var usern=Builders<User>.Filter.Eq(x=>x.username,username);
        var pass=Builders<User>.Filter.Eq(x=>x.password,password);

        var filter = Builders<User>.Filter.And(usern,pass);

        //
        var exist = collect.Find(filter).FirstOrDefault();

         if (exist != null)
     {
        var token = key.gentoken(username,exist.email,exist.id);

        var response = new Responseuser(){
            token=token,
            refreshtoken=exist.RefreshToken,
            id=exist.id
        };
     
         return response;
     }
    else
     {
        throw new Exception("username or password wrong");
     }

    }

    
    public string register(string username, string email, string password)
    {
        var collect = getcollection<User>(collectionname);

        var exist = collect.Find(u => u.username == username && u.password == password).FirstOrDefault();

        if(exist != null){

         throw new Exception("mandem user name is already taken");

        };

        var  objid = ObjectId.GenerateNewId().ToString();
        var k=key.gentoken(username,email,objid);

        var refresh=key.genrefreshtoken();

        var user = new User{
            id=objid,
            username=username,
            email=email,
            RefreshToken=refresh,
            password=password,
            followers=new List<Followers>{},
            createdAt=DateTime.UtcNow,
            expires=DateTime.UtcNow.AddDays(60)            
        };
        //change this later


        collect.InsertOne(user);

        //  var response = new Responseuser(){
        //     token=k,
        //     refreshtoken=refresh     
        // }; this returned a token previously
        
        return "successfully registered ";
        
    }

    public string refresh(string refeshtoken, string jwt)
    {
        var principals = GetPrincipalFromExpiredToken(jwt);

        if (principals?.Identity?.Name is null)
               throw new Exception("user not authorized(name null)");
        
         var collect = getcollection<User>(collectionname);
         var user = collect.Find(x=>x.username==principals.Identity.Name).FirstOrDefault();

        if (user is null || user.RefreshToken != refeshtoken || user.expires < DateTime.UtcNow)
                throw new Exception("user not authorized second failure point");

        var tok = key.gentoken(user.username,user.email,user.id);

        return tok;
      
    }

    public Tempuser pageIdentity(string id)
    {
         var collect = getcollection<User>(collectionname);

        var exist = collect.Find(u => u.id == id).FirstOrDefault();

         if (exist != null)
    {

        var response = new Tempuser(){
            id=exist.id,
            username=exist.username,
            email=exist.email
        };
       
        return response;
    }
    else
    {
        throw new Exception("invalid user identity status code:"+ StatusCodes.Status404NotFound);
        // return null;
    }
   
    }

    

    public void follow(string id,string followerid)
    {
        var collect = getcollection<User>(collectionname);

        var isalreadyfollowing=collect.Find(x=>x.id==id).FirstOrDefault();

        if(isalreadyfollowing.followers.Any(x=>x.userid==followerid)){

            throw new Exception("already followed user");

        }

        var follow = new Followers{userid=followerid,Id=ObjectId.GenerateNewId().ToString()};

        var filter = Builders<User>.Filter.Eq(u=>u.id,id);
        var update = Builders<User>.Update.Push(u=>u.followers,follow);

        collect.UpdateOne(filter,update);

    }

    public void unfollow(string id,string followerid)
    {
        var collect = getcollection<User>(collectionname);

        var filter = Builders<User>.Filter.Eq(u=>u.id,id);

        var update = Builders<User>.Update.PullFilter(u=>u.followers,f=>f.userid==followerid);

        collect.UpdateOne(filter,update);
    }

     private ClaimsPrincipal? GetPrincipalFromExpiredToken (string token) {

        var jwtoptions = _validator;

                
        var Parameters = new TokenValidationParameters(){

            ValidIssuer=jwtoptions?.Issuer,
            ValidAudience=jwtoptions?.Audience,
            IssuerSigningKey=new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtoptions.secret)),
            ValidateIssuer=true,
            ValidateLifetime=false,
            ValidateIssuerSigningKey=true,
            ValidateAudience=true,

        };
            
        return new JwtSecurityTokenHandler().ValidateToken(token, Parameters, out _);
    }


    public bool followstate(string following, string user)
    {
         var collect = getcollection<User>(collectionname);

         var respond = collect.Find(u => u.id == following).FirstOrDefault();

        if (respond != null)
          {
              if (respond.followers != new List<Followers>{} && respond.followers.Any(f => f.userid == user))
            {
               return true;
            }
          }

         return false;
         
    }
}
