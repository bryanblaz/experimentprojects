import {
  auth
} from "/firebase-config.js?v=20260720-1";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

const authButton = document.getElementById("blogAuthButton");
const createPostButton = document.getElementById("createPostButton");

onAuthStateChanged(auth, (user) => {
  if (!authButton || !createPostButton) {
    return;
  }

  authButton.onclick = null;

  if (user) {
    authButton.textContent = "Sign Out";
    authButton.href = "#";

    createPostButton.href = "/create-post.html";

    authButton.onclick = async (event) => {
      event.preventDefault();

      try {
        await signOut(auth);
      } catch (error) {
        console.error("Sign-out failed:", error);
      }
    };
  } else {
    authButton.textContent = "Sign In";
    authButton.href = "/login.html";

    createPostButton.href =
      "/login.html?next=/create-post.html";
  }
});