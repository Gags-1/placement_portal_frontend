document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("loginForm").addEventListener("submit", async function (event) {
        event.preventDefault(); // Prevent form from refreshing page

        const formData = new FormData();
        formData.append("username", document.getElementById("email").value);
        formData.append("password", document.getElementById("password").value);

        try {
            const response = await fetch("http://127.0.0.1:8000/admin/login", {
                method: "POST",
                body: formData, // Form data instead of JSON
            });

            const data = await response.json();

            if (response.ok) {
                // Store the token in localStorage
                localStorage.setItem("admin_token", data.access_token);
                
                // Show success message and redirect
                document.getElementById("message").style.color = "green";
                document.getElementById("message").textContent = "Login successful! Redirecting...";
                
                setTimeout(() => {
                    window.location.href = "admin_dashboard.html"; // Redirect to dashboard
                }, 2000);
            } else {
                throw new Error(data.detail || "Invalid credentials");
            }
        } catch (error) {
            document.getElementById("message").style.color = "red";
            document.getElementById("message").textContent = error.message;
        }
    });
});