import express from "express"; // Import Express framework to define API routes
import { db } from "./config/firebaseAdminConfig.js"; // Use Firestore from centralized Firebase config
import speakeasy from "speakeasy"; // Library for MFA authentication
//import qrcode from "qrcode"; // Library to generate QR codes for MFA setup

// Create an Express Router to handle authentication-related routes
const router = express.Router();

// Ensure Express correctly parses JSON requests
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

/**
 * Generate MFA QR Code & Secret Key
 * ----------------------------------
 * - Generates a unique TOTP secret for each user
 * - Stores the secret in Firestore so it can be used for verification later
 * - Returns a QR code that users can scan to set up MFA in an authenticator app
 */
/*router.get("/generate-qr", async (req, res) => {
    try {
        const { username } = req.query;
        if (!username) return res.status(400).json({ error: "Username is required" });

        const userDoc = await getDoc(doc(db, "users", username));
        const secret = userDoc.data()?.mfaSecret;
        if (!secret) return res.status(400).json({ error: "No MFA secret found" });

        // Generate OTP Auth URL
        const otpauthURL = `otpauth://totp/FantasyForgeStudio:${username}?secret=${secret}&issuer=FantasyForgeStudio`;

        // Convert URL to QR code
        const qrCodeImageUrl = await qrcode.toDataURL(otpauthURL);

        res.json({ qrCode: qrCodeImageUrl });
    } catch (error) {
        console.error("Error generating MFA QR code:", error);
        res.status(500).json({ error: "Failed to generate QR code" });
    }
});*/

router.get("/generate-auth-app-setup", async (req, res) => {
    console.log("Received request for MFA setup:", req.query);

    try {
        const { username } = req.query;
        if (!username) {
            console.error("Username is missing in request");
            return res.status(400).json({ error: "Username is required for MFA setup" });
        }

        const userRef = doc(db, "users", username);
        const userDoc = await userRef.get();
        const userData = userDoc.exists ? userDoc.data() : {};

        if (userData.mfaEnabled) {
            console.log("MFA is already enabled for user:", username);
            return res.status(400).json({ error: "MFA is already enabled" });
        }

        //  Force saving the MFA secret properly
        const secret = speakeasy.generateSecret({ length: 32 });

        await userRef.set({
            ...userData,
            mfaSecret: secret.base32, //  Ensuring MFA secret is stored
            mfaEnabled: true,
            createdAt: new Date().toISOString() // Track creation timestamp
        }, { merge: true });

        console.log(" MFA Secret Generated & Saved for:", username, "| Secret:", secret.base32);

        res.json({ secret: secret.base32 });
    } catch (error) {
        console.error(" Error generating MFA secret:", error);
        res.status(500).json({ error: "Failed to generate MFA secret", details: error.message });
    }
});



/**
 * Verify MFA Token
 * ----------------
 * - Users must provide a valid one-time MFA code before login
 * - This checks the provided token against the stored MFA secret
 */
router.post("/verify-mfa", async (req, res) => {
    const { username, token } = req.body;

    try {
        // Retrieve the user's stored MFA secret from Firestore
        const userDoc = await getDoc(doc(db, "users", username));
        const storedSecret = userDoc.data()?.mfaSecret;

        // If there's no MFA secret stored, return an error
        if (!storedSecret) return res.status(400).json({ error: "No MFA secret found" });

        // Verify the provided MFA token using Speakeasy
        const verified = speakeasy.totp.verify({
            secret: storedSecret.trim(),
            encoding: "base32",
            token,
            window: 3, // Allows for minor time drift
        });

        res.json({ success: verified });
    } catch (error) {
        console.error("Error verifying MFA token:", error);
        res.status(500).json({ error: "MFA verification failed" });
    }
});

/**
 * Login Endpoint
 * --------------
 * - Users must provide a valid username and password
 * - If MFA is enabled, they must also provide a correct MFA token
 */
router.post("/login", async (req, res) => {
    const { username, password, token } = req.body;

    try {
        // Retrieve the user's document from Firestore
        const userDoc = await getDoc(doc(db, "users", username));
        if (!userDoc.exists) return res.status(401).json({ error: "User not found" });

        const user = userDoc.data();

        // Check if the provided password matches the stored password
        if (user.password !== password) return res.status(401).json({ error: "Invalid username or password" });

        // If MFA is enabled, verify the MFA token before allowing login
        if (user.mfaEnabled) {
            const validMFA = speakeasy.totp.verify({
                secret: user.mfaSecret.trim(),
                encoding: "base32",
                token,
                window: 2, // Slight time buffer allowed
            });

            // If MFA verification fails, deny access
            if (!validMFA) return res.status(401).json({ error: "Invalid MFA token" });
        }

        // Login successful
        res.status(200).json({ success: "Login successful" });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ error: "Login failed" });
    }
});

// Export the router so `server.js` can use it
export default router;
