document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM content loaded');
    const apiBaseUrl = 'http://localhost:5105';
    const token = localStorage.getItem('token');
    console.log(token);
    const userID = localStorage.getItem('userID');
    const userna = localStorage.getItem('usename')

    // Function to get all posts and display them
    function getAllAndDisplayPosts() {
        const apiEndpoint = '/api/Post';

        fetch(apiBaseUrl + apiEndpoint)
            .then(response => response.json())
            .then(data => displayData(data))
            .catch(error => console.error('Error fetching data:', error));
    }

    // Function to display posts
    function displayData(data) {
        const dataList = document.getElementById('api-data-list');
        dataList.innerHTML = '';

        data.forEach(item => {
            
            // let postID = ''
            // localStorage.setItem('getUser', item.userid)
            // console.log(item.id);
            

            const postHolder = document.createElement('section');
            postHolder.classList.add('post-holder'); // Adding class for styling


            const title = document.createElement('h3');
            title.classList.add('post-title');
            title.textContent = item.title;

           

            const usernames = document.createElement('p');
            usernames.classList.add('post-username');
            usernames.textContent = `- posted by ${item.username}`;
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
            // count.textContent = likeCounter()



            const likeIcon = document.createElement('i');
            likeIcon.classList.add('far', 'fa-heart'); // Using 'far' for regular Font Awesome icons
            likeIcon.style.cursor = 'pointer'; // Add pointer cursor to indicate it's clickable
            let isLiked = false // Initial state of like

            let likeid;
            // let status; 

            // let status; // Define status variable in an accessible scope
                var status
            const likeClick = () =>{
                // Toggle like state
                const postID = item.id;
                const username = item.username;
                isLiked = !isLiked;

                try {
                    if (isLiked === true) {
                        const likeurl = `http://localhost:5105/api/Post/like?postid=${encodeURIComponent(postID)}&user=${encodeURIComponent(userID)}`;

                        fetch(likeurl, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                        })
                        .then(response => response.json() )
                        .then(data => {
                            likeid = data.likeid;
                             status = data.state;
                             console.log(likeid);
                              // Log status here
                             // Pass status to handleState function
                        })
                        .catch(error => console.error(error));

                        likeIcon.classList.remove('far'); // Remove regular class
                        likeIcon.classList.add('fas'); // Add solid class
                        console.log('Liked post:', item.id);
                        // likeCounter();

                    } else if (isLiked === false) {
                        const unlikeurl = `http://localhost:5105/api/Post/like?likeid=${encodeURIComponent(likeid)}`;

                        fetch(unlikeurl,{
                            method:'DELETE',
                            headers:{
                                'Content-Type': 'application/json'
                            },
                        })
                        .then(response => response.json())
                        .then(data => {
                            console.log(data);
                            // logger.debug(data)
                            // status = data.state;
                             // Pass status to handleState function
                        })
                        .catch(error => console.error(error));

                        likeIcon.classList.remove('fas'); // Remove solid class
                        likeIcon.classList.add('far'); // Add regular class
                        console.log('Unliked post:', item.id);
                        // likeCounter();
                    }

                } catch (error) {
                    console.error(error);
                }
     
            };
            likeIcon.addEventListener('click', likeClick)

            // Access status outside the event listener function
            // console.log(likeClick());
            // status = likeClick;
            console.log(status);

            // function handleState(status) {
            //     // Use the status variable here
            //     console.log('Status:', status);
            //     // Perform actions based on the status
            // }
            // handleState()


            // Access status outside the event listener function
            

            
         
            


            
            function likeCounter(){
                let counter 
                const postId = item.id
                const likeCount = `http://localhost:5105/api/Post/like?postid=${encodeURIComponent(postId)}&userid=${encodeURIComponent(userID)}`
                fetch(likeCount, {
                    method:'GET',
                    headers:{
                        'Content-Type': 'application/json'
                    }
                })

                .then(response => response.json())
                .then(data => {count.textContent=data.count
                    
                    console.log(data);
                    if (data.state === true){
                        isLiked = true;
                        likeIcon.classList.remove('far')
                        likeIcon.classList.add('fas')
                    }
                    else if (data.state === false){
                        isLiked = false;
                        likeIcon.classList.remove('fas')
                        likeIcon.classList.add('far')
                    }
                })
                .catch(error => console.error(error))
                
                
                return counter
                
            }

            likeCounter()



            const shareIcon = document.createElement('i');
            shareIcon.classList.add('fas', 'fa-share'); // Adjust classes for the share icon
            shareIcon.style.cursor = 'pointer'; // Add pointer cursor to indicate it's clickable
            shareIcon.addEventListener('click', function() {
                // Handle share action here
                console.log('Shared post:', item.id);
            });

            postHolder.addEventListener('mouseenter', likeCounter)
            body.appendChild(showMoreButton)

            postHolder.appendChild(title);
            postHolder.appendChild(usernames);
            postHolder.appendChild(body);
            // postHolder.appendChild(showMoreButton)
            postHolder.appendChild(foot);
            postHolder.appendChild(likeIcon);
            postHolder.appendChild(shareIcon);
            postHolder.appendChild(count)
            
            
            // postHolder.appendChild(showMoreButton)
            
            

            dataList.appendChild(postHolder);
        });
    }



    // Call getAllAndDisplayPosts after the page is loaded
    getAllAndDisplayPosts();
});
