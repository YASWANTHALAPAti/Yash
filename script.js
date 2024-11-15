const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

document.getElementById('userForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const userLocation = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            };
            document.getElementById('userLocation').innerText = `Location: ${userLocation.latitude}, ${userLocation.longitude}`;
            // Save user data to Firebase
            saveUserData(username, userLocation);
        });
    } else {
        alert('Geolocation is not supported by this browser.');
    }
});

function saveUserData(username, location) {
    db.collection('users').add({
        username: username,
        location: location
    }).then(() => {
        displayNearbyUsers(location);
    }).catch(error => {
        console.error('Error adding document: ', error);
    });
}

function displayNearbyUsers(currentLocation) {
    db.collection('users').get().then(querySnapshot => {
        let nearbyUsers = '';
        querySnapshot.forEach(doc => {
            const user = doc.data();
            const distance = calculateDistance(currentLocation, user.location);
            if (distance < 50) { // Show users within 50 km
                nearbyUsers += `<p>${user.username} is ${distance.toFixed(2)} km away</p>`;
            }
        });
        document.getElementById('nearbyUsers').innerHTML = nearbyUsers;
    });
}

function calculateDistance(loc1, loc2) {
    const R = 6371; // Radius of the Earth in km
    const dLat = (loc2.latitude - loc1.latitude) * Math.PI / 180;
    const dLon = (loc2.longitude - loc1.longitude) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(loc1.latitude * Math.PI / 180) * Math.cos(loc2.latitude * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
}
