import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCVHdIEIm3EK9XmSQ0aZxFumZL_6Dj1WdQ",
  authDomain: "shopkadata.firebaseapp.com",
  projectId: "shopkadata",
  storageBucket: "shopkadata.firebasestorage.app",
  messagingSenderId: "73584342112",
  appId: "1:73584342112:web:01e168ebb2935b8d34bf05",
  measurementId: "G-YHYNNYY3D5"
};
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
