using MongoDB.Driver;
using Postdb.data;
using Postdb.gmodel.post;
using Postdb.model;

public interface Ipost{

   
    List<Post> getpost();

    List<Post> Mostlikedpost();

    List<Post> getpost(int page);

    List<Post> getpostuser(string id);

    List<Post> getpostuser(string id,int page);

    List<Post> getpostbyfollowers(string id);

    List<Post> getpostbyfollowers(string id,int page);


    Post GetsinglePost(string id);

    void Createpost(Postrequest post,string user,string id);

    void updatepost(Post post);

    void deletepost(string id);

    public UpdateResult updatepost1(string id,string title,string body);


}

