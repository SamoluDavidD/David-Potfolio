// ===== Mobile Menu Toggle =====
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });
}

// ===== Contact Form Handling =====
const form = document.getElementById('contact-form');
const statusText = document.querySelector('.form-status');

if (form && statusText) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    statusText.textContent = "Sending message...";
    statusText.style.color = "#0097a7";

    try {
      const formData = new FormData(form);
      const response = await fetch(form.action, {
        method: form.method,
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        statusText.textContent = "Message sent successfully. I’ll get back to you soon.";
        statusText.style.color = "#00bcd4";
        form.reset();
      } else {
        statusText.textContent = "Something went wrong. Please try again or email me directly.";
        statusText.style.color = "red";
      }
    } catch (error) {
      statusText.textContent = "Network error. Please check your connection and try again.";
      statusText.style.color = "red";
    }
  });
}
