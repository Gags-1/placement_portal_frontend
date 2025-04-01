document.getElementById("registerForm").addEventListener("submit", async function(event) {
    event.preventDefault(); // Prevent page reload

    const registration_no = document.getElementById("registration_no").value;
    const name = document.getElementById("name").value;
    const email_smit = document.getElementById("email_smit").value;
    const password = document.getElementById("password").value;

    const response = await fetch("http://127.0.0.1:8000/students/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ registration_no, name, email_smit, password })
    });

    const result = await response.json();

    if (response.ok) {
        document.getElementById("message").innerText = "Registration successful! Redirecting to login...";
        document.getElementById("message").style.color = "lightgreen";
        setTimeout(() => {
            window.location.href = "index.html"; // Change this to your actual login page URL
        }, 2000); // Redirect after 2 seconds
    } else {
        document.getElementById("message").innerText = "Error: " + result.detail;
        document.getElementById("message").style.color = "red";
    }
});
