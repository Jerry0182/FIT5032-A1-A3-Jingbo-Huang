// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDM2F8OzjlZSr-sbjJzWIFlygnmxmX0E1s",
  authDomain: "men-s-health-b3367.firebaseapp.com",
  projectId: "men-s-health-b3367",
  storageBucket: "men-s-health-b3367.firebasestorage.app",
  messagingSenderId: "180636681197",
  appId: "1:180636681197:web:80df049a9aa72b45125de4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

export default app;
