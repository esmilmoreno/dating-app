import { firebaseConfig } from "./firebase-config";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)

export const db = getFirestore(app)

export const storage = getStorage(app)