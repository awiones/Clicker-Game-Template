/**
 * **************************************************************************
 * Author: Awiones
 * Project: Clicker Game Template
 * Description: JavaScript code for clicker game with leaderboard and sound effects
 * Watermark: This code is a proprietary creation by Awiones.
 * Give me credit by not remove this.
 * **************************************************************************
 */


let clickCount = 0;
let userLocation = null;
const clickButton = document.getElementById('clickButton');
const clickEffect = document.getElementById('clickEffect');
const leaderboardList = document.getElementById('leaderboardList');
const playerClickCountElem = document.getElementById('playerClickCount');
const clickSound = document.getElementById('clickSound'); // Ensure you have an audio element with this ID
const leaderboardEntries = {}; 

const CLICK_LIMIT = 10; // Maximum allowed clicks in the interval
const BAN_TIME = 60000; // 1 minute ban time
const CLICK_INTERVAL = 1000; // Time interval for click limit check in milliseconds
let clickTimestamps = [];
let banned = false;

// Function to show the click effect and play sound
function showClickEffect(e) {
    // Update click count
    clickCount++;
    
    // Update UI
    playerClickCountElem.textContent = clickCount;
    
    // Save click count in cookie
    saveClickCount();

    // Update leaderboard with user location
    updateLeaderboard(userLocation);

    // Click effect animation
    const rect = clickButton.getBoundingClientRect();
    const x = e.clientX - rect.left - window.pageXOffset;
    const y = e.clientY - rect.top - window.pageYOffset;

    clickEffect.style.left = `${x}px`;
    clickEffect.style.top = `${y}px`;
    clickEffect.style.opacity = 1;
    clickEffect.style.transform = 'translate(-50%, -50%) scale(1.5)';
    clickEffect.textContent = `+${clickCount}`;

    setTimeout(() => {
        clickEffect.style.opacity = 0;
        clickEffect.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 500);

    // Play the click sound
    if (clickSound) {
        clickSound.currentTime = 0; // Rewind to start
        clickSound.play().catch(error => {
            console.error("Failed to play the sound:", error);
        });
    }
}

// Function to set a cookie
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = `${name}=${value};${expires};path=/`;
}

// Function to get a cookie
function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// Function to save the click count in a cookie
function saveClickCount() {
    setCookie('clickCount', clickCount, 7);  // Save for 7 days
}

// Function to load the click count from a cookie
function loadClickCount() {
    const savedCount = getCookie('clickCount');
    if (savedCount) {
        clickCount = parseInt(savedCount);
        playerClickCountElem.textContent = clickCount; // Update the UI
        // Ensure the leaderboard reflects the saved count
        updateLeaderboard(userLocation);
    }
}

// Function to update the leaderboard
function updateLeaderboard(location) {
    if (!location || clickCount === undefined) return; // Prevent updates if location or clickCount is invalid

    // Check if the location already exists
    const existingEntry = leaderboardList.querySelector(`[data-location="${location}"]`);

    if (existingEntry) {
        // Update existing entry
        const clickCountElem = existingEntry.querySelector('.click-count');
        clickCountElem.textContent = `${clickCount} clicks`;

        // Add squeeze animation
        clickCountElem.classList.remove('squeezed');
        void clickCountElem.offsetWidth; // Trigger reflow to restart animation
        clickCountElem.classList.add('squeezed');
    } else {
        // Create a new list item
        const listItem = document.createElement('li');
        listItem.classList.add('swipe-up');
        listItem.innerHTML = `
            <span class="country-name">${getFlagEmoji(location)} ${location}</span>
            <span class="click-count squeezed">${clickCount} clicks</span>
        `;
        listItem.dataset.location = location;

        // Add new entry to the list
        leaderboardList.prepend(listItem); // Add new items to the top
        setTimeout(() => {
            listItem.classList.add('show');
        }, 10); // Small delay to trigger the animation
    }
}

// Function to get flag emoji based on country
function getFlagEmoji(country) {
    const countryCodes = {
        'United States': '🇺🇸',
        'Canada': '🇨🇦',
        'United Kingdom': '🇬🇧',
        'Germany': '🇩🇪',
        'France': '🇫🇷',
        'Japan': '🇯🇵',
        'Australia': '🇦🇺',
        'India': '🇮🇳',
        'Brazil': '🇧🇷',
        'China': '🇨🇳',
        // Add more countries as needed
    };
    return countryCodes[country] || '🌍'; // Default flag if country not found
}

// Function to fetch user's location
function fetchUserLocation() {
    fetch('https://ipapi.co/json/')
        .then(response => response.json())
        .then(data => {
            userLocation = data.country_name || 'Unknown';
            updateLeaderboard(userLocation);
        })
        .catch(() => {
            userLocation = 'Unknown';
            updateLeaderboard(userLocation);
        });
}

// Load click count on page load
window.onload = () => {
    loadClickCount();
    fetchUserLocation();
};

clickButton.addEventListener('click', (e) => {
    showClickEffect(e);
});
