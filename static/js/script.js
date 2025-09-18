document.addEventListener('DOMContentLoaded', () => {
    const signupBtn = document.getElementById('signup-btn');
    const loginBtn = document.getElementById('login-btn');
    const signupForm = document.getElementById('signup-form');
    const loginForm = document.getElementById('login-form');
    const formTitle = document.getElementById('form-title');
    const formSubtitle = document.getElementById('form-subtitle');
    const togglePasswordFields = document.querySelectorAll('.toggle-password');

    // ✅ Toggle between forms
    signupBtn.addEventListener('click', () => {
        signupBtn.classList.add('active');
        loginBtn.classList.remove('active');
        signupForm.style.display = 'block';
        loginForm.style.display = 'none';
        formTitle.textContent = "Begin Your Adventure";
        formSubtitle.textContent = "Sign Up with Open account";
    });

    loginBtn.addEventListener('click', () => {
        loginBtn.classList.add('active');
        signupBtn.classList.remove('active');
        signupForm.style.display = 'none';
        loginForm.style.display = 'block';
        formTitle.textContent = "Welcome Back";
        formSubtitle.textContent = "Log In to continue";
    });

    // ✅ Toggle password visibility
    togglePasswordFields.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const input = toggle.previousElementSibling;
            input.type = input.type === 'password' ? 'text' : 'password';
        });
    });

    // ✅ Handle signup form submission
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById("signup-username").value;
        const password = document.getElementById("signup-password").value;
        const role = document.getElementById("signup-role").value;
        const email = document.getElementById("signup-email").value;

        try {
            const response = await fetch("http://127.0.0.1:5000/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password, role, email })
            });

            const result = await response.json();

            if (response.ok) {
                alert(result.message);
                signupForm.reset();
            } else {
                alert(result.error || "Signup failed!");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Something went wrong. Please try again.");
        }
    });

    // ✅ Handle login form submission
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = loginForm.querySelector("input[type='email']").value;
        const password = document.getElementById("login-password").value;

        try {
            const response = await fetch("http://127.0.0.1:5000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const result = await response.json();

            if (response.ok) {
                alert(result.message);

                if (result.role === "doctor") {
                    window.location.href = "doctor.html";
                } else if (result.role === "patient") {
                    window.location.href = "patient.html";
                }
            } else {
                alert(result.error || "Login failed!");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Something went wrong. Please try again.");
        }
    });
});
