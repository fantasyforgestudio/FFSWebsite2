import React from "react";

const LogoutButton = () => {
    const handleLogout = () => {
        console.log("User logged out");
    };

    return (
        <section>
            <h2>Account Options</h2>
            <button onClick={handleLogout}>Logout</button>
        </section>
    );
};

export default LogoutButton;
