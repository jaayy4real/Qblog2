document.addEventListener("DOMContentLoaded", function(){
    const forYou = document.getElementById('for-you')
    const following = document.getElementById('following')
    const forr = document.getElementById('for')
    const fol = document.getElementById('fol')
    const token = localStorage.getItem('token');
    const apiBaseUrl = 'http://localhost:5105';
    const userID = localStorage.getItem('userID');

     forYou.style.borderBottom = "2px solid"
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
                        likeCounter();

                    } else if (isLiked === false) {
                        const unlikeurl = `http://localhost:5105/api/Post/like?postid=${encodeURIComponent(postID)}&user=${encodeURIComponent(userID)}`;
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
                        likeCounter();
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
            

            
         
            
            let likes = document.createElement('p')
            
            likes.classList.add('like-text')
            // likes.textContent='like(s)'
            
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
                .then(data => {count.textContent=`${data.count}`
                    
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

                    if(data.count === '0' || data.count === '1'){
                        likes.textContent='like'
                    }
                    else{
                        likes.textContent='likes'
                    }
                })
                .catch(error => console.error(error))
                
                
                return counter
                
            }

            likeCounter()

           

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
            // postHolder.appendChild(showMoreButton)
            postHolder.appendChild(foot);
            postHolder.appendChild(likeSpan)
            likeSpan.appendChild(likeIcon)
            likeSpan.appendChild(count)
            likeSpan.appendChild(likes)

            

            // postHolder.appendChild(likeSpan)
            // postHolder.appendChild(likeSpan)
            // likeSpan.appendChild(likeIcon);
            // likeSpan.appendChild(count)
            // postHolder.appendChild(shareIcon);
            
            // likeIcon.appendChild(count)
            
            // postHolder.appendChild(showMoreButton)
            
            

            dataList.appendChild(postHolder);
        });
    }



    // Call getAllAndDisplayPosts after the page is loaded
    getAllAndDisplayPosts();
    
    following.addEventListener("click", function(){
        
        forYou.style.borderBottom = '0'
        following.style.borderBottom = '2px solid'
    })

    forr.addEventListener("click", function(){
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
            .then(data => {displayData(data)
            })
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
            let isLiked = false; // Initial state of like

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
                    if (isLiked) {
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
                             Promise.resolve(status)
                             
                            console.log(data.state);
                            console.log(status); // Log status here
                            handleState(status); // Pass status to handleState function
                        })
                        .catch(error => console.error(error));

                        likeIcon.classList.remove('far'); // Remove regular class
                        likeIcon.classList.add('fas'); // Add solid class
                        console.log('Liked post:', item.id);
                        likeCounter();

                    } else {
                        const unlikeurl = `http://localhost:5105/api/Post/like?postid=${encodeURIComponent(postID)}&user=${encodeURIComponent(userID)}`;


                        fetch(unlikeurl,{
                            method:'DELETE',
                            headers:{
                                'Content-Type': 'application/json'
                            },
                        })
                        .then(response => response.json())
                        .then(data => {
                            // status = data.state;
                            console.log(status); // Log status here
                            handleState(status); // Pass status to handleState function
                        })
                        .catch(error => console.error(error));

                        likeIcon.classList.remove('fas'); // Remove solid class
                        likeIcon.classList.add('far'); // Add regular class
                        console.log('Unliked post:', item.id);
                        likeCounter();
                    }

                } catch (error) {
                    console.error(error);
                }
                return handleState(status); // Pass status to handleState function
            };
            likeIcon.addEventListener('click', likeClick)

            // Access status outside the event listener function
            // console.log(likeClick());
            // status = likeClick;
            console.log(status);

            function handleState(status) {
                // Use the status variable here
                console.log('Status:', status);
                // Perform actions based on the status
            }
            handleState()


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
        forYou.style.borderBottom = "2px solid"
        following.style.borderBottom = "0"
    })
// following
    fol.addEventListener("click", function(){
    //  datalist.textContent = true const apiBaseUrl = 'http://localhost:5105';
    const token = localStorage.getItem('token');
    console.log(token);
    const userID = localStorage.getItem('userID');
    const userna = localStorage.getItem('usename')

    // Function to get all posts and display them
    function getAllAndDisplayPosts() {
        const apiEndpoint = '/api/Post/byfollowers/' + userID;

        fetch(apiBaseUrl + apiEndpoint)
            .then(response => response.json())
            .then(data => {displayData(data)
                console.log(data);
            })
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
            likeIcon.classList.add('fas', 'fa-heart'); // Using 'far' for regular Font Awesome icons
            likeIcon.style.cursor = 'pointer'; // Add pointer cursor to indicate it's clickable
            let isLiked = false; // Initial state of like

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
                    if (isLiked) {
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
                             Promise.resolve(status)
                             
                            console.log(data.state);
                            console.log(status); // Log status here
                            handleState(status); // Pass status to handleState function
                        })
                        .catch(error => console.error(error));

                        likeIcon.classList.remove('far'); // Remove regular class
                        likeIcon.classList.add('fas'); // Add solid class
                        console.log('Liked post:', item.id);
                        likeCounter();

                    } else {
                        const unlikeurl = `http://localhost:5105/api/Post/like?postid=${encodeURIComponent(postID)}&user=${encodeURIComponent(userID)}`;

                        fetch(unlikeurl,{
                            method:'DELETE',
                            headers:{
                                'Content-Type': 'application/json'
                            },
                        })
                        .then(response => response.json())
                        .then(data => {
                            // status = data.state;
                            console.log(status); // Log status here
                            handleState(status); // Pass status to handleState function
                        })
                        .catch(error => console.error(error));

                        likeIcon.classList.remove('fas'); // Remove solid class
                        likeIcon.classList.add('far'); // Add regular class
                        console.log('Unliked post:', item.id);
                        likeCounter();
                    }

                } catch (error) {
                    console.error(error);
                }
                return handleState(status); // Pass status to handleState function
            };
            likeIcon.addEventListener('click', likeClick)

            // Access status outside the event listener function
            // console.log(likeClick());
            // status = likeClick;
            console.log(status);

            function handleState(status) {
                // Use the status variable here
                console.log('Status:', status);
                // Perform actions based on the status
            }
            handleState()


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
    forYou.style.borderBottom = '0'
    following.style.borderBottom = '2px solid'
    })

   
    // if (state ===false){
    //     datalist.textContent='5'
    // }else{
    //     datalist.textContent='6'
    // }
    
    

    const pageUser = document.getElementById('page-user')
    const initial = document.getElementById('init')

    const backgroundColors = ['#124076','#114232','#6420AA', '#35374B', '#344955', '#333A73', '#070F2B', '#561C24']
    const random = Math.round(Math.random() *7)+1

    // initial.style.backgroundColor = backgroundColors[random]

    async function getIdentity() {
        const apiBaseUrl = 'http://localhost:5105';
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
        // pageUser.textContent= data.name
        // initial.textContent = data.name[0]
        console.log(data.name);
        username = data.name
        console.log('Protected Resource Data', data);
       })
       .catch(error => {
        console.error('Error making protected request', error);
       })
       console.log(username);
})

