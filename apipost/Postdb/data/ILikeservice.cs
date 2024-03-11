



using Postdb.gmodel.post;

public interface Ilike{

    public Likeobj Likepost(string likeid,string user);


    public bool unLikepost(string postid, string user);


    public responseCountObject postcount(string postid,string userid);


}