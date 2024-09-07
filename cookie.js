// cookie.js

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

// Function to check if the cookie consent has been given
function hasConsented() {
    return getCookie('cookieConsent') === 'true';
}

// Function to show the cookie consent pop-up
function showCookieConsent() {
    const consentBanner = document.createElement('div');
    consentBanner.id = 'cookieConsentBanner';
    consentBanner.style.position = 'fixed';
    consentBanner.style.bottom = '0';
    consentBanner.style.left = '0';
    consentBanner.style.right = '0';
    consentBanner.style.backgroundColor = '#333';
    consentBanner.style.color = '#fff';
    consentBanner.style.textAlign = 'center';
    consentBanner.style.padding = '10px';
    consentBanner.style.zIndex = '1000';
    
    consentBanner.innerHTML = `
        <p>This website uses cookies to ensure you get the best experience on our website. <a href="/privacy-policy" style="color: #ff9b00;">Learn more</a></p>
        <button id="cookieConsentButton" style="background-color: #ff9b00; color: #fff; border: none; padding: 10px; cursor: pointer;">Got it!</button>
    `;
    
    document.body.appendChild(consentBanner);

    document.getElementById('cookieConsentButton').addEventListener('click', () => {
        setCookie('cookieConsent', 'true', 365); // Set cookie consent for 365 days
        document.body.removeChild(consentBanner);
    });
}

// Initialize cookie consent
function initializeCookieConsent() {
    if (!hasConsented()) {
        showCookieConsent();
    }
}

// Call this function on page load
initializeCookieConsent();
