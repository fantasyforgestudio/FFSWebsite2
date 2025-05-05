import React, { useState } from "react";

const ProfileInfo = ({ user }) => {
    const [isOpen, setIsOpen] = useState(true); //  Profile section starts open by default

    if (!user) {
        return <p>Loading profile...</p>;
    }

    return (
        <section className="profile-section">
            <h2 onClick={() => setIsOpen(!isOpen)}>Profile Information</h2>
            {isOpen && (
                <div className="section-content">
                    <img src={user.profilePicture || "/default-avatar.png"} alt="Profile" className="profile-avatar" />
                    <h2>{user.username || "Unknown User"}</h2>
                    <p>Email: {user.email || "Not provided"}</p>
                    <button className="logout-button">Logout</button> {/*  Logout moved to Profile Section */}
                </div>
            )}
        </section>
    );
};

export default ProfileInfo;
