// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore"
import { getStorage } from "firebase/storage"
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAhYqAcqsgBFlYNhmzX1R9FLwzKm6cySVw",
    authDomain: "compressing-app.firebaseapp.com",
    projectId: "compressing-app",
    storageBucket: "compressing-app.appspot.com",
    messagingSenderId: "548733690999",
    appId: "1:548733690999:web:5c96448d5b86b55fc35272"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const firestore = getFirestore(app);
const storage = getStorage(app);
export { app, storage, firestore };