document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM content loaded');
    const apiBaseUrl = 'http://localhost:5105';
    const token = localStorage.getItem('token');
    console.log(token);
    const userID = localStorage.getItem('userID');
    const userna = localStorage.getItem('usename')

    function fetchAndDisplayPosts() {
        const endpoint = '/api/Post';

        fetch(apiBaseUrl + endpoint)
            .then(response => response.json())
            .then(displayData)
            .catch(error => console.error(error));
    }
// fetchAndDisplayPosts()
    // Function to display posts
    function displayData(data) {
        const dataList = document.getElementById('api-data-list');
        dataList.innerHTML = '';

        data.forEach(item => {
            const postHolder = document.createElement('section');
            postHolder.classList.add('post-holder'); // Adding class for styling


            const title = document.createElement('h3');
            title.classList.add('post-title');
            title.textContent = item.title;

           

            const usernames = document.createElement('p');
            usernames.classList.add('post-username');
            usernames.textContent = `${item.username}`;
            console.log(item);

            usernames.addEventListener('click', function(){
                localStorage.setItem('usernamePost', item.username)
                localStorage.setItem('getUser', item.userid)
                window.location.href = 'get-profile.html'
            })


            const body = document.createElement('p');
            body.classList.add('post-main');
            body.style.display = 'inline-block';
            // body.textContent = item.body;
            const showMoreButton =  document.createElement('a')
            showMoreButton.classList.add('show-more')
            showMoreButton.style.color = 'red'
            showMoreButton.href = 'full-page.html'
            showMoreButton.addEventListener('click', function(){
            
                // localStorage.setItem('postID',item.id);
                localStorage.setItem('title',item.title);
                localStorage.setItem('body',item.body);
                localStorage.setItem('username', item.username);
                // alert(postID)
            })
                 const truncated = item.body.substring(0,200)
              
                body.textContent = `${truncated}...`
                
               
                showMoreButton.textContent= 'show more'
                if(body.textContent.length < 100){
                    showMoreButton.style.display='none'
                    body.textContent = `${truncated}`
                }

            const foot = document.createElement('hr');

            let count =  document.createElement('p')
          
            // likes.textContent='likes'
            count.classList.add('counting')
            
            // count.textContent = likeCounter()



            const likeIcon = document.createElement('i');
            likeIcon.classList.add('far', 'fa-heart'); // Using 'far' for regular Font Awesome icons
            likeIcon.style.cursor = 'pointer'; // Add pointer cursor to indicate it's clickable
            let isLiked = false // Initial state of like

            let likeid;
            // let status; 

            // let status; // Define status variable in an accessible scope
                var status
            const likeClick = () => {
                // Toggle the value of 'isLiked' boolean variable
                isLiked = !isLiked;
                console.log(`The value of isLiked is now: ${isLiked}`);

                // If the post is liked, make a POST request to the '/like' endpoint
                if (isLiked) {
                    const postId = item.id;
                    console.log(`The post ID being liked is: ${postId}`);

                    const likeUrl = `http://localhost:5105/api/Post/like?postid=${encodeURIComponent(postId)}&userid=${encodeURIComponent(userID)}`;
                    console.log(`The URL being used for the POST request is: ${likeUrl}`);

                    fetch(likeUrl, {
                        method: 'POST'
                    })
                        .then(response => response.json())
                        .then(data => {
                            likeid = data.likeid;
                            console.log(`The ID of the new like is: ${likeid}`);
                        })
                        .catch(error => console.error(error));

                    likeIcon.classList.replace('far', 'fas');
                    console.log('Liked post:', postId);
                    likeCounter();

                // If the post is unliked, make a DELETE request to the '/like' endpoint
                } else {
                    const postId = item.id;
                    console.log(`The post ID being unliked is: ${postId}`);

                    const unlikeUrl = `http://localhost:5105/api/Post/like?postid=${encodeURIComponent(postId)}&userid=${encodeURIComponent(userID)}`;
                    console.log(`The URL being used for the DELETE request is: ${unlikeUrl}`);

                    fetch(unlikeUrl, {
                        method: 'DELETE'
                    })
                        .catch(error => console.error(error));

                    likeIcon.classList.replace('fas', 'far');
                    console.log('Unliked post:', postId);
                    likeCounter();
                }
            };
            likeIcon.addEventListener('click', likeClick)
            
            let likes = document.createElement('p')
            
            likes.classList.add('like-text')
            // likes.textContent='like(s)'
            
            function likeCounter() {
                const postId = item.id;
                const likeCountUrl = `http://localhost:5105/api/Post/like?postid=${encodeURIComponent(postId)}&userid=${encodeURIComponent(userID)}`;

                fetch(likeCountUrl, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(response => response.json())
                    .then(data => {
                        count.textContent = `${data.count}`;

                        if (data.state) {
                            isLiked = true;
                            likeIcon.classList.remove('far');
                            likeIcon.classList.add('fas');
                        } else {
                            isLiked = false;
                            likeIcon.classList.remove('fas');
                            likeIcon.classList.add('far');
                        }

                        if (data.count === 0 || data.count === 1) {
                            likes.textContent = 'like';
                        } else {
                            likes.textContent = 'likes';
                        }
                    })
                    .catch(error => {
                        console.error(error);
                    });
            }

            likeCounter()

           function creaatePostElement(){
            const likeSpan = document.createElement('span')
            likeSpan.classList.add('likes')
            const shareIcon = document.createElement('i');
            shareIcon.classList.add('fas', 'fa-share'); // Adjust classes for the share icon
            shareIcon.style.cursor = 'pointer'; // Add pointer cursor to indicate it's clickable
            shareIcon.addEventListener('click', function() {
                // Handle share action here
                console.log('Shared post:', item.id);
            });

            postHolder.addEventListener('mouseenter', likeCounter)
            body.appendChild(showMoreButton)


            postHolder.appendChild(usernames);
            postHolder.appendChild(title);
            
            postHolder.appendChild(body);
            postHolder.appendChild(foot);
            postHolder.appendChild(likeSpan)
            likeSpan.appendChild(likeIcon)
            likeSpan.appendChild(count)
            likeSpan.appendChild(likes)        
            dataList.appendChild(postHolder);
           }

            creaatePostElement()
        });
    }
    



    // Call getAllAndDisplayPosts after the page is loaded
    fetchAndDisplayPosts();
});
