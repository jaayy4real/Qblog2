document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM content loaded');
    const apiBaseUrl = 'http://localhost:5105';
    const token = localStorage.getItem('token');
    console.log(token);
    const userID = localStorage.getItem('userID');
    const id = localStorage.getItem('id');
    const refreshToken = localStorage.getItem('refresh')
    console.log(refreshToken);
    console.log(id);

    

    async function getIdentity() {
        const refreshToken = localStorage.getItem('refresh')
        const expjwt = token

        try {
            const response = await fetch(apiBaseUrl+ '/api/identity',{
                method: 'GET',
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            })
            if (response.status === 401){
                const newAccessToken = await refreshTokenSwitch(expjwt, refreshToken)
                localStorage.setItem('token', newAccessToken)

                return getIdentity()
            }

            if (!response.ok){
                throw new Error('Failed to fetch protected resource')
            }
            const data  = await response.json()
            return data
        } catch (error) {
            console.error('Error making protected request')
            throw error
        }
    }
        
        let username;
       getIdentity()
       .then(data => {
        username = data.name
        console.log('Protected Resource Data', data);
       })
       .catch(error => {
        console.error('Error making protected request', error);
       })
       

    // Function to get all posts and display them
    function getAllAndDisplayPosts() {
        const apiEndpoint = '/api/Post/user';

        fetch(apiBaseUrl + apiEndpoint, {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userID)
        })
            .then(response => response.json())
            .then(data => displayData(data))
            .catch(error => console.error('Error fetching data:', error));
    }

    // Function to display posts
    function displayData(data) {
        const userText = document.getElementById('user-text');
        userText.textContent = `${username}`

        const identity = document.getElementById('identity');
        // identity.textContent = `${id}`

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
            usernames.textContent = `- posted by ${item.username}`;
            console.log(item);

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
                if(body.textContent.length < 200){
                    showMoreButton.style.display='none'
                    body.textContent = `${truncated}`
                }
                
            // }
            // body.textContent =item.body

            const foot = document.createElement('hr');

            let count =  document.createElement('p')
            count.textContent = '0'

            const likeIcon = document.createElement('i');
            likeIcon.classList.add('far', 'fa-heart'); // Using 'far' for regular Font Awesome icons
            likeIcon.style.cursor = 'pointer'; // Add pointer cursor to indicate it's clickable
            let isLiked = false; // Initial state of like


            likeIcon.addEventListener('click', function() {
                // Toggle like state
                const postID = item.id
                const username = item.username
                isLiked = !isLiked;
                if (isLiked) {
                    const likeurl = `http://localhost:5105/api/Post/like?postid=${encodeURIComponent(postID)}&user=${encodeURIComponent(username)}`
                    
                    fetch(likeurl, {
                        method: 'POST',
                        headers:{
                            'Content-Type': 'application/json'
                        },
                        
                    })
                    .then(response => response.json())
                    .then(data => {console.log(data);})
                    .catch(error => console.error(error))
                    likeIcon.classList.remove('far'); // Remove regular class
                    likeIcon.classList.add('fas'); // Add solid class
                    console.log('Liked post:', item.id);

                } else {
                    fetch(apiBaseUrl + '/api/Post/unlike', {
                        method: 'POST',
                        headers:{
                            'Content-Type': 'application/json'
                        },
                        body:JSON.stringify(details)
                    })
                    .catch(error => console.error(error))
                    likeIcon.classList.remove('fas'); // Remove solid class
                    likeIcon.classList.add('far'); // Add regular class
                    console.log('Unliked post:', item.id);
                }
            });

            const shareIcon = document.createElement('i');
            shareIcon.classList.add('fas', 'fa-share'); // Adjust classes for the share icon
            shareIcon.style.cursor = 'pointer'; // Add pointer cursor to indicate it's clickable
            shareIcon.addEventListener('click', function() {
                // Handle share action here
                console.log('Shared post:', item.id);
            });

            body.appendChild(showMoreButton)

            postHolder.appendChild(title);
            postHolder.appendChild(usernames);
            postHolder.appendChild(body);
            postHolder.appendChild(foot);
            postHolder.appendChild(likeIcon);
            postHolder.appendChild(shareIcon);
            postHolder.appendChild(count)

            dataList.appendChild(postHolder);
        });
    }

    // Call getAllAndDisplayPosts after the page is loaded
    getAllAndDisplayPosts();

    let isFollow = false;
    const followButton = document.getElementById('follow')
    followButton.addEventListener('click', function () {
        // const url = `http://localhost:5105/api/follow?id=${encodeURIComponent()}&followerid=${encodeURIComponent()}`
        isFollow = !isFollow
        if (isFollow) {
            // const endPoint = '/api/follow'

            // fetch(apiBaseUrl+ endPoint,{
            //     method: 'GET',
            //     headers:{
            //         'Content-Type': 'application/json',
            //         'Authorization': `Bearer ${token}`
            //     }
            // })
            // .then(response =>{
            //     if(!response.ok){
            //         throw new Error(`HTTP error! Status: ${response.status}`);
            //     }
            //     return response.json();
            // })
            // .then(data => {
            //     console.log('Successful liking', data);
            // })
            // .catch(error => {
            //     console.error('Error Liking', error);
            // })

            followButton.innerText = 'Following'
            followButton.style.backgroundColor = 'white'
            followButton.style.color = 'black'
            console.log('follow');
        }
        else{

            followButton.innerText = 'Follow'
            followButton.style.backgroundColor = 'black'
            followButton.style.color = 'white'
            followButton.style.cursor = 'pointer'
            console.log('unfollow');
        }
        // console.log('clicked by me');
    })

});
