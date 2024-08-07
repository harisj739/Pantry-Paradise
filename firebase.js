// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBvIVUZ0cgk8t-vaUJCiRwkr8FokC9N73I",
    authDomain: "inventory-management-a8d35.firebaseapp.com",
    projectId: "inventory-management-a8d35",
    storageBucket: "inventory-management-a8d35.appspot.com",
    messagingSenderId: "1083919327865",
    appId: "1:1083919327865:web:65c35e1ecac94741c6aaa8",
    measurementId: "G-NHM41ZRFNG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const firestore = getFirestore(app);

export {firestore};