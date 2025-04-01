document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("admin_token");

    if (!token) {
        alert("Unauthorized! Redirecting to login.");
        window.location.href = "admin_login.html";
        return;
    }

    async function fetchStats() {
        try {
            const response = await fetch("http://127.0.0.1:8000/admin/stats", {
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (!response.ok) throw new Error("Failed to fetch stats");

            const stats = await response.json();
            document.getElementById("totalJobs").textContent = stats.total_jobs;
            document.getElementById("totalStudents").textContent = stats.total_students;
        } catch (error) {
            console.error("Error fetching stats:", error);
            document.getElementById("totalJobs").textContent = "Error";
            document.getElementById("totalStudents").textContent = "Error";
        }
    }

    fetchStats();

    document.getElementById("logoutBtn").addEventListener("click", function () {
        localStorage.removeItem("admin_token");
        window.location.href = "admin_login.html";
    });

    async function fetchJobs() {
        try {
            const response = await fetch("http://127.0.0.1:8000/admin/jobs", {
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (!response.ok) throw new Error("Failed to fetch jobs");

            const jobs = await response.json();
            updateJobLists(jobs);
        } catch (error) {
            console.error("Error fetching jobs:", error);
            document.getElementById("dashboardJobs").innerHTML = "<p style='color:red;'>⚠ Failed to load jobs.</p>";
        }
    }

    async function deleteJob(jobId) {
        if (!confirm("Are you sure you want to delete this job?")) return;

        try {
            const response = await fetch(`http://127.0.0.1:8000/admin/jobs/${jobId}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (!response.ok) throw new Error("Failed to delete job");

            alert("✅ Job deleted successfully!");
            fetchJobs();
        } catch (error) {
            console.error("Error deleting job:", error);
            alert("❌ Failed to delete job. Please try again.");
        }
    }

    function updateJobLists(jobs) {
        const dashboardJobs = document.getElementById("dashboardJobs");
    
        dashboardJobs.innerHTML = "<h3>Available Jobs</h3>";
    
        if (jobs.length === 0) {
            dashboardJobs.innerHTML += "<p>No jobs available.</p>";
            return;
        }
    
        // Sort jobs by job_id in descending order (newest first)
        jobs.sort((a, b) => b.id - a.id);
    
        jobs.forEach(job => {
            const jobItem = document.createElement("div");
            jobItem.classList.add("job-item");
            jobItem.innerHTML = `
                <h4>${job.title}</h4>
                <div class="job-description">${job.description}</div>
                <div class="job-link-section">
                    <h5>Link:</h5>
                    <p>${job.registration_link}</p>
                </div>
                <button class="delete-btn" data-job-id="${job.id}">🗑 Delete</button>
            `;
            dashboardJobs.appendChild(jobItem);
        });
    
        document.querySelectorAll(".delete-btn").forEach(button => {
            button.addEventListener("click", function () {
                const jobId = this.getAttribute("data-job-id");
                deleteJob(jobId);
            });
        });
    }
    
    fetchJobs();

    const jobForm = document.getElementById("jobForm");
    if (jobForm) {
        jobForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const jobTitle = document.getElementById("jobTitle").value.trim();
            const jobDescription = document.getElementById("jobDescription").value.trim();
            const registrationLink = document.getElementById("registrationLink").value.trim();

            if (!jobTitle || !jobDescription || !registrationLink) {
                alert("❌ All fields are required!");
                return;
            }

            const jobData = {
                title: jobTitle,
                description: jobDescription,
                registration_link: registrationLink
            };

            try {
                const response = await fetch("http://127.0.0.1:8000/admin/create-job", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(jobData)
                });

                if (!response.ok) throw new Error("Failed to create job");

                const result = await response.json();
                alert("✅ Job created successfully!");
                
                // Clear form fields
                jobForm.reset();

                // Refresh job list
                fetchJobs();
            } catch (error) {
                console.error("Error creating job:", error);
                alert("❌ Failed to create job. Please try again.");
            }
        });
    }


    async function fetchStudentDetails() {
        const studentDataElement = document.getElementById("studentData");
        studentDataElement.innerHTML = "<p>Fetching data...</p>";

        try {
            const response = await fetch("http://127.0.0.1:8000/students", {
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (!response.ok) throw new Error("Failed to fetch student details");

            const studentData = await response.json();
            displayStudentData(studentData);
        } catch (error) {
            console.error("Error fetching student details:", error);
            studentDataElement.innerHTML = "<p style='color:red;'>❌ Failed to load student details.</p>";
        }
    }

    function displayStudentData(students) {
        const studentDataElement = document.getElementById("studentData");
        studentDataElement.innerHTML = "";

        if (students.length === 0) {
            studentDataElement.innerHTML = "<p>No student data available.</p>";
            return;
        }

        const tableContainer = document.createElement("div");
        tableContainer.classList.add("table-container");
        tableContainer.style.cssText = "overflow-x: auto; max-height: 80vh; position: relative; border: 1px solid #ddd; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin: 20px 0;";

        const table = document.createElement("table");
        table.classList.add("student-table");
        table.style.cssText = "width: 100%; border-collapse: collapse; white-space: nowrap;";

        const headers = [
            "Registration No", "Name", "Branch", "DOB", "Category", "Gender",
            "PAN No.", "Aadhaar No.", "Father's Name", "Interested in Placement",
            "Placement Declaration", "Reason Not Interested", "10th %", "10th Year",
            "10th School", "10th Board", "12th %", "12th Year", "12th School",
            "12th Board", "Polytechnic %", "Polytechnic Year", "Polytechnic Institute",
            "GPA (1st Sem)", "GPA (2nd Sem)", "GPA (3rd Sem)", "GPA (4th Sem)", "GPA (5th Sem)",
            "GPA (6th Sem)", "Final CGPA", "Current CGPA", "Active Backlogs", "Academic Gap",
            "Mobile No.", "WhatsApp No.", "Home Contact No.", "SMIT Email", "Personal Email",
            "Permanent Address", "Home Town", "Home State", "Home State PIN", "Country",
            "TG Name", "TG Contact", "TG Email"
        ];

        const thead = document.createElement("thead");
        thead.style.cssText = "position: sticky; top: 0; background: #f8f9fa; box-shadow: 0 2px 2px rgba(0,0,0,0.1);";
        
        const headerRow = document.createElement("tr");
        headers.forEach(headerText => {
            const th = document.createElement("th");
            th.textContent = headerText;
            th.style.cssText = "padding: 12px 15px; text-align: left; border: 1px solid #ddd; font-weight: bold;";
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement("tbody");
        students.forEach(student => {
            const row = document.createElement("tr");
            row.style.cssText = "transition: background-color 0.3s ease;";
            row.addEventListener('mouseover', () => row.style.backgroundColor = '#f5f5f5');
            row.addEventListener('mouseout', () => row.style.backgroundColor = 'transparent');

            headers.forEach(header => {
                const fieldName = header.toLowerCase().replace(/\s+/g, "_");
                const td = document.createElement("td");
                td.textContent = student[fieldName] || "N/A";
                td.style.cssText = "padding: 12px 15px; border: 1px solid #ddd;";
                row.appendChild(td);
            });

            tbody.appendChild(row);
        });

        table.appendChild(tbody);
        tableContainer.appendChild(table);
        studentDataElement.appendChild(tableContainer);
    }

    document.getElementById("downloadCsvBtn").addEventListener("click", async function () {
        try {
            const response = await fetch("http://127.0.0.1:8000/students", {
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (!response.ok) throw new Error("Failed to fetch student data");

            const students = await response.json();
            if (students.length === 0) {
                alert("No student data available.");
                return;
            }

            let csvContent = convertToCSV(students);

            let blob = new Blob([csvContent], { type: "text/csv" });
            let link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "students_data.csv";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Error downloading CSV:", error);
            alert("❌ Failed to download student data.");
        }
    });

    function convertToCSV(jsonData) {
        let headers = Object.keys(jsonData[0]).join(",") + "\n";
        let rows = jsonData.map(obj => Object.values(obj).join(",")).join("\n");
        return headers + rows;
    }

    document.querySelector(`.sidebar ul li[onclick="showSection('settings')"]`).addEventListener("click", fetchStudentDetails);

    function showSection(sectionId) {
        document.querySelectorAll(".form-section").forEach(section => {
            section.classList.add("hidden");
        });

        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.remove("hidden");
        }

        document.querySelectorAll(".sidebar ul li").forEach(item => {
            item.classList.remove("active");
        });

        const selectedItem = document.querySelector(`.sidebar ul li[onclick="showSection('${sectionId}')"]`);
        if (selectedItem) {
            selectedItem.classList.add("active");
        }

        if (sectionId === "settings") {
            fetchStudentDetails();
        }
    }

    document.querySelectorAll(".sidebar ul li").forEach(item => {
        item.addEventListener("click", function () {
            const sectionId = this.getAttribute("onclick").match(/'([^']+)'/)[1];
            showSection(sectionId);
        });
    });

    const sidebarToggle = document.getElementById("sidebarToggle");
    if (sidebarToggle) {
        sidebarToggle.addEventListener("click", function () {
            document.querySelector(".sidebar").classList.toggle("open");
        });
    }
});

