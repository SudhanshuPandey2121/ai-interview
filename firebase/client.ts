// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCQ21TPRGPoIG4E_5pJcQT4N-rQhb-l9to",
  authDomain: "ai-mock-interviews-24071.firebaseapp.com",
  projectId: "ai-mock-interviews-24071",
  storageBucket: "ai-mock-interviews-24071.firebasestorage.app",
  messagingSenderId: "785739413652",
  appId: "1:785739413652:web:ec6beae2264f5e86e31c81",
  measurementId: "G-7XCBZX42VF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);