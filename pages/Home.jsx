import React from "react";
import { Link } from "react-router-dom";
import "../styles/home.css";

const Home = () => {
    return (
        <div className="home-container">
            {/* Hero Section */}
            <section className="hero-section">
                <h1>Welcome to FantasyForge Studio</h1>
                <p>Your one-stop shop for all things creative!</p>
                <div className="cta-buttons">
                    <Link to="/store" className="cta-button primary">Get Started</Link>
                    <Link to="/about" className="cta-button secondary">Learn More</Link>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <h2>Why Choose FantasyForge?</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <h3>High-Quality Assets</h3>
                        <p>Handcrafted digital assets, made with passion and creativity.</p>
                    </div>
                    <div className="feature-card">
                        <h3>Secure Platform</h3>
                        <p>Advanced security features including MFA protection</p>
                    </div>
                    <div className="feature-card">
                        <h3>FantasyForge Studio Support</h3>
                        <p>"Handled personally, so you get direct and helpful responses!"</p>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="cta-section">
                <h2>Ready to Get Started?</h2>
                <p className="cta-section">Sign up now and unlock a world of creativity!</p>
                <Link to="/login" className="cta-button primary">Sign Up Now</Link>
            </section>
        </div>
    );
};

export default Home;
