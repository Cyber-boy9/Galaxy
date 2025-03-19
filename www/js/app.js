// Listen for both DOMContentLoaded (browser) and deviceready (Cordova)
document.addEventListener('DOMContentLoaded', onDeviceReady, false);
document.addEventListener('deviceready', onDeviceReady, false);

let appInitialized = false; // Prevent double initialization

function onDeviceReady() {
    // Prevent double initialization
    if (appInitialized) return;
    appInitialized = true;
    
    //console.log('App initialized!'); // Debug log

    // Hide splash screen after 2 seconds
    setTimeout(() => {
        const splashScreen = document.getElementById('splash-screen');
        const loginScreen = document.getElementById('login-screen');
        
        if (splashScreen && loginScreen) {
           // console.log('Transitioning from splash to login...'); // Debug log
            splashScreen.style.display = 'none'; // Use style.display instead of class
            loginScreen.style.display = 'flex';  // Use style.display instead of clas
            loginScreen.classList.add('fade-in');
        } else {
            console.error('Required elements not found!'); // Debug log
        }
    }, 2000);

    // Initialize forms
    initializeAuthForms();
}

function initializeAuthForms() {
    // Get elements
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const showSignupBtn = document.getElementById('show-signup');
    const showLoginBtn = document.getElementById('show-login');
    const loginScreen = document.getElementById('login-screen');
    const signupScreen = document.getElementById('signup-screen');

    //console.log('Forms initialized!'); // Debug log

    // Add event listeners
    if (loginForm) loginForm.addEventListener('submit', handleLogin);
    if (signupForm) signupForm.addEventListener('submit', handleSignup);
    
    if (loginForm) loginForm.addEventListener('submit', handleLogin);
    if (signupForm) signupForm.addEventListener('submit', handleSignup);
    
    // Switch to Signup
    if (showSignupBtn) {
        showSignupBtn.addEventListener('click', (e) => {
            e.preventDefault();
            //console.log('Switching to signup...'); // Debug log
            loginScreen.style.display = 'none';
            signupScreen.style.display = 'flex';
            // Add animation class
            signupScreen.classList.add('fade-in');
            // Remove animation class after animation completes
            setTimeout(() => {
                signupScreen.classList.remove('fade-in');
            }, 300);
        });
    }

    // Switch to Login
    if (showLoginBtn) {
        showLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            //console.log('Switching to login...'); // Debug log
            signupScreen.style.display = 'none';
            loginScreen.style.display = 'flex';
            // Add animation class
            loginScreen.classList.add('fade-in');
            // Remove animation class after animation completes
            setTimeout(() => {
                loginScreen.classList.remove('fade-in');
            }, 300);
        });
    }
}

function handleLogin(event) {
    event.preventDefault();
    const email = event.target.querySelector('input[type="email"]').value;
    const password = event.target.querySelector('input[type="password"]').value;
    
    //console.log('Login attempted with:', email); // Debug log
    //alert(`Login attempted with email: ${email}`);
}

function handleSignup(event) {
    event.preventDefault();
    const form = event.target;
    const username = form.querySelector('input[type="text"]').value;
    const email = form.querySelector('input[type="email"]').value;
    const password = form.querySelectorAll('input[type="password"]')[0].value;
    const confirmPassword = form.querySelectorAll('input[type="password"]')[1].value;

    if (password !== confirmPassword) {
        alert("Passwords don't match!");
        return;
    }

    //console.log('Signup attempted with:', { username, email }); // Debug log
    //alert(`Signup attempted with username: ${username} and email: ${email}`);
}