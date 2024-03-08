using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

public class User{


    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string id{get; set;}

    public string username{get;set;}

    public string email{get;set;}

    public string password{get;set;}

    public string RefreshToken{get;set;}

    public DateTime expires{get;set;}

    public List<Followers> followers{get;set;}

    public DateTime createdAt{get;set;}

}