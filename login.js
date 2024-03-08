document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('signin-button').onclick = function () {
        const nameInput = document.getElementById('username-input').value;
        const passwordInput = document.getElementById('password-input').value;
       const url = `http://localhost:5105/api/login?name=${encodeURIComponent(nameInput)}&password=${encodeURIComponent(passwordInput)}`;


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
            alert(data.token , data.refreshtoken)
            // localStorage.setItem('id', data.id)
            // console.log('Login successful:', data);
            window.location.href = 'http://127.0.0.1:5500/auth-feed.html'
            // return data
            // Handle successful login
            // You can add further logic here to handle the successful login
        })
    
        .catch(error => {
            console.error('Error during login:', error);
            // Handle login error
            // You can add further logic here to handle the login error
        });
        // console.log(data);
    };



});
