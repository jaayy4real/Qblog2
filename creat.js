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
        const apiBaseUrl = "https://qblog108.azurewebsites.net";
        var title = document.getElementById("title").value;
        var body = quill.root.innerText;

        var postData = {
            title: title,
            body: body,
        };

        const token = localStorage.getItem("token");
        const refreshToken = localStorage.getItem("refresh");
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
                localStorage.setItem('token', await refreshTokenSwitch(token, refreshToken));
                return saveContent(); // Recursive call
            }

            if (!response.ok) throw new Error('Failed to fetch protected resource');
            if(response.ok) window.location.href='https://jaayy4real.github.io/Qblog2/profile-page.html';
        } catch (error) {
            console.error('Error making protected request', error);
        }
    }

    // Attach saveContent function to the click event of the save button
    document.getElementById("saveButton").addEventListener("click", saveContent);
});
