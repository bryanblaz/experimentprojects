import {
  auth,
  db
} from "/firebase-config.js?v=20260720-1";

import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const authForm = document.getElementById("authForm");
const displayNameInput = document.getElementById("displayName");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const nameField = document.getElementById("nameField");
const authSubmit = document.getElementById("authSubmit");
const googleSignInButton = document.getElementById("googleSignIn");
const authMessage = document.getElementById("authMessage");

const authHeading = document.getElementById("authHeading");
const authDescription = document.getElementById("authDescription");

const modeButtons = document.querySelectorAll("[data-auth-mode]");

let authMode = "signin";

function setMessage(message, type = "") {
  if (!authMessage) {
    return;
  }

  authMessage.textContent = message;
  authMessage.className = "auth-message";

  if (type) {
    authMessage.classList.add(`is-${type}`);
  }
}

function setLoading(isLoading) {
  authSubmit.disabled = isLoading;
  googleSignInButton.disabled = isLoading;

  authSubmit.textContent = isLoading
    ? "Please wait..."
    : authMode === "signup"
      ? "Create Account"
      : "Sign In";
}

function setAuthMode(nextMode) {
  authMode = nextMode;

  const isSignUp = authMode === "signup";

  nameField.hidden = !isSignUp;
  displayNameInput.required = isSignUp;

  passwordInput.autocomplete = isSignUp
    ? "new-password"
    : "current-password";

  authSubmit.textContent = isSignUp
    ? "Create Account"
    : "Sign In";

  authHeading.textContent = isSignUp
    ? "Join the notebook."
    : "Welcome back.";

  authDescription.textContent = isSignUp
    ? "Create an account to write and submit blog posts."
    : "Sign in to write, upload files, and manage your blog posts.";

  modeButtons.forEach((button) => {
    const isActive = button.dataset.authMode === authMode;

    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });

  setMessage("");
}

function getSafeRedirect() {
  const searchParameters = new URLSearchParams(window.location.search);
  const nextPage = searchParameters.get("next");

  if (
    nextPage &&
    nextPage.startsWith("/") &&
    !nextPage.startsWith("//")
  ) {
    return nextPage;
  }

  return "/blog.html";
}

async function saveUserProfile(user) {
  const userReference = doc(db, "users", user.uid);
  const userSnapshot = await getDoc(userReference);

  const profileData = {
    uid: user.uid,
    displayName: user.displayName ?? "",
    email: user.email ?? "",
    photoURL: user.photoURL ?? "",
    updatedAt: serverTimestamp(),
    lastLoginAt: serverTimestamp()
  };

  if (!userSnapshot.exists()) {
    profileData.createdAt = serverTimestamp();
  }

  await setDoc(
    userReference,
    profileData,
    { merge: true }
  );
}

function readableAuthError(error) {
  switch (error.code) {
    case "auth/email-already-in-use":
      return "An account already exists with that email address.";

    case "auth/invalid-email":
      return "Enter a valid email address.";

    case "auth/weak-password":
      return "Use a stronger password with at least eight characters.";

    case "auth/invalid-credential":
      return "The email address or password is incorrect.";

    case "auth/popup-closed-by-user":
      return "The Google sign-in window was closed.";

    case "auth/popup-blocked":
      return "Your browser blocked the Google sign-in window.";

    case "auth/too-many-requests":
      return "Too many attempts. Wait a few minutes and try again.";

    case "auth/network-request-failed":
      return "The network request failed. Check your connection.";

    default:
      console.error(error);
      return "Authentication failed. Please try again.";
  }
}

modeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setAuthMode(button.dataset.authMode ?? "signin");
  });
});

authForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const displayName = displayNameInput.value.trim();

  setMessage("");
  setLoading(true);

  try {
    let userCredential;

    if (authMode === "signup") {
      if (!displayName) {
        throw new Error("Display name is required.");
      }

      userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateProfile(userCredential.user, {
        displayName
      });
    } else {
      userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
    }

    await saveUserProfile(userCredential.user);

    window.location.assign(getSafeRedirect());
  } catch (error) {
    if (error.message === "Display name is required.") {
      setMessage(error.message, "error");
    } else {
      setMessage(readableAuthError(error), "error");
    }
  } finally {
    setLoading(false);
  }
});

googleSignInButton.addEventListener("click", async () => {
  setMessage("");
  setLoading(true);

  try {
    const googleProvider = new GoogleAuthProvider();

    googleProvider.setCustomParameters({
      prompt: "select_account"
    });

    const userCredential = await signInWithPopup(
      auth,
      googleProvider
    );

    await saveUserProfile(userCredential.user);

    window.location.assign(getSafeRedirect());
  } catch (error) {
    setMessage(readableAuthError(error), "error");
  } finally {
    setLoading(false);
  }
});

setAuthMode("signin");