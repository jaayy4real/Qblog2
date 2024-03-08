using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

public class Post
    {
         [BsonId]
         [BsonRepresentation(BsonType.ObjectId)]
         public string id{get;set;}

         public string Username{get;set;}

         public string Userid{get;set;}

         public string title{get;set;}

         public string body{get;set;}

         public DateTime CreatedAt{get;set;}
         
    }
