import React, { useState } from "react";

const MFAVerify = ({ username, onVerify }) => {
    const [token, setToken] = useState("");
    const [error, setError] = useState(null);

    const verifyMFA = async () => {
        try {
            const response = await fetch("http://localhost:3000/verify-mfa", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, token }),
            });
            const data = await response.json();
            if (data.success) {
                onVerify(true);
            } else {
                setError("Invalid MFA token. Try again.");
            }
        } catch (err) {
            setError("Error verifying MFA.");
        }
    };

    return (
        <div>
            <h2>Verify MFA</h2>
            <input type="text" value={token} onChange={(e) => setToken(e.target.value)} placeholder="Enter MFA code" />
            <button onClick={verifyMFA}>Verify</button>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
};

export default MFAVerify;
