
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;


[ApiController]
public class Pagecontroller:ControllerBase{


    public readonly Iauth _auth;
    private readonly Ipost posts;


    public Pagecontroller(Iauth auth,Ipost posts)
    {
        _auth = auth;
        this.posts = posts;
    }


    [HttpGet("api/page/{id}")]

    public ActionResult getuserpage(string id){
       
    

        var user = _auth.pageIdentity(id);

        if (user == null)
       {

        return NotFound();

       }

        var post = posts.getpostuser(id);

        return Ok(new{user,post});

    }




}