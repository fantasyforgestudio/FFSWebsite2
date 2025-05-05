import express from "express";
import { db } from "../config/firebaseAdminConfig.js";
import { query, collection, getDocs, limit } from "firebase/firestore";


const router = express.Router();

router.get("/test-firestore", async (req, res) => {
    try {
        const q = query(collection(db, "users"), limit(1));
        const snapshot = await getDocs(q);
        res.json({
            message: "Firestore connection successful",
            foundUsers: snapshot.size,
        });
    } catch (error) {
        console.error("Firestore connection failed:", error);
        res.status(500).json({ error: "Firestore connection failed ", details: error.message });
    }
});

export default router;
