import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAoqaso-XvQJwKKTlI1d_A0Zb3aoME4Tng",
  authDomain: "etaction-6d1bf.firebaseapp.com",
  projectId: "etaction-6d1bf",
  storageBucket: "etaction-6d1bf.firebasestorage.app",
  messagingSenderId: "519409425447",
  appId: "1:519409425447:web:048b74440f836bd20e0202"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
