import React, { useState, useEffect } from "react";
import "../styles/mfa.css"; // Ensure the CSS file is in your styles folder

const MFA = ({ user }) => {
    // Local state for managing MFA flow and status
    const [mfaEnabled, setMfaEnabled] = useState(false);
    const [currentFlow, setCurrentFlow] = useState(""); // "", "qr", "authApp", "email"
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    //const [qrCodeUrl, setQrCodeUrl] = useState(""); // Holds QR code image URL
    const [verificationCode, setVerificationCode] = useState(""); // User-entered code
    const [showModal, setShowModal] = useState(false); // Modal visibility state
    const [waitingForConfirmation, setWaitingForConfirmation] = useState(false); // Shows waiting confirmation state
    

    useEffect(() => {
        if (user) {
            console.log(" MFA Component: User data loaded:", user);
        } else {
            console.error(" MFA Component: No user data received!");
        }
    }, []); // Log user data when component mounts or updates

    // ----- QR Code MFA Setup -----
    /*const setupQRMFA = async () => {
        if (!user) {  // Use `user` instead of `currentUser`
            console.error(" Error: user is undefined!");
            setError("User data not loaded. Please try again.");
            return;
        }

        console.log("Current user:", user);  // Log the user object

        setLoading(true);
        setError("");
        setCurrentFlow("qr");
        setShowModal(true); // Show the modal

        try {
            const response = await fetch(`http://localhost:3000/generate-qr?username=${user.uid}`, {
                method: "GET",
            });

            if (!response.ok) {
                throw new Error("Failed to generate QR code");
            }

            const data = await response.json();
            setQrCodeUrl(data.qrCode);
        } catch (err) {
            setError("Failed to generate QR code. Please try again.");
            console.error("QR Code Generation Failed:", err);
        }
        setLoading(false);
    };*/

    const setupAuthAppMFA = async () => {
        setLoading(true);
        setError("");
        setCurrentFlow("authApp");

        try {
            const response = await fetch('http://localhost:3000/generate-auth-app-setup', {
                method: "GET",
            });
            if (!response.ok) {
                throw new Error("Failed to generate authenticator setup");
            }
            const data = await response.json();
            // Expecting data.secret for manual entry instead of a QR code
            setSecretKey(data.secret);
        } catch (err) {
            setError("Failed to generate authenticator setup. Please try again.");
        }
        setLoading(false);
    };

    const verifyAuthAppMFA = async () => {
        setWaitingForConfirmation(true);
        setError(""); // Clear previous errors

        try {
            const response = await fetch("http://localhost:3000/verify-mfa", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: user.uid, token: verificationCode.trim() }),
            });

            const data = await response.json();

            if (data.success) {
                setMfaEnabled(true);
                alert("Authenticator App MFA setup successful!");
            } else {
                setError("Invalid verification code. Please try again.");
            }
        } catch (err) {
            setError("Verification failed. Please check your connection and try again.");
            console.error("MFA Verification Error:", err);
        }

        setWaitingForConfirmation(false);
    };


    /*const verifyQRMFA = async () => {
        setWaitingForConfirmation(true);

        try {
            const response = await fetch("http://localhost:3000/verify-mfa", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: user.uid, token: verificationCode.trim() }),
            });

            const { success } = await response.json();

            if (success) {
                setMfaEnabled(true);
                alert("QR Code MFA setup successful!");
            } else {
                setError("Invalid verification code. Please try again.");
            }
        } catch (err) {
            setError("Verification failed. Please try again.");
        }

        setWaitingForConfirmation(false);
    };*/


    // ----- Email MFA Setup -----
    const setupEmailMFA = async () => {
        setLoading(true);
        setError("");
        setCurrentFlow("email");

        try {
            const response = await fetch("http://localhost:3000/setup-email-mfa", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userEmail: user.email }),
            });
            if (!response.ok) {
                throw new Error("Failed to send email code");
            }
            alert("A verification code has been sent to your email.");
        } catch (err) {
            setError("Failed to set up email MFA. Please try again.");
        }
        setLoading(false);
    };

    const verifyEmailMFA = async () => {
        // For demonstration, simulate the correct code with "111111".
        if (verificationCode.trim() === "111111") {
            setMfaEnabled(true);
            setError("");
            alert("Email MFA setup successful!");
            setCurrentFlow("");
            setVerificationCode("");
        } else {
            setError("Invalid code. Please try again.");
        }
    };

    return (
        <div className="mfa-settings">
            <h2>MFA Settings</h2>

            {!currentFlow && (
                <div className="mfa-buttons">
                    {/* <button onClick={setupQRMFA}>Set Up QR Code MFA</button> */}
                    <button onClick={setupAuthAppMFA}>Set Up Auth App MFA</button>
                    <button onClick={setupEmailMFA}>Set Up Email MFA</button>
                </div>
            )}

            {loading && <p className="mfa-loading">Loading...</p>}
            {error && <p className="mfa-error">{error}</p>}

            {/* Modal for QR Code Display (only one input field for verification) */}
            {showModal && (
                <div className="mfa-modal">
                    <div className="mfa-modal-content">
                        <h2>Scan this QR Code</h2>
                        {qrCodeUrl && <img src={qrCodeUrl} alt="MFA QR Code" className="mfa-qr-code" />}
                        <input
                            type="text"
                            placeholder="Enter verification code"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                        />
                        {waitingForConfirmation ? (
                            <p className="mfa-waiting">Waiting for confirmation...</p>
                        ) : (
                            <button onClick={verifyQRMFA}>Verify Code</button>
                        )}
                    </div>
                </div>
            )}

            {/* No additional input fields needed outside the modal */}
            {currentFlow === "authApp" && (
                <div className="mfa-flow">
                    <p>Enter the code from your authentication app:</p>
                    <input
                        type="text"
                        placeholder="Enter the code"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                    />
                    <button onClick={verifyAuthAppMFA}>Verify Code</button>
                </div>
            )}

            {currentFlow === "email" && (
                <div className="mfa-flow">
                    <p>Please check your email for a verification code.</p>
                    <input
                        type="text"
                        placeholder="Enter the verification code"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                    />
                    <button onClick={verifyEmailMFA}>Verify Code</button>
                </div>
            )}

            {mfaEnabled && <p className="mfa-success">MFA is enabled for your account.</p>}
        </div>
    );
};
export default MFA;