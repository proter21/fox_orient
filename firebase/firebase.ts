// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
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
// const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app);
// export const db = getFirestore(app);

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { app, db, storage, auth };
