// Import necessary libraries
import speakeasy from "speakeasy"; // Generates and verifies TOTP-based authentication codes
import qrcode from "qrcode"; // Creates QR codes for MFA setup

/**
 * Generate MFA Setup Data
 * - Creates a unique secret key
 * - Formats it correctly for QR authentication
 * - Returns a QR code image URL and the Base32 secret
 */
export const generateMFASetup = async () => {
    try {
        // Generate a new 20-byte secret key
        const secret = speakeasy.generateSecret({ length: 20 });

        // Construct the otpauth URL for authentication apps
        const otpauthURL = `otpauth://totp/FantasyForgeStudio:rwhittaker5150?secret=${secret.base32}&issuer=FantasyForgeStudio`;

        // Generate the QR code image from the otpauth URL
        const qrCodeData = await qrcode.toDataURL(otpauthURL);

        console.log(" Secret Key:", secret.base32);
        console.log(" OTP URL:", otpauthURL);
        console.log(" QR Code Generated");

        // Return the generated QR code and secret key for user setup
        return { qrCode: qrCodeData, secret: secret.base32 };
    } catch (error) {
        console.error(" MFA QR Code Generation Failed:", error);
        throw new Error("MFA setup failed");
    }
};

/**
 * Verify the MFA Token
 * - Checks if the user's provided token is valid
 * - Uses the previously generated secret key to match the TOTP
 */
export const verifyMFAToken = (token, secret) => {
    // Debugging logs to check received input
    console.log(" Received Token:", token);
    console.log(" Received Secret:", secret);

    // Verify the user's token using the stored secret key
    const verified = speakeasy.totp.verify({
        secret: secret.trim(), // Ensure no unwanted whitespace
        encoding: "base32", // Speakeasy expects Base32 encoding for secrets
        token,
        window: 2 // Adjust time window for minor clock differences
    });

    console.log(" MFA Verification Result:", verified);
    return verified;
};
