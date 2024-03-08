

public interface Iauth{

   
    public string register(string username,string email,string password);

    public Responseuser login(string username,string password);


    public Tempuser Identity(string id,string username,string email);

    public Tempuser pageIdentity(string id);
    
    public string refresh(string refeshtoken,string jwt);



}