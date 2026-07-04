import {
  firebase,
  isFirebaseConfigured,
  adminAllowlist,
  signInWithEmailAndPassword
} from "./firebase-config.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("adminLoginForm");
  const status = document.getElementById("loginStatus");

  form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const { email, password } = Object.fromEntries(new FormData(form).entries());

    if (!isFirebaseConfigured) {
      localStorage.setItem("beastForce:demoAdmin", email);
      status.textContent = "Demo mode active. Redirecting to dashboard.";
      setTimeout(() => window.location.href = "admin-dashboard.html", 450);
      return;
    }

    try {
      if (!adminAllowlist.includes(email)) {
        status.textContent = "This email is not in the admin allowlist.";
        return;
      }

      await signInWithEmailAndPassword(firebase.auth, email, password);
      window.location.href = "admin-dashboard.html";
    } catch (error) {
      status.textContent = "Login failed. Check email, password, and Firebase setup.";
      console.error(error);
    }
  });
});
