window.refreshTokenSwitch = async function (expjwt, refreshToken) {
    const apiBaseUrl = 'https://qblog108.azurewebsites.net';

    try {
        const response = await fetch(apiBaseUrl + '/api/refresh', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ expjwt: expjwt, refreshToken: refreshToken })
        });
        if (!response.ok) {
            throw new Error('Failed to refresh access token');
        }
        const data = await response.json();
        return data.token;
    } catch (error) {
        console.error('Error refreshing access token:', error.message);
        // Handle error appropriately, such as redirecting to login page
        throw error;
    }
};
