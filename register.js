document.addEventListener('DOMContentLoaded', function () {
    const loader = document.getElementById('loader');

    document.getElementById('register-button').onclick = function () {
        loader.style.display = 'block'; // Show loader when sign-up button is clicked

        const usernameInput = document.getElementById('username-input').value;
        const emailInput = document.getElementById('email-input').value;
        const passwordInput = document.getElementById('password-input').value;
        const url = `http://localhost:5105/api/register?username=${encodeURIComponent(usernameInput)}&email=${encodeURIComponent(emailInput)}&password=${encodeURIComponent(passwordInput)}`;

        const userData = {
            username: usernameInput,
            email: emailInput,
            password: passwordInput
        };

        fetch(url , {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData), // Include the body in the request
        })
        .then(response => {
            if (response.status === 500){
                // response.json().catch(error => {'i logged' ,error})
                // window.location.href = 'http://127.0.0.1:5500/error.html'
                // console.log(response.json().then(data => console.log(data)));
                // console.log(response.json().then(data => console.log(typeof data)));
                throw new Error(`HTTP error! Status: ${response.json().then(data => console.log(data))}`);
                // console.error(response);
            }
             response.text()
        })
        .then(data => {
         
                window.location.href = 'http://127.0.0.1:5500/successful.html';
               
           
                console.log('Registration successful:', data);

            
            
            
        })
        .catch(error => {
            console.error('Error during registration:', error);
            // window.location.href = 'http://127.0.0.1:5500/error.html'
            if (error.status === 400) {
                return error.json().then(errorData => {
                    console.log('Validation errors:', errorData.errors);
                    // You can display error messages to the user
                });
            }
        })
        .finally(() => {
            loader.style.display = 'none'; // Hide loader when operation is finished (whether successful or not)
        });
    };
});
