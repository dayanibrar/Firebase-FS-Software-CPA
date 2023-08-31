import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
 
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyClnKo2akSMkgduH_6aJcu3AOYauIrolYs",
  authDomain: "fir-authenticationone.firebaseapp.com",
  projectId: "fir-authenticationone",
  storageBucket: "fir-authenticationone.appspot.com",
  messagingSenderId: "30363426656",
  appId: "1:30363426656:web:67eb64de8e07ebd0bd4805",
  measurementId: "G-KX63MYED04"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
 
// configure database and the authentication package
export const database = getFirestore(app);
export const auth = getAuth(app);



