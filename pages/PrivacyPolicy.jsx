import React from "react";
import "../styles/privacy.css";

const PrivacyPolicy = () => {
    return (
        <div className="privacy-container">
            <h1>Privacy Policy</h1>
            <p>
                Your privacy is important to us. This policy outlines how FantasyForge Studio collects, uses, and protects your personal information.
            </p>

            <h2>Information We Collect</h2>
            <p>
                We collect information that helps us improve our services, including:
                - Contact details (such as email addresses for support inquiries)
                - User interactions (analytics to enhance user experience)
                - Optional account information (if applicable)
            </p>

            <h2>How We Use Your Information</h2>
            <p>
                We use collected data to:
                - Provide support and respond to inquiries
                - Improve our services through analytics
                - Ensure account security and prevent fraud
            </p>

            <h2>Third-Party Services</h2>
            <p>
                We may use trusted third-party services to process payments, host content, or analyze user behavior. These services follow strict privacy regulations.
            </p>

            <h2>Your Rights</h2>
            <p>
                You have the right to request access, correction, or deletion of your personal information. Contact us at <a href="mailto:fantasyforgestudio@zohomail.com">fantasyforgestudio@zohomail.com</a> to make a request.
            </p>

            <h2>Policy Updates</h2>
            <p>
                We may update this Privacy Policy as needed. Significant changes will be communicated through our website.
            </p>

            <footer>
                <p>&copy; 2025 FantasyForge Studio. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default PrivacyPolicy;
