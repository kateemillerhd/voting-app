document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("register-form");
  const loginForm = document.getElementById("login-form");

  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData(registerForm);
      const body = {
        username: formData.get("username"),
        password: formData.get("password")
      };

      try {
        const res = await fetch("/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });

        const data = await res.json();
        if (res.ok) {
          alert("Registered and logged in!");
          window.location.href = "/";
        } else {
          alert(data.error || "Registration failed.");
        }
      } catch (err) {
        console.error("Registration error:", err);
      }
    });
  }

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData(loginForm);
      const body = {
        username: formData.get("username"),
        password: formData.get("password")
      };

      try {
        const res = await fetch("/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });

        const data = await res.json();
        if (res.ok) {
          alert("Logged in!");
          window.location.href = "/";
        } else {
          alert(data.error || "Login failed.");
        }
      } catch (err) {
        console.error("Login error:", err);
      }
    });
  }
});
