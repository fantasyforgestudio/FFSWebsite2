/* ChangePassword.jsx
    This file exports a ChangePassword component where the user can change their password.
    It includes input fields for the current password, new password, and confirmation of the new password.
    Validation is done to ensure that the fields are filled and that the new passwords match.
    On submission, it simulates an API call (which you can later replace with your actual API integration). 
*/

import React, { useState } from "react";
import "../styles/changePassword.css"; // Ensure the CSS file is correctly placed and imported

const ChangePassword = () => {
    // State for holding input field values, error messages and success messages.
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Handles the form submission event
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        // Simple validation checks
        if (!currentPassword || !newPassword || !confirmPassword) {
            setError("Please fill out all fields.");
            return;
        }
        if (newPassword !== confirmPassword) {
            setError("New passwords do not match.");
            return;
        }
        // Additional password complexity requirements can be added here
        if (newPassword.length < 6) {
            setError("Password should be at least 6 characters long.");
            return;
        }

        // Simulate an async API call to change the password
        setLoading(true);
        try {
            // Replace this with your actual API call logic
            await new Promise((resolve) => setTimeout(resolve, 2000));
            setSuccess("Password changed successfully!");
            // Reset the fields after success
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err) {
            setError("Failed to change password. Please try again.");
        }
        setLoading(false);
    };

    return (
        <div className="change-password-container">
            {/* Header for the Change Password section */}
            <h2>Change Password</h2>
            <form className="change-password-form" onSubmit={handleSubmit}>
                {/* Current Password Field */}
                <label htmlFor="current-password">Current Password</label>
                <input
                    type="password"
                    id="current-password"
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                />

                {/* New Password Field */}
                <label htmlFor="new-password">New Password</label>
                <input
                    type="password"
                    id="new-password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />

                {/* Confirm New Password Field */}
                <label htmlFor="confirm-password">Confirm New Password</label>
                <input
                    type="password"
                    id="confirm-password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />

                {/* Conditional rendering of error or success messages */}
                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}

                {/* Submit button disables itself during the async operation */}
                <button type="submit" disabled={loading}>
                    {loading ? "Changing..." : "Change Password"}
                </button>
            </form>
        </div>
    );
};

export default ChangePassword;
