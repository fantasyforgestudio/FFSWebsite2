import express from "express";
import { db } from "../config/firebaseAdminConfig.js";
import {getDoc, doc } from "firebase/firestore";
import speakeasy from "speakeasy";

const router = express.Router();

// Ensure Express parses JSON correctly
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

/**
 * Login Endpoint
 * --------------
 * - Users must provide a valid username and password
 * - If MFA is enabled, they must also provide a correct MFA token
 */
router.post("/login", async (req, res) => {
    const { username, password, token } = req.body;

    try {
        // Retrieve user document from Firestore
        const userDoc = await getDoc(doc(db, "users", username)); //db.collection("users").doc(username).get();
        if (!userDoc.exists) return res.status(401).json({ error: "User not found" });

        const user = userDoc.data();

        // Validate password
        if (user.password !== password) return res.status(401).json({ error: "Invalid username or password" });

        // If MFA is enabled, verify the MFA token before allowing login
        if (user.mfaEnabled) {
            const validMFA = speakeasy.totp.verify({
                secret: user.mfaSecret.trim(),
                encoding: "base32",
                token,
                window: 2, // Slight time buffer allowed
            });

            if (!validMFA) return res.status(401).json({ error: "Invalid MFA token" });
        }

        res.status(200).json({ success: "Login successful" });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ error: "Login failed" });
    }
});

export default router;
