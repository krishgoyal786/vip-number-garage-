import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your real web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC8Pekpo57c6Q5_svjxEqkaBao-TgejK5A",
  authDomain: "vipnumbergarage.firebaseapp.com",
  projectId: "vipnumbergarage",
  storageBucket: "vipnumbergarage.firebasestorage.app",
  messagingSenderId: "314635981783",
  appId: "1:314635981783:web:fe9f4bd7d3f43d8c06b192",
  measurementId: "G-D1C7R2XRHR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Initialize Analytics (Optional)
export const analytics = getAnalytics(app);
