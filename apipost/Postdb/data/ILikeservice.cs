



using Postdb.gmodel.post;

public interface Ilike{

    public Likeobj Likepost(string likeid,string user);


    public bool unLikepost(string likeid);


    public responseCountObject postcount(string postid,string userid);


}