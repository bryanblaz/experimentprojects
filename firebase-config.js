import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";

import {
  getAuth
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

import {
  getFirestore
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC0uv-s9kBtuJ9hfTa6XGR15w0z6MDnkTg",
  authDomain: "experiment-projects-blog.firebaseapp.com",
  projectId: "experiment-projects-blog",
  storageBucket: "experiment-projects-blog.firebasestorage.app",
  messagingSenderId: "556991493169",
  appId: "1:556991493169:web:820e4a5ed5ea0b215b5110",
  measurementId: "G-51G5HFLQ38"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
