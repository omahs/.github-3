import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getPerformance } from "firebase/performance";

const firebaseConfig = {
    apiKey: "AIzaSyCY9lI-qta88G-HfNmTtSSevSlzo2Mnb7Y",
    authDomain: "jewel-6b5c6.firebaseapp.com",
    projectId: "jewel-6b5c6",
    storageBucket: "jewel-6b5c6.appspot.com",
    messagingSenderId: "646269657574",
    appId: "1:646269657574:web:89f12ab9eea42dd7d6b627",
    measurementId: "G-4JZ5WSGG54"
};

const app = initializeApp(firebaseConfig);
getAnalytics(app);
getPerformance(app);
export const auth = getAuth(app);