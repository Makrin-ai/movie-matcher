import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDPWLLb_4s-zGfz0cyy0R-U2BiJ0bFPBZI",
  authDomain: "movie-night-matcher-cfbb5.firebaseapp.com",
  projectId: "movie-night-matcher-cfbb5",
  storageBucket: "movie-night-matcher-cfbb5.firebasestorage.app",
  messagingSenderId: "333247612718",
  appId: "1:333247612718:web:77dddc58475988f0b41cbf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);

export function signInAsGuest() {
  return signInAnonymously(auth);
}