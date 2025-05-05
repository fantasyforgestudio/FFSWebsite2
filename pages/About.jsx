import React from "react";
import "../styles/about.css";

const About = () => {
    return (
        <div className="about-container">
            <section className="about-hero">
                <h1>About FantasyForge Studio</h1>
                <p>Welcome to FantasyForge Studio, a creative space dedicated to crafting digital experiences with passion and innovation. Founded in 2025, FantasyForge Studio is a solo endeavor where I blend technology and storytelling to create unique assets, games, and interactive projects.</p>
            </section>

            <section className="about-content">
                <div className="about-section">
                    <h2>Our Story</h2>
                    <p>
                        FantasyForge Studio is a one-person journey that's driven by curiosity, problem-solving, and a love for digital creativity. While I'm not an industry professional, I constantly refine my skills in game design, storytelling, and asset creation to bring unique projects to life.
                    </p>
                </div>

                <div className="about-section">
                    <h2>My Mission</h2>
                    <p>
                        FantasyForge Studio is built on the values of inclusivity, accessibility, and creativity. I believe in ensuring that every creator, whether experienced or just starting out, can bring their vision to life. My goal is to make engaging digital content that is fun, accessible, and inspiring.
                    </p>
                </div>

                <div className="about-section">
                    <h2>Explore My Work</h2>
                    <p>
                        Check out the latest assets, ideas, and creations in the FantasyForge Studio's Store. Your destination for creative projects built with passion.
                    </p>
                </div>
            </section>

            <section className="cta-section">
                <h2>Join the Journey</h2>
                <p>FantasyForge Studio is evolving, and I welcome feedback, collaboration, and creative discussions. Whether you're exploring my work or just stopping by, I'm excited to share the process with you!</p>
                <a href="/store" className="cta-button">Explore Our Store</a>
            </section>
        </div>
    );
};

export default About;
