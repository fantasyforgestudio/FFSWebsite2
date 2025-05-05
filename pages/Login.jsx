import React, { useState } from "react";
import { auth, db } from "../firebase/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/login.css";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSignUp, setIsSignUp] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();

    const storeUserData = async (user) => {
        try {
            await setDoc(doc(db, "users", user.uid), {
                email: user.email,
                username: user.email.split("@")[0],
                createdAt: new Date(),
                lastLogin: new Date(),
                role: "user"
            });
            console.log("New user stored in Firestore.");
        } catch (error) {
            console.error("Firestore write failed:", error);
            throw new Error("Failed to create user profile");
        }
    };

    const handleAuth = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            let userCredential;

            if (isSignUp) {
                userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                await storeUserData(user);
            } else {
                userCredential = await signInWithEmailAndPassword(auth, email, password);
            }

            console.log("Authentication successful.");
            setEmail("");
            setPassword("");
            navigate("/home");
        } catch (err) {
            let errorMessage = "Authentication failed. Please try again.";
            if (err.code === "auth/email-already-in-use") {
                errorMessage = "This email is already registered. Please log in instead.";
            } else if (err.code === "auth/invalid-email") {
                errorMessage = "Please enter a valid email address.";
            } else if (err.code === "auth/weak-password") {
                errorMessage = "Password should be at least 6 characters long.";
            } else if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
                errorMessage = "Invalid email or password.";
            }
            setError(errorMessage);
            console.error("Authentication error:", err);
        } finally {
            setLoading(false);
        }
    };

    if (user) {
        navigate("/profile");
        return null;
    }

    return (
        <div className="login-container">
            <h2>{isSignUp ? "Sign Up" : "Log In"}</h2>
            <form onSubmit={handleAuth}>
                <input 
                    type="email" 
                    placeholder="Email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    disabled={loading}
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    disabled={loading}
                />
                <button type="submit" disabled={loading}>
                    {loading ? "Processing..." : (isSignUp ? "Sign Up" : "Log In")}
                </button>
            </form>
            {error && <p className="error-message">{error}</p>}
            <button 
                onClick={() => setIsSignUp(!isSignUp)} 
                disabled={loading}
                className="toggle-auth"
            >
                {isSignUp ? "Already have an account? Log In" : "Need an account? Sign Up"}
            </button>
        </div>
    );
};

export default Login;
