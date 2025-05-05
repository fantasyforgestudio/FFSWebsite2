import React, { useState } from "react";

const MFASetup = ({ username }) => {
    const [secret, setSecret] = useState("");
    const [error, setError] = useState("");

    const enableMFA = async () => {
        try {
            const response = await fetch(`http://localhost:3000/generate-auth-app-setup?username=${username}`);
            const data = await response.json();
            if (data.secret) {
                setSecret(data.secret);
            } else {
                setError("Failed to generate MFA secret.");
            }
        } catch (err) {
            setError("Error enabling MFA. Please try again.");
        }
    };

    return (
        <div>
            <h2>Enable MFA</h2>
            <button onClick={enableMFA}>Generate MFA Secret</button>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {secret && (
                <div>
                    <p>Enter this key in your authenticator app:</p>
                    <strong>{secret}</strong>
                </div>
            )}
        </div>
    );
};

export default MFASetup;
