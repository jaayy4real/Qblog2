document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('signin-button').onclick = function () {
        const nameInput = document.getElementById('username-input').value;
        const passwordInput = document.getElementById('password-input').value;
       const url = `https://qblog108.azurewebsites.net/api/login?name=${encodeURIComponent(nameInput)}&password=${encodeURIComponent(passwordInput)}`;


        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => {
            if (!response.ok) {
                
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            
            localStorage.setItem('token', data.token);
            localStorage.setItem('refresh', data.refreshtoken)
            localStorage.setItem('userID', data.id)
           
            window.location.href = 'https://jaayy4real.github.io/Qblog2//auth-feed.html'
            console.log(data);
         
        })
    
        .catch(error => {
            console.error('Error during login:', error);
            // Handle login error
            // You can add further logic here to handle the login error
        });
        // console.log(data);
    };



});
