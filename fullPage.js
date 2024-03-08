document.addEventListener("DOMContentLoaded", function () {
    const title = document.getElementById("title");
    const body = document.getElementById("body");
    const username = document.getElementById("username");
    const postId = localStorage.getItem("postId");
    const postTitle = localStorage.getItem("title");
    const postBody = localStorage.getItem("body");
    const postUsername = localStorage.getItem("username");
    

    title.textContent = postTitle
    body.textContent = postBody
    username.textContent = postUsername
})