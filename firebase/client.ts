// Import the functions you need from the SDKs you need
import { initializeApp,getApp,getApps } from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
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
const app =!getApps().length ? initializeApp(firebaseConfig):getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);

