import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCAL_hjW8o-f1Z0WQA3aWomK_JE1Llteco",
  authDomain: "omegacomputersbackend.firebaseapp.com",
  projectId: "omegacomputersbackend",
  storageBucket: "omegacomputersbackend.appspot.com",
  messagingSenderId: "690513296376",
  appId: "1:690513296376:web:ea5bc8e6828eb0b179f40d"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth();
export const storage = getStorage(app);