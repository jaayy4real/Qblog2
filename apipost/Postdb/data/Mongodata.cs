using System.Collections.ObjectModel;
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
    }
}
