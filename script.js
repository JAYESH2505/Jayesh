// Load EmailJS SDK
import apiKeys from './config.js'; // Import API keys

emailjs.init(apiKeys.apiKey); // Use the API key from config.js
console.log("EmailJS initialized successfully.");

// Typing effect for the "I'm Part" text
const roles = ["Gamer", "Developer", "Deep Learning Engineer"];
const typingElement = document.querySelector('.typing');
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function type() {
    await sleep(100);
    const currentRole = roles[roleIndex];
    if (isDeleting) {
        // Remove characters
        typingElement.textContent = "I'm " + currentRole.substring(0, charIndex--);
    } else {
        // Add characters
        typingElement.textContent = "I'm " + currentRole.substring(0, charIndex++);
    }

    // Typing speed
    const typingSpeed = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex === currentRole.length) {
        // Start deleting 
        isDeleting = true;
        setTimeout(type, 100); // Short pause before deleting
    } else if (isDeleting && charIndex === 0) {
        // Move to the next role and start typing immediately
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length; // Loop back to the first role
        setTimeout(type, 100); // No pause before typing the next role
    } else {
        setTimeout(type, typingSpeed);
        await sleep(500);
    }
}

// Start typing effect when the page loads
window.onload = function() {
    type();
};

// Form Validation and Submission
const contactForm = document.getElementById('contact-form');
const submitBtn = contactForm.querySelector('.submit-btn');

contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // Get form values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    // Validation
    if (!name || !email || !message) {
        alert('Please fill in all fields');
        return;
    }

    if (!isValidEmail(email)) {
        alert('Please enter a valid email address');
        return;
    }

    // Disable button while sending
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    // Send the email to yourself
    emailjs.send("service_o8hsg4a", "template_xmeglqj", {
        name: name,
        email: email,
        message: message
    })
    .then(function (response) {
        console.log('SUCCESS! Message sent to you.', response.status, response.text);

        // Send auto-reply to the user
        return emailjs.send("service_o8hsg4a", "template_hmb48vt", {
            name: name,
            email: email,
            message: message
        });
    })
    .then(function (response) {
        console.log('SUCCESS! Auto-reply sent to user.', response.status, response.text);
        contactForm.reset();
        alert('Thank you for your message! A confirmation email has been sent to your inbox.');
    })
    .catch(function (error) {
        console.error('EmailJS error:', error);
        alert(`There was an error: ${error.text || "Please try again later."}`);
    })
    .finally(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
    });
});

// Email validation helper function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
