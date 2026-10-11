import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: "AIzaSyDFIKYX86Hk51atimqimNwMMXB7ha6Lb0A",
  authDomain: "loja-do-poeirao.firebaseapp.com",
  projectId: "loja-do-poeirao",
  storageBucket: "loja-do-poeirao.firebasestorage.app",
  messagingSenderId: "757844422659",
  appId: "1:757844422659:web:73f2658b2ddcea1c525e36",
  measurementId: "G-8TCDWW69NN"
};

// Initialize Firebase App singleton
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Cloud Firestore
export const db = getFirestore(app);

// Target Collection and Document for dynamic content
export const CONTENT_COLLECTION = 'conteudo';
export const CONTENT_DOC_ID = '9FiYJYD9FENDXNNfQ7Z0';
export const CONTENT_FIELD = 'texto';
