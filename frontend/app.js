// Register User
async function registerUser() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const role = document.getElementById('role').value.trim();

    if (!username || !password || !role) {
        alert("All fields are required!");
        return;
    }

    const response = await fetch('http://localhost:50001/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role }),
    });

    const result = await response.json();

    if (response.ok) {
        alert("Registration successful! Please log in.");
        window.location.href = "login.html";
    } else {
        alert("Error: " + result.message);
    }
}

// Login User
async function loginUser() {
    const username = document.getElementById('loginUsername')?.value.trim();
    const password = document.getElementById('loginPassword')?.value.trim();

    if (!username || !password) {
        alert("All fields are required!");
        return;
    }

    try {
        const response = await fetch('http://localhost:50001/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        const result = await response.json();

        if (response.ok) {
            alert("Login successful!");
            localStorage.setItem("username", username);
            localStorage.setItem("userId", result.userId);
            localStorage.setItem("role", result.role);

            console.log("Role saved:", result.role); // Debugging

            window.location.href = "dashboard.html";
        } else {
            alert("Error: " + result.message);
        }
    } catch (error) {
        console.error("Login failed:", error);
        alert("Server error. Please try again later.");
    }
}

// Load User Role in Dashboard
function loadUserRole() {
    const role = localStorage.getItem("role");
    console.log("Retrieved role:", role); // Debugging
    document.getElementById("user-role").textContent = role ? role : "Unknown";
}

// Post Job
document.getElementById("jobForm")?.addEventListener("submit", async function (event) {
    event.preventDefault();

    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();
    const location = document.getElementById("location").value.trim();
    const salary = document.getElementById("salary").value.trim();
    const role = localStorage.getItem("role");

    if (!title || !description || !location || !salary) {
        alert("All fields are required!");
        return;
    }

    if (!role) {
        alert("You must be logged in to post a job.");
        return;
    }

    try {
        const response = await fetch("http://localhost:50001/api/jobs", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, description, location, salary, role }),
        });

        const result = await response.json();

        if (response.ok) {
            alert("Job posted successfully!");
            document.getElementById("jobForm").reset();
            window.location.href = "dashboard.html";
        } else {
            alert("Error: " + result.message);
        }
    } catch (error) {
        console.error("Error posting job:", error);
        alert("Server error. Please try again later.");
    }
});

// Logout Function
function logout() {
    localStorage.clear();
    window.location.href = "login.html";
}

// Load User Role & Jobs on Dashboard Load
document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("user-role")) {
        loadUserRole();
    }
});
