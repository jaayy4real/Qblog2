﻿using System.Collections.ObjectModel;
using System.Net;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;
using Postdb.gmodel.post;
using Postdb.model;

namespace Postdb.data
{
    public class Mongodata : Ipost, Ilike
    {

        private readonly ConnectionStrings _connect;

        public Mongodata(IOptions<ConnectionStrings> connect)
        {
            _connect = connect.Value;
        }

        string database = "Quick";
        private const string colloctionname = "Postv1";

        private const string colloctionname2 = "LikesV3";



        public IMongoCollection<T> mongoCollection<T>(in string collection)
        {
            var connect = new MongoClient(_connect.MongoDbConnectionString);
            var db = connect.GetDatabase(database);
            return db.GetCollection<T>(collection);

        }


        public void Createpost(Postrequest post, string user, string id)
        {
            var posts = new Post
            {
                body = post.body,
                title = post.title,
                Username = user,
                Userid = id,
                CreatedAt = DateTime.UtcNow

            };

            var collect = mongoCollection<Post>(colloctionname);

            collect.InsertOne(posts);


        }

        public void deletepost(string id)
        {
            var collect = mongoCollection<Post>(colloctionname);
            collect.DeleteOne<Post>(x => x.id == id);

        }

        public List<Post> getpost()
        {

            var collect = mongoCollection<Post>(colloctionname);

            return collect.Find<Post>(_ => true).ToList();
        }

         public List<Post> getpost(int page)
        {
            var collect = mongoCollection<Post>(colloctionname);
            int num = (page-1)*10;
            return collect.Find<Post>(_ => true).Skip(num).Limit(10).ToList();
        }

        public List<Post> getpostuser(string id)
        {
            var collect = mongoCollection<Post>(colloctionname);

            return collect.Find<Post>(x => x.Userid == id).ToList();
        }

        public Post GetsinglePost(string id)
        {
            var collect = mongoCollection<Post>(colloctionname);

            return collect.Find<Post>(x => x.id == id).FirstOrDefault();
        }

        public void updatepost(Post post)
        {
            var collect = mongoCollection<Post>(colloctionname);
            var filter = Builders<Post>.Filter.Eq("id", post.id);
            var update = Builders<Post>.Update.Set(x => x.title, post.title).Set(x => x.title, post.body);

            collect.UpdateOne(filter, update);

        }

        public UpdateResult updatepost1(string id, string title, string body)
        {
            var collect = mongoCollection<Post>(colloctionname);
            var filter = Builders<Post>.Filter.Eq("id", id);
            var update = Builders<Post>.Update.Set(x => x.title, title).Set(x => x.body, body);



            return collect.UpdateOne(filter, update);

        }

        public Likeobj Likepost(string postid, string user)
        {
            var collect = mongoCollection<Likes>(colloctionname2);

            var obj = collect.Find(x => x.Postid == postid && x.Userid==user).FirstOrDefault();

            if(obj != null){

                throw new Exception("already liked post");
            }

            var lik = new Likes { Id = ObjectId.GenerateNewId().ToString(), state= true ,Postid = postid, Userid = user };

            collect.InsertOne(lik);

            Likeobj response = new Likeobj { likeid = lik.Id, state = lik.state };

            return response;

        }

        public bool unLikepost(string postid, string user)
        {
            var collect = mongoCollection<Likes>(colloctionname2);
            collect.DeleteOne(x => x.Postid == postid && x.Userid==user);
            
            return false;
        }

            
        public responseCountObject postcount(string postid,string userid)
        {
            var collect = mongoCollection<Likes>(colloctionname2);

            bool state = false;
            string num = collect.CountDocuments(x => x.Postid == postid).ToString();

            var res = collect.Find(x => x.Postid == postid && x.Userid==userid).FirstOrDefault();

            if(res!=null){

                state=true;

            }

            var num2 = new responseCountObject (  num, state );
            return num2;

        }

        private List<string> getfollowerslist(string userid)
        {

            var con = new MongoClient(_connect.MongoDbConnectionString);
            var dbs = con.GetDatabase("User");
            var collection = dbs.GetCollection<User>("users");

            var filter = Builders<User>.Filter.ElemMatch(x => x.followers, u => u.userid == userid);
            var userisfollowing = collection.Find(filter).ToList();

            if (userisfollowing == null)
            {
                throw new Exception("bitch pls follow somebody");
            }
            return userisfollowing.Select(u => u.username).ToList();

        }

        public List<Post> getpostbyfollowers(string userid)
        {
            var list = getfollowerslist(userid);

            var filter1 = Builders<Post>.Filter.In(x => x.Username, list);

            var coll = mongoCollection<Post>(colloctionname);
            return coll.Find(filter1).ToList();

            //optimise this to trown an exception when list is null so the mongo query will not run
        }

        public List<Post> getpostuser(string id, int page)
        {
            var collect = mongoCollection<Post>(colloctionname);
            int num=(page-1)*10;
            return collect.Find<Post>(x => x.Userid == id).Skip(num).Limit(10).ToList();
        }

        public List<Post> getpostbyfollowers(string userid, int page)
        {
           var list = getfollowerslist(userid);

            var filter1 = Builders<Post>.Filter.In(x => x.Username, list);

            var coll = mongoCollection<Post>(colloctionname);
            int num =(page-1)*10;
            return coll.Find(filter1).Skip(num).Limit(10).ToList();
        }

        public List<Post> Mostlikedpost()
        {

            var list = test();

            return list;
            
        }

        private List<Post> test(){
                  
        var result = mongoCollection<Post>(colloctionname);
        var result2 = mongoCollection<Likes>(colloctionname2);

        var driver = result.AsQueryable()
                           .GroupJoin(
                            result2.AsQueryable(),
                            x=>x.id,
                            y=>y.Postid,
                            (post,likes)=>new {Post=post,likecount=likes.Count()}
                           ).OrderByDescending(x=>x.likecount)
                           .Select(x=>x.Post)
                           .Take(5)
                           .ToList();

            return driver;               

        }

        private List<Result> Mlikedpost(int num){
             
             var collect = mongoCollection<Likes>(colloctionname2);

             var post = collect.Aggregate()
                                .Group(x=>x.Postid,ac =>new Result(ac.Key,ac.Sum(u=>1)))
                                .SortByDescending(r=>r.total).Limit(num).ToList();
                                
            //  var response = post.Select(x=>x.key).ToList(); 

            //  return response;
            return post;

            
            // var filter = Builders<Post>.Filter.In(x=>x.id,list); for most liked post scattered version

            // return collect.Find(filter).ToList();
        }

        public List<Post> feedpost()
        {
           throw new NotImplementedException(); 
        }

        public List<Post> feedpost(int page)
        {
            throw new NotImplementedException();
        }

        public async Task<string> Feedback(string body)
        {
            var connect = new MongoClient(_connect.MongoDbConnectionString);
            var db = connect.GetDatabase("feedback");
            var collect =db.GetCollection<Feedbck>("feedbacks");

            var response = new Feedbck{username="Anonymous",body=body,date=DateTime.UtcNow};

            await collect.InsertOneAsync(response);

            return "sucess";
            
        }

        private class Feedbck{

        public string? username{get;set;}
        public string? body{get;set;}
        public DateTime date{get;set;}

        }
    }
}
