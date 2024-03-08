using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

public class Followers{

   [BsonId]
   [BsonRepresentation(BsonType.ObjectId)] 
    public string Id{get;set;}
    

    [BsonRepresentation(BsonType.ObjectId)] 
     public string userid{get;set;}

}