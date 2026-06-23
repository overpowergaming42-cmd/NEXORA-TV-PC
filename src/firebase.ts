import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAEEk8vw8QZElb9Nc9PJ2x3FrMrYTqzCx4",
    authDomain: "nexora-tv-6cf6c.firebaseapp.com",
    projectId: "nexora-tv-6cf6c",
    storageBucket: "nexora-tv-6cf6c.firebasestorage.app",
    messagingSenderId: "1013726917178",
    appId: "1:1013726917178:web:7b91d3c5e4f021d03b7b03",
    measurementId: "G-9P23RD578N"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export const db = firebase.firestore();

export const trackVisit = async () => {
    if (!sessionStorage.getItem("nexora_visited_today")) {
        const todayStr = new Date().toDateString();
        const statsRef = db.collection("nexora_stats").doc("visits");
        
        try {
            await db.runTransaction(async (transaction) => {
                const sfDoc = await transaction.get(statsRef);
                if (!sfDoc.exists) {
                    transaction.set(statsRef, { total: 1, daily: { [todayStr]: 1 } });
                } else {
                    const data = sfDoc.data() || {};
                    const dailyObj = data.daily || {};
                    dailyObj[todayStr] = (dailyObj[todayStr] || 0) + 1;
                    transaction.update(statsRef, { 
                        total: firebase.firestore.FieldValue.increment(1), 
                        daily: dailyObj 
                    });
                }
            });
            sessionStorage.setItem("nexora_visited_today", "true");
        } catch (err) {
            console.log("Visit tracking failed:", err);
        }
    }
};
