document.getElementById("login-form").addEventListener("submit", async function(event) {
    event.preventDefault();

    const regNumber = document.getElementById("reg_number").value;
    const password = document.getElementById("password").value;

    const loginData = new URLSearchParams();
    loginData.append("username", regNumber);  
    loginData.append("password", password);

    try {
        const response = await fetch("http://127.0.0.1:8000/login", {  
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: loginData
        });

        if (!response.ok) {
            throw new Error("Invalid registration number or password");
        }

        const data = await response.json();
        localStorage.setItem("access_token", data.access_token);  
        localStorage.setItem("reg_number", regNumber);  

        window.location.href = "student_feed.html";
    } catch (error) {
        document.getElementById("error-message").style.display = "block";
        document.getElementById("error-message").textContent = error.message;
    }
});
