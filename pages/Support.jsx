import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebase"; // Ensure Firebase is configured
import { collection, addDoc, getDocs } from "@firebase/firestore";
import "../styles/support.css";

const Support = () => {
    const [messages, setMessages] = useState([]);

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = {
            name: event.target.name.value,
            email: event.target.email.value,
            subject: event.target.subject.value,
            message: event.target.message.value,
            timestamp: new Date(), // Tracks submission time
        };

        try {
            await addDoc(collection(db, "supportMessages"), formData);
            alert("Your message has been sent! I'll get back to you soon.");
        } catch (error) {
            console.error("Error sending message:", error);
            alert("Failed to send message. Please try again later.");
        }
    };

    // Retrieve stored messages
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "supportMessages"));
                const retrievedMessages = querySnapshot.docs.map((doc) => doc.data());
                setMessages(retrievedMessages);
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };

        fetchMessages();
    }, []);

    return (
        <div className="support-container">
            <section className="support-hero">
                <h1>Support Center</h1>
                <p>We're here to help you with any questions or issues</p>
            </section>

            <section className="support-content">
                <div className="support-section">
                    <h2>Frequently Asked Questions</h2>
                    <div className="faq-list">
                        <div className="faq-item">
                            <h3>How do I download my purchased assets?</h3>
                            <p>
                                After completing your purchase, you'll receive an email with download links.
                                You can also access your downloads from your profile page under "My Purchases".
                            </p>
                        </div>
                        <div className="faq-item">
                            <h3>What payment methods do you accept?</h3>
                            <p>
                                We accept all major credit cards, PayPal, and other secure payment methods.
                                All transactions are processed through our secure payment gateway.
                            </p>
                        </div>
                        <div className="faq-item">
                            <h3>Can I get a refund for my purchase?</h3>
                            <p>
                                We offer refunds within 14 days of purchase if you're not satisfied with your purchase.
                                Please contact our support team for assistance.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="support-section">
                    <h2>Contact Us</h2>
                    <div className="contact-form">
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="name">Name</label>
                                <input type="text" id="name" placeholder="Your name" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input type="email" id="email" placeholder="Your email" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="subject">Subject</label>
                                <input type="text" id="subject" placeholder="Subject" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="message">Message</label>
                                <textarea id="message" placeholder="Your message" rows="5"></textarea>
                            </div>
                            <button type="submit" className="submit-button">Send Message</button>
                        </form>
                    </div>
                </div>

                {/* Display stored messages */}
                <div className="support-section">
                    <h2>Recent Messages</h2>
                    <ul>
                        {messages.map((msg, index) => (
                            <li key={index}>
                                <strong>{msg.name}</strong>: {msg.subject} - {msg.message}
                            </li>
                        ))}
                    </ul>
                </div>
            </section>
        </div>
    );
};

export default Support;
