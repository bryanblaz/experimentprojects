import {
  auth
} from "/firebase-config.js?v=20260721-1";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

const authButton = document.getElementById("blogAuthButton");
const createPostButton = document.getElementById("createPostButton");
const authStatus = document.getElementById("blogAuthStatus");

onAuthStateChanged(auth, (user) => {
  if (!authButton || !createPostButton) return;

  authButton.onclick = null;
  createPostButton.onclick = null;

  if (user) {
    authButton.textContent = "Sign Out";
    authButton.href = "#";

    createPostButton.textContent = "Create Post — Coming Soon";
    createPostButton.href = "#";
    createPostButton.setAttribute("aria-disabled", "true");

    if (authStatus) {
      const accountName = user.displayName || user.email || "your account";
      authStatus.textContent = `Signed in as ${accountName}.`;
    }

    authButton.onclick = async (event) => {
      event.preventDefault();

      try {
        await signOut(auth);
      } catch (error) {
        console.error("Sign-out failed:", error);
      }
    };

    createPostButton.onclick = (event) => {
      event.preventDefault();
    };
  } else {
    authButton.textContent = "Sign In";
    authButton.href = "/login.html";

    createPostButton.textContent = "Create Post — Coming Soon";
    createPostButton.href = "/login.html";
    createPostButton.removeAttribute("aria-disabled");

    if (authStatus) {
      authStatus.textContent = "Sign in to join the Experiment Projects Blog.";
    }
  }
});
