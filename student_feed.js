document.addEventListener("DOMContentLoaded", function () {
    // Navigation Setup
    const jobListingsNav = document.getElementById('jobListingsNav');
    const profileNav = document.getElementById('profileNav');
    const settingsNav = document.getElementById('settingsNav');

    if (profileNav) {
        profileNav.addEventListener('click', redirectToProfile);
    }

    // Initialize Notification Manager
    window.notificationManager = new NotificationManager();

    // Fetch Initial Data
    fetchStudentDetails();
    fetchJobListings();

    // Search Functionality
    const jobSearchInput = document.getElementById('jobSearchInput');
    if (jobSearchInput) {
        jobSearchInput.addEventListener('input', filterJobs);
    }

    // Set up periodic job check
    setInterval(fetchJobListings, 60000); // Check for new jobs every minute
});

// Redirect to Profile Page
function redirectToProfile() {
    const token = localStorage.getItem("access_token");
    const regNumber = localStorage.getItem("reg_number");  

    if (!token || !regNumber) {
        window.location.href = "index.html";
        return;
    }

    window.location.href = "profile.html";
}

function fetchStudentDetails() {
    const token = localStorage.getItem("access_token");
    const regNumber = localStorage.getItem("reg_number");  

    if (!token || !regNumber) {
        window.location.href = "index.html"; 
        return;
    }

    fetch(`http://127.0.0.1:8000/students/${regNumber}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch student details');
        }
        return response.json();
    })
    .then(data => {
        const sidebarStudentName = document.getElementById("topBarStudentName");
        if (sidebarStudentName) {
            sidebarStudentName.textContent = data.name || "Student";
        }
    })
    .catch(error => {
        console.error("Error fetching student details:", error);
        alert("Could not load student details. Please try again later.");
    });
}

// Fetch Job Listings
function fetchJobListings() {
    const token = localStorage.getItem("access_token");
    const jobList = document.getElementById("jobList");

    if (!jobList) {
        console.error("Job list container not found");
        return;
    }

    fetch("http://127.0.0.1:8000/admin/jobs", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch job listings');
        }
        return response.json();
    })
    .then(jobs => {
        // Check for new jobs and update notifications
        if (window.notificationManager) {
            window.notificationManager.checkNewJobs(jobs);
        }

        // Clear previous job listings
        jobList.innerHTML = "";

        // Sort jobs by most recent
        jobs.sort((a, b) => new Date(b.posted_at) - new Date(a.posted_at));

        // Check if no jobs are available
        if (jobs.length === 0) {
            jobList.innerHTML = `
                <div class="no-jobs">
                    <p>No job listings available at the moment.</p>
                </div>
            `;
            return;
        }

        // Render job listings
        jobs.forEach(job => {
            const jobItem = document.createElement("div");
            jobItem.classList.add("job-item");

            // Format date
            const postedDate = new Date(job.posted_at).toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });

            jobItem.innerHTML = `
                <div class="job-item-header">
                    <h3 class="job-item-title">${job.title}</h3>
                    <span class="job-item-date">${postedDate}</span>
                </div>
                <div class="job-item-description">
                    <p>${job.description}</p>
                </div>
                <a href="${job.registration_link || '#'}" 
                   target="_blank" 
                   class="apply-btn" 
                   ${!job.registration_link ? 'disabled' : ''}>
                    Apply Now
                </a>
            `;

            jobList.appendChild(jobItem);
        });
    })
    .catch(error => {
        console.error("Error fetching jobs:", error);
        jobList.innerHTML = `
            <div class="error-message">
                <p>Unable to load job listings. Please try again later.</p>
            </div>
        `;
    });
}

// Filter Jobs
function filterJobs() {
    const searchInput = document.getElementById('jobSearchInput');
    const jobItems = document.querySelectorAll('.job-item');
    const searchTerm = searchInput.value.toLowerCase();

    jobItems.forEach(jobItem => {
        const title = jobItem.querySelector('.job-item-title').textContent.toLowerCase();
        const description = jobItem.querySelector('.job-item-description p').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || description.includes(searchTerm)) {
            jobItem.style.display = 'block';
        } else {
            jobItem.style.display = 'none';
        }
    });
}

document.addEventListener("DOMContentLoaded", function () {
    const logoutButton = document.getElementById("logoutBtn");

    if (logoutButton) {
        logoutButton.addEventListener("click", function () {
            localStorage.removeItem("access_token");
            localStorage.removeItem("reg_number");
            window.location.href = "index.html"; // Redirect to login page
        });
    } else {
        console.error("Logout button not found!");
    }
});
