// script.js

// Function to get current hash value
function getHash() {
    return window.location.hash.substring(1);
}

// Function to load saved locations from localStorage and display them on the home screen
function loadLocations() {
    const locations = JSON.parse(localStorage.getItem('locations')) || [];
    const locationList = document.getElementById('location-list');
    locationList.innerHTML = '';

    locations.forEach(location => {
        const locationItem = document.createElement('li');
        locationItem.className = 'location-item';
        
        locationItem.innerHTML = `
            <img src="${location.photo}" alt="Location Thumbnail">
            <div class="location-details" onclick="viewLocation('${location.name}')">
                <div class="location-name">${location.name}</div>
                <div class="location-description">${location.description}</div>
                <div class="star-rating">${'★'.repeat(location.rating)}${'☆'.repeat(5 - location.rating)}</div>
            </div>
        `;

        locationList.appendChild(locationItem);
    });
}

// Function to save a new location
function saveLocation() {
    const locationName = document.getElementById('location-name').value;
    const shortDescription = document.getElementById('short-description').value;
    const detailedReview = document.getElementById('detailed-review').value;
    const photoSrc = document.getElementById('photo-preview').src;
    const rating = document.querySelector('input[name="rating"]:checked').value;

    if (locationName && shortDescription && detailedReview && photoSrc && rating) {
        const newLocation = {
            name: locationName,
            description: shortDescription,
            review: detailedReview,
            photo: photoSrc,
            rating: rating
        };

        let locations = JSON.parse(localStorage.getItem('locations')) || [];
        locations.push(newLocation);
        localStorage.setItem('locations', JSON.stringify(locations));
        alert('Location saved successfully!');
        window.location.href = 'index.html';
    } else {
        alert('Please fill in all fields and take a photo.');
    }
}

// Function to view detailed information about a location
function viewLocation(name) {
    const locations = JSON.parse(localStorage.getItem('locations')) || [];
    const location = locations.find(loc => loc.name === name);
    localStorage.setItem('currentLocation', JSON.stringify(location));
    window.location.href = 'detailed-view.html';
}

// Function to load detailed view of a location
function loadDetailedView() {
    const location = JSON.parse(localStorage.getItem('currentLocation'));

    if (location) {
        document.getElementById('location-name').innerText = location.name;
        document.getElementById('full-size-image').src = location.photo;
        document.getElementById('detailed-review').innerText = location.review;
        document.getElementById('rating-display').innerText = '★'.repeat(location.rating) + '☆'.repeat(5 - location.rating);
    }
}

// Function to navigate to the edit location page
function editLocation() {
    window.location.href = 'edit-location.html';
}

// Function to load the location details into the edit form
function loadEditLocation() {
    const location = JSON.parse(localStorage.getItem('currentLocation'));

    if (location) {
        document.getElementById('edit-location-name').value = location.name;
        document.getElementById('edit-short-description').value = location.description;
        document.getElementById('edit-detailed-review').value = location.review;
        document.getElementById('edit-photo-preview').src = location.photo;
        document.getElementById(`edit-star${location.rating}`).checked = true;
    }
}

// Function to save the edited location details
function saveEditedLocation() {
    const locationName = document.getElementById('edit-location-name').value;
    const shortDescription = document.getElementById('edit-short-description').value;
    const detailedReview = document.getElementById('edit-detailed-review').value;
    const photoSrc = document.getElementById('edit-photo-preview').src;
    const rating = document.querySelector('input[name="edit-rating"]:checked').value;

    if (locationName && shortDescription && detailedReview && photoSrc && rating) {
        const updatedLocation = {
            name: locationName,
            description: shortDescription,
            review: detailedReview,
            photo: photoSrc,
            rating: rating
        };

        let locations = JSON.parse(localStorage.getItem('locations')) || [];
        locations = locations.map(location => {
            if (location.name === JSON.parse(localStorage.getItem('currentLocation')).name) {
                return updatedLocation;
            }
            return location;
        });

        localStorage.setItem('locations', JSON.stringify(locations));
        alert('Location updated successfully!');
        window.location.href = 'index.html';
    } else {
        alert('Please fill in all fields and take a photo.');
    }
}

// Function to go back to the previous page
function goBack() {
    window.history.back();
}

// Function to take a photo using the camera
function takePhoto() {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const photoPreview = document.getElementById('photo-preview');
    const takePhotoButton = document.getElementById('take-photo-button');
    const confirmPhotoButton = document.getElementById('confirm-photo-button');

    navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
        video.srcObject = stream;
        video.play();

        takePhotoButton.style.display = 'none';
        confirmPhotoButton.style.display = 'block';
        confirmPhotoButton.appendChild(video);

        confirmPhotoButton.addEventListener('click', () => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            photoPreview.src = canvas.toDataURL('image/png');
            photoPreview.style.display = 'block';
            video.pause();
            video.srcObject.getTracks()[0].stop();
            confirmPhotoButton.style.display = 'none';
            takePhotoButton.style.display = 'block';
        });
    }).catch(err => {
        console.error('Error accessing camera: ', err);
    });
}

// Handle Take a Photo button click
document.getElementById('take-photo').addEventListener('click', function() {
    if (isMobileDevice()) {
        const takePhotoInput = document.createElement('input');
        takePhotoInput.type = 'file';
        takePhotoInput.accept = 'image/*';
        takePhotoInput.capture = 'camera';
        takePhotoInput.click();
    } else {
        alert('Not Supported');
    }
});

function isMobileDevice() {
    return /Mobi/i.test(window.navigator.userAgent) || /Android/i.test(window.navigator.userAgent);}



// Placeholder for camera functionality
function takePhoto() {
    // Implement camera functionality here
    alert('Placeholder for camera functionality');
}

// Add event listener to form submission
document.getElementById('addLocationForm').addEventListener('submit', function(event) {
    event.preventDefault();
    alert('Place added successfully!');
});

// Toggle dropdown menu on menu icon click
document.querySelector('.menu-icon span').addEventListener('click', function() {
    document.querySelector('.menu-icon .dropdown-menu').classList.toggle('show');
});

// Add star rating functionality
const stars = document.querySelectorAll('.star-rating span');
stars.forEach((star, index) => {
    star.addEventListener('click', () => {
        stars.forEach((s, i) => {
            s.innerHTML = i <= index ? '&#9733;' : '&#9734;';
        });
    });
});

