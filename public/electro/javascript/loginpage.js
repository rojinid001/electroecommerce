function forgotPassword() {
    var email = prompt("Please enter your email address:");
    // Perform password reset logic here, such as sending an email with a reset link
    // This is just a placeholder function for demonstration purposes
    if (email) {
      alert("Password reset link has been sent to your email address.");
    }
  }

  document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;

    // Perform login authentication here, such as making an AJAX request to a server-side endpoint
    // This is just a placeholder logic for demonstration purposes
    if (email === "example@example.com" && password === "password") {
      alert("Login successful!");
    } else {
      document.getElementById("errorMessage").textContent = "Invalid email or password.";
    }
  });