function saveUserInfo() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;

    if (name && email) {
        const userInfo = { name, email };
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        document.getElementById('userForm').style.display = 'none';
        document.getElementById('locationSection').style.display = 'block';
    } else {
        alert('Please fill in all fields.');
    }
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    userInfo.latitude = latitude;
    userInfo.longitude = longitude;
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    document.getElementById("userLocation").innerHTML = "Latitude: " + latitude + "<br>Longitude: " + longitude;
    saveUserLocation(userInfo);
}

function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.");
            break;
    }
}

function saveUserLocation(userInfo) {
    let users = JSON.parse(localStorage.getItem('users')) || [];
    users.push(userInfo);
    localStorage.setItem('users', JSON.stringify(users));
    displayNearbyUsers(userInfo);
}

function displayNearbyUsers(currentUser) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const nearbyUsers = users.filter(user => {
        const distance = calculateDistance(currentUser.latitude, currentUser.longitude, user.latitude, user.longitude);
        return distance < 50; // Show users within 50 km
    });
    const userList = document.getElementById('nearbyUsers');
    userList.innerHTML = '';
    nearbyUsers.forEach(user => {
        const li = document.createElement('li');
        li.textContent = `Name: ${user.name}, Email: ${user.email}, Distance: ${calculateDistance(currentUser.latitude, currentUser.longitude, user.latitude, user.longitude).toFixed(2)} km`;
        userList.appendChild(li);
    });
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

document.addEventListener('DOMContentLoaded', () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo) {
        document.getElementById('userForm').style.display = 'none';
        document.getElementById('locationSection').style.display = 'block';
    }
});
