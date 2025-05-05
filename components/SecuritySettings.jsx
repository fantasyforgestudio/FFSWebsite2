import React, { useState } from "react";
import MFA from "../components/MFA";

const SecuritySettings = ({ user }) => {
    const [mfaEnabled, setMfaEnabled] = useState(user?.mfaEnabled || false);

    return (
        <section>
            <h2>Security & Account Settings</h2>
            <p><strong>Password:</strong> ********</p>
            <MFA user={user} />
        </section>
    );
};

export default SecuritySettings;
