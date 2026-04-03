
/**
 * Authentication JavaScript file for handling login and signup forms.
 * This file manages the UI switching between login and signup forms,
 * and handles API calls to the backend for user registration and login.
 */

// DOM element references for form switching
const loginBox = document.getElementById('login-box');
const signupBox = document.getElementById('signup-box');
const loginTab = document.getElementById('login-tab');
const signupTab = document.getElementById('signup-tab');

/**
 * Displays the login form and hides the signup form.
 * Also updates the active tab styling.
 */
function showLoginForm() {
    loginBox.style.display = 'block';
    signupBox.style.display = 'none';
    // Switch active highlight to login tab
    loginTab.classList.add('active');
    signupTab.classList.remove('active');
}

/**
 * Displays the signup form and hides the login form.
 * Also updates the active tab styling.
 */
function showSignupForm() {
    loginBox.style.display = 'none';
    signupBox.style.display = 'block';
    // Switch active highlight to signup tab
    signupTab.classList.add('active');
    loginTab.classList.remove('active');
}

/**
 * Handles the signup API call to the backend.
 * Validates form data, sends a POST request to register a new user,
 * and redirects to the dashboard on success.
 * @param {Event} event - The form submit event
 */
async function handleSignupAPI(event) {
    event.preventDefault(); // Prevent default form submission

    // Retrieve form input values
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    // Validate password confirmation
    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    // Prepare signup data payload
    const signupData = {
        username: username,
        email: email,
        password: password,
        role: "USER"
    };

    // Backend API endpoint for user registration
    const url = "http://localhost:8080/auth/user/register";

    try {
        // Send POST request to register user
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(signupData)
        });

        // Check if response is successful
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Parse response JSON
        const result = await response.json();
        console.log('Signup success: ', result);
        alert('Signup successful!');

        // Store authentication token in local storage
        localStorage.setItem("token", result.token);
        // Redirect to dashboard
        window.location.href = "../html/dashboard.html";
    } catch (error) {
        console.error('Error during signup:', error);
        alert('Signup failed. Please try again.');
    }
}

/**
 * Placeholder function for handling login API call.
 * Currently not implemented.
 */
function handleLoginAPI() {
    // TODO: Implement login functionality
}

// Event listener for signup form submission
document.getElementById('formSignup').addEventListener('submit', handleSignupAPI);

// Password show/hide functionality
document.querySelectorAll('.toggle-password').forEach(button => {
    button.addEventListener('click', function() {
        const targetId = this.getAttribute('data-target');
        const input = document.getElementById(targetId);
        if (input.type === 'password') {
            input.type = 'text';
            this.textContent = 'Hide';
        } else {
            input.type = 'password';
            this.textContent = 'Show';
        }
    });
});
