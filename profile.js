// Check if user is logged in
const token = localStorage.getItem("access_token");
const regNumber = localStorage.getItem("reg_number");

if (!token || !regNumber) {
    alert("You are not logged in. Redirecting to login page.");
    window.location.href = "index.html"; // Redirect to login
}

// Fetch Student Details
async function fetchStudent() {
    try {
        const response = await fetch(`http://127.0.0.1:8000/students/${regNumber}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch student details.");
        }

        const student = await response.json();

        // Update Name and Registration Number dynamically
        document.getElementById("student-name").innerText = student.name || "Unknown";
        document.getElementById("reg-number").innerText = student.registration_no || "Unknown";

        // Populate Basic Details form fields
        document.getElementById("branch").value = student.branch || "";
        document.getElementById("dob").value = student.dob || "";
        document.getElementById("category").value = student.category || "Gen";
        document.getElementById("gender").value = student.gender || "Male";
        document.getElementById("pan_number").value = student.pan_number || "";
        document.getElementById("adhaar_number").value = student.adhaar_number || "";
        document.getElementById("fathers_name").value = student.fathers_name || "";


        // Populate Academic Details form fields
        document.getElementById("class_10_percentage").value = student.class_10_percentage || "";
        document.getElementById("class_10_year").value = student.class_10_year || "";
        document.getElementById("class_10_school").value = student.class_10_school || "";
        document.getElementById("class_10_board").value = student.class_10_board || "";
        document.getElementById("class_12_percentage").value = student.class_12_percentage || "";
        document.getElementById("class_12_year").value = student.class_12_year || "";
        document.getElementById("class_12_school").value = student.class_12_school || "";
        document.getElementById("class_12_board").value = student.class_12_board || "";
        document.getElementById("polytechnic_percentage").value = student.polytechnic_percentage || "";
        document.getElementById("polytechnic_year").value = student.polytechnic_year || "";
        document.getElementById("polytechnic_institute").value = student.polytechnic_institute || "";

        // Populate College Performance Details
        document.getElementById("gpa_1st_sem").value = student.gpa_1st_sem || "";
        document.getElementById("gpa_2nd_sem").value = student.gpa_2nd_sem || "";
        document.getElementById("gpa_3rd_sem").value = student.gpa_3rd_sem || "";
        document.getElementById("gpa_4th_sem").value = student.gpa_4th_sem || "";
        document.getElementById("gpa_5th_sem").value = student.gpa_5th_sem || "";
        document.getElementById("gpa_6th_sem").value = student.gpa_6th_sem || "";
        document.getElementById("final_cgpa").value = student.final_cgpa || "";
        document.getElementById("current_cgpa").value = student.current_cgpa || "";
        document.getElementById("active_backlogs").value = student.active_backlogs || "0";
        document.getElementById("academic_gap").value = student.academic_gap || "0";

        // Populate Contact Information
        document.getElementById("mobile_no").value = student.mobile_no || "";
        document.getElementById("whatsapp_no").value = student.whatsapp_no || "";
        document.getElementById("home_contact_no").value = student.home_contact_no || "";
        document.getElementById("email_smit").value = student.email_smit || "";
        document.getElementById("personal_email").value = student.personal_email || "";
        document.getElementById("permanent_address").value = student.permanent_address || "";
        document.getElementById("home_town").value = student.home_town || "";
        document.getElementById("home_state").value = student.home_state || "";
        document.getElementById("home_state_pin").value = student.home_state_pin || "";
        document.getElementById("country").value = student.country || "";

        // Populate TG details
        document.getElementById("tg_name").value = student.tg_name || "";
        document.getElementById("tg_contact").value = student.tg_contact || "";
        document.getElementById("tg_email").value = student.tg_email || "";

        // Populate Placement Interest details
document.getElementById("interested_in_placement").value = student.interested_in_placement || "Yes";

if (student.interested_in_placement === "No") {
    document.getElementById("reason_not_interested").value = student.reason_not_interested || "";
}

// Set the appropriate radio button for placement declaration
if (student.placement_declaration === "agree") {
    document.querySelector('input[name="placement_declaration"][value="agree"]').checked = true;
} else if (student.placement_declaration === "disagree") {
    document.querySelector('input[name="placement_declaration"][value="disagree"]').checked = true;
}


    } catch (error) {
        console.error("Error fetching student data:", error);
        alert("Session expired. Please log in again.");
        localStorage.clear();
        window.location.href = "index.html"; // Redirect to login
    }
}

// Update Basic Details
document.getElementById("basic-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    const updatedData = {
        branch: document.getElementById("branch").value,
        dob: document.getElementById("dob").value,
        category: document.getElementById("category").value,
        gender: document.getElementById("gender").value,
        pan_number: document.getElementById("pan_number").value,
        adhaar_number: document.getElementById("adhaar_number").value,
        fathers_name: document.getElementById("fathers_name").value
    };

    try {
        const response = await fetch(`http://127.0.0.1:8000/students/${regNumber}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(updatedData)
        });

        if (response.ok) {
            alert("Basic details updated successfully!");
            fetchStudent(); // Refresh data
        } else {
            alert("Failed to update basic details.");
        }
    } catch (error) {
        console.error("Error updating student data:", error);
    }
});

// Update Academic Details
document.getElementById("academic-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    const updatedAcademicData = {
        class_10_percentage: parseFloat(document.getElementById("class_10_percentage").value) || null,
        class_10_year: parseInt(document.getElementById("class_10_year").value) || null,
        class_10_school: document.getElementById("class_10_school").value,
        class_10_board: document.getElementById("class_10_board").value,
        class_12_percentage: parseFloat(document.getElementById("class_12_percentage").value) || null,
        class_12_year: parseInt(document.getElementById("class_12_year").value) || null,
        class_12_school: document.getElementById("class_12_school").value,
        class_12_board: document.getElementById("class_12_board").value,
        polytechnic_percentage: parseFloat(document.getElementById("polytechnic_percentage").value) || null,
        polytechnic_year: parseInt(document.getElementById("polytechnic_year").value) || null,
        polytechnic_institute: document.getElementById("polytechnic_institute").value
    };

    try {
        const response = await fetch(`http://127.0.0.1:8000/students/${regNumber}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(updatedAcademicData)
        });

        if (response.ok) {
            alert("Academic details updated successfully!");
            fetchStudent(); // Refresh data
        } else {
            alert("Failed to update academic details.");
        }
    } catch (error) {
        console.error("Error updating academic details:", error);
    }
});

// Update College Academic Performance Details
document.getElementById("college-performance-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    const updatedPerformanceData = {
        gpa_1st_sem: parseFloat(document.getElementById("gpa_1st_sem").value) || null,
        gpa_2nd_sem: parseFloat(document.getElementById("gpa_2nd_sem").value) || null,
        gpa_3rd_sem: parseFloat(document.getElementById("gpa_3rd_sem").value) || null,
        gpa_4th_sem: parseFloat(document.getElementById("gpa_4th_sem").value) || null,
        gpa_5th_sem: parseFloat(document.getElementById("gpa_5th_sem").value) || null,
        gpa_6th_sem: parseFloat(document.getElementById("gpa_6th_sem").value) || null,
        final_cgpa: parseFloat(document.getElementById("final_cgpa").value) || null,
        current_cgpa: parseFloat(document.getElementById("current_cgpa").value) || null,
        active_backlogs: parseInt(document.getElementById("active_backlogs").value) || 0,
        academic_gap: parseInt(document.getElementById("academic_gap").value) || 0


    
    };

    try {
        const response = await fetch(`http://127.0.0.1:8000/students/${regNumber}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(updatedPerformanceData)
        });

        if (response.ok) {
            alert("College academic performance updated successfully!");
            fetchStudent(); // Refresh data
        } else {
            alert("Failed to update performance details.");
        }
    } catch (error) {
        console.error("Error updating performance details:", error);
    }
});

// Update Contact Details
document.getElementById("contact-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    const updatedContactData = {
        mobile_no: document.getElementById("mobile_no").value,
        whatsapp_no: document.getElementById("whatsapp_no").value,
        home_contact_no: document.getElementById("home_contact_no").value,
        email_smit: document.getElementById("email_smit").value,
        personal_email: document.getElementById("personal_email").value,
        permanent_address: document.getElementById("permanent_address").value,
        home_town: document.getElementById("home_town").value,
        home_state: document.getElementById("home_state").value,
        home_state_pin: document.getElementById("home_state_pin").value,
        country: document.getElementById("country").value
    };

    try {
        const response = await fetch(`http://127.0.0.1:8000/students/${regNumber}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(updatedContactData)
        });

        if (response.ok) {
            alert("Contact details updated successfully!");
            fetchStudent(); // Refresh data
        } else {
            alert("Failed to update contact details.");
        }
    } catch (error) {
        console.error("Error updating contact details:", error);
    }
});

// Update Contact Details
document.getElementById("tg-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    const updatedTGData = {
        tg_name: document.getElementById("tg_name").value,
        tg_contact: document.getElementById("tg_contact").value,
        tg_email: document.getElementById("tg_email").value
    };

    try {
        const response = await fetch(`http://127.0.0.1:8000/students/${regNumber}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(updatedTGData)
        });

        if (response.ok) {
            alert("TG details updated successfully!");
            fetchStudent(); // Refresh data
        } else {
            alert("Failed to update TG details.");
        }
    } catch (error) {
        console.error("Error updating TG    details:", error);
    }
});

document.getElementById("placement-interest-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    const updatedPlacementData = {
        interested_in_placement: document.getElementById("interested_in_placement").value,
        placement_declaration: document.querySelector('input[name="placement_declaration"]:checked')?.value === "true",
        reason_not_interested: document.getElementById("reason_not_interested").value.trim()
    };

    try {
        const response = await fetch(`http://127.0.0.1:8000/students/${regNumber}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(updatedPlacementData)
        });

        if (response.ok) {
            alert("Placement Interest details updated successfully!");
            fetchStudent(); // Refresh data
        } else {
            const responseData = await response.json();
            alert(`Failed to update Placement Interest details: ${responseData.detail || "Unknown error"}`);
        }
    } catch (error) {
        console.error("Error updating placement details:", error);
        alert("An error occurred while updating Placement Interest details.");
    }
});



// Function to switch between sections
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.form-section').forEach(section => {
        section.style.display = 'none';
    });

    // Remove 'active' class from all sidebar items
    document.querySelectorAll('.sidebar ul li').forEach(item => {
        item.classList.remove('active');
    });

    // Show the selected section
    document.getElementById(sectionId).style.display = 'block';

    // Highlight the active section in the sidebar
    document.querySelector(`.sidebar ul li[onclick="showSection('${sectionId}')"]`).classList.add('active');
}

// Logout Function
function logout() {
    localStorage.clear(); 
    alert("Logged out successfully.");
    window.location.href = "index.html"; 
}

const logoutButton = document.getElementById("logoutBtn");
if (logoutButton) {
    logoutButton.addEventListener("click", logout);
}

function goToFeed() {
    window.location.href = "/public/student_feed.html";  // Change URL to your feed page
}
// Load student details on page load
fetchStudent();
