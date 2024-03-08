using Microsoft.AspNetCore.Mvc;
using Postdb.model;
using Postdb.data;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Microsoft.Extensions.Logging;
namespace Postdb.Controllers;

[Authorize]
[ApiController]
public class Postcontroller:ControllerBase{

    private readonly Ipost posts;
    private readonly Ilike like;
    private readonly ILogger ilogger;
    private readonly IConfiguration config;

    public Postcontroller(Ipost posts,Ilike like,ILogger<Postcontroller> logger,IConfiguration config)
    {
        this.posts = posts;
        this.like = like;
        ilogger=logger;

        this.config=config;
    }

  
    [HttpPost ("api/Post")]
    public ActionResult Createpost(Postrequest request){


       var user= User.FindFirstValue(ClaimTypes.Name);
       var id= User.FindFirstValue(ClaimTypes.NameIdentifier);
       posts.Createpost(request,user,id);

       return Ok("success");

    }


    [AllowAnonymous]
    [HttpGet ("api/Post")]
    public ActionResult getallpost(){

       var response = posts.getpost();

       ilogger.LogInformation("got users successfully");

       return Ok(response);

    }

    [AllowAnonymous]
    [HttpPost ("api/Post/user")]
    public ActionResult getallpostbyuser([FromBody]string id){

       var response = posts.getpostuser(id);

       ilogger.LogInformation("got all '{0}' post successfully",id);

       return Ok(response);

    }

    [AllowAnonymous]
    [HttpGet ("api/Post/byfollowers/{id}")]
    public ActionResult getpostbyfollowers(string id){

       var response = posts.getpostbyfollowers(id);

       ilogger.LogInformation("got all post made by people '{0}' follows-successfully",id);

       return Ok(response);

    }
     
   
    [HttpGet ("api/Post/{id}")]
    public ActionResult get1post(string id){

       var response= posts.GetsinglePost(id);
      
       return Ok(response);

      //  var user= User.FindFirstValue(ClaimTypes.Name);
      // var email=User.FindFirstValue(ClaimTypes.Email);for testing purposes

    }
    
    [HttpPut ("api/Post/")]
    public ActionResult updatepost(string id,string title,string body){

           var response = posts.updatepost1(id,title,body);
            return Ok(response);

    }

     
     [HttpDelete ("api/Post/")]
    public ActionResult deletepost(string id){

       posts.deletepost(id);
       return Ok("success");

    }

    [AllowAnonymous]
    [HttpPost("api/Post/like")]

    public ActionResult likepost(string postid,string user){


      var response = like.Likepost(postid,user);  
      return Ok(response);

    }

     [AllowAnonymous]
    [HttpDelete("api/Post/like")]

    public ActionResult unlikepost(string likeid){

      var response=like.unLikepost(likeid);

      return Ok(response);

    }
    
    [AllowAnonymous]
     [HttpGet("api/Post/like")]

     public ActionResult likepostcount(string postid){
       
      var response = like.postcount(postid);
      return Ok(response );

    }


}