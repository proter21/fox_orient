// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBlbxoAwCOPHSQFO-c4tv2J4lPQhVTvg5E",
  authDomain: "foxorient-6e040.firebaseapp.com",
  projectId: "foxorient-6e040",
  storageBucket: "foxorient-6e040.firebasestorage.app",
  messagingSenderId: "577066001516",
  appId: "1:577066001516:web:a9038c5a29eb7949706449",
  measurementId: "G-02S0EEHV7F",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
