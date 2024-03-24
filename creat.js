document.addEventListener('DOMContentLoaded', function () {
    var toolbarOptions = [
        ["bold", "italic", "underline", "strike"], // toggled buttons
        ["blockquote", "code-block"],
        [{ header: 1 }, { header: 2 }], // custom button values
        [{ list: "ordered" }, { list: "bullet" }],
        [{ script: "sub" }, { script: "super" }], // superscript/subscript
        [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
        [{ direction: "rtl" }], // text direction
        [{ size: ["small", false, "large", "huge"] }], // custom dropdown
        [{ color: [] }, { background: [] }], // dropdown with defaults from theme
        [{ font: [] }],
        [{ align: [] }],
        ["clean"], // remove formatting button
    ];

    var quill = new Quill("#editor", {
        modules: {
            toolbar: toolbarOptions,
        },
        theme: "snow",
    });

    // Function to save the content
    async function saveContent() {
        const apiBaseUrl = "http://localhost:5105";
        var title = document.getElementById("title").value;
        var body = quill.root.innerText;

        var postData = {
            title: title,
            body: body,
        };

    async function makeRequest() {
        const token = localStorage.getItem("token");
        const refreshToken = localStorage.getItem("refresh");
        const expjwt = token;
        console.log(expjwt, refreshToken);

        try {
            const response = await fetch(apiBaseUrl + '/api/Post', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(postData)
            });

            if (response.status === 401) {
                const newAccessToken = await refreshTokenSwitch(expjwt, refreshToken);
                localStorage.setItem('token', newAccessToken);
                // Retry the original request with the new access token
                return makeRequest(); // Corrected: This makes a recursive call
            }

            if (!response.ok) {
                throw new Error('Failed to fetch protected resource');
            };

            if(response.ok){
                window.location.href='http://127.0.0.1:5500/profile-page.html'
            }

            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const data = await response.json();
                return data;
            } else {
                const text = await response.text(); // Get non-JSON response as text
                console.log('Non-JSON response:', text);
                return null; // or handle non-JSON response as needed
            }
        } catch (error) {
            console.error('Error making protected request', error);
            throw error;
        }
    }


        try {
            const data = await makeRequest();
            console.log('Protected Resource data');
        } catch (error) {
            console.error('Error making protected request', error);
        }
        
    }

    // Attach saveContent function to the click event of the save button
    document.getElementById("saveButton").addEventListener("click", saveContent);
});
