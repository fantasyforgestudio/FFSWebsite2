import { db } from "../config/firebaseAdminConfig.js";
import { doc, getDoc } from "firebase/firestore";
import speakeasy from "speakeasy";

export const generateMFASetup = async (username) => {
    try {
        if (!username) throw new Error("Username is required for MFA setup");

        const userRef = doc(db,"users", username);
        const userDoc = await userRef.get();
        const userData = userDoc.exists ? userDoc.data() : {};

        if (userData.mfaEnabled) throw new Error("MFA is already enabled for this user");

        const secret = speakeasy.generateSecret({ length: 32 });

        await userRef.set(
            {
                ...userData,
                mfaSecret: secret.base32,
                mfaEnabled: true,
                createdAt: new Date().toISOString(),
            },
            { merge: true }
        );

        return { success: true, secret: secret.base32 };
    } catch (error) {
        console.error("Error generating MFA setup:", error);
        throw error;
    }
};

export const verifyMFA = async (username, token) => {
    try {
        const userDoc = await getDoc(doc(db, "users", username)); // Use getDoc instead of db.collection("users").doc(username).get();
        const storedSecret = userDoc.data()?.mfaSecret;

        if (!storedSecret) throw new Error("No MFA secret found");

        const verified = speakeasy.totp.verify({
            secret: storedSecret.trim(),
            encoding: "base32",
            token,
            window: 3,
        });

        return { success: verified };
    } catch (error) {
        console.error("Error verifying MFA token:", error);
        throw error;
    }
};
