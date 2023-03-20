import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getPerformance } from "firebase/performance";

const firebaseConfig = {
    apiKey: "AIzaSyA-Dn62_MuHbc45yzak4S9ao3NXHw07HkY",
    authDomain: "jewl-app.firebaseapp.com",
    projectId: "jewl-app",
    storageBucket: "jewl-app.appspot.com",
    messagingSenderId: "550370238764",
    appId: "1:550370238764:web:fa3937801fc783c7264c89",
    measurementId: "G-FNCKMNE7CB"
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const performance = getPerformance(app);
