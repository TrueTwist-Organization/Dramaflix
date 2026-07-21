import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBX2QSQhcwW03JWpC7i8lUcPg2AOPr6_Do",
  authDomain: "dramaflix-c052e.firebaseapp.com",
  projectId: "dramaflix-c052e",
  storageBucket: "dramaflix-c052e.firebasestorage.app",
  messagingSenderId: "301719014892",
  appId: "1:301719014892:web:38c5f04c49f5f47d5c04c9",
  measurementId: "G-TD503J5RG1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function deleteDarkerShades() {
  console.log("Starting deletion...");
  try {
    // 1. Delete the series
    const seriesRef = doc(db, "series", "series-darker-shades");
    await deleteDoc(seriesRef);
    console.log("Deleted series document.");

    // 2. Delete all videos belonging to this series
    const videosRef = collection(db, "videos");
    const q = query(videosRef, where("series_id", "==", "series-darker-shades"));
    const snapshot = await getDocs(q);
    
    let deletedCount = 0;
    const deletePromises = snapshot.docs.map(videoDoc => {
      deletedCount++;
      return deleteDoc(videoDoc.ref);
    });

    await Promise.all(deletePromises);
    console.log(`Deleted ${deletedCount} video documents.`);
    
    console.log("Deletion complete!");
    process.exit(0);
  } catch (error) {
    console.error("Error deleting from Firestore:", error);
    process.exit(1);
  }
}

deleteDarkerShades();
