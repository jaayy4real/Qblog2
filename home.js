function getAllAndDisplayPosts() {
        const apiEndpoint = '/api/Post'; // API endpoint for all posts
        const cacheName = 'all-posts'; // Cache name for all posts
        const request = new Request(apiBaseUrl + apiEndpoint);

        caches.match(request) // Check if the data is cached
            .then(response => response || fetch(request)) // If not cached, fetch from API
            .then(response => response.json()) // Parse response as JSON
            .then(data => {
                caches.open(cacheName) // Create or open the cache
                    .then(cache => cache.put(request, response)); // Update the cache
                displayData(data); // Display fetched data
            })
            .catch(error => console.error('Error fetching data:', error)); // Handle errors
    }

    const apiEndpoint = '/api/Post/byfollowers/' + userID;
