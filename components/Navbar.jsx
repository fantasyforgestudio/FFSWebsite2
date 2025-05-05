import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { auth } from "../firebase/firebase";
import { signOut } from "firebase/auth";
import "../styles/navbar.css";
import logo from "../assets/logo.png";

const Navbar = () => {
    const { user } = useAuth();
    const { cart } = useCart();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate("/login");
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    const cartItemCount = cart?.reduce((total, item) => total + item.quantity, 0) || 0;

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/home">
                    <img src={logo} alt="FantasyForge Logo" className="logo" />
                    <span style={{ marginLeft: "0.5rem", color: "#FFFA500", fontWeight: "bold", fontSize: "1.3rem" }}>
                        FantasyForge
                    </span>
                </Link>
            </div>
            <div className="navbar-links">
                <Link to="/home">Home</Link>
                <Link to="/store">Store</Link>
                <Link to="/support">Support</Link>
                <Link to="/about">About</Link>
                {user ? (
                    <>
                        <Link to="/profile">Profile</Link>
                        <div className="cart-icon">
                            <Link to="/checkout">
                                <span className="cart-count">{cartItemCount}</span>
                                <svg viewBox="0 0 24 24" width="24" height="24">
                                    <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
                                </svg>
                            </Link>
                        </div>
                        <button onClick={handleLogout} className="logout-button">
                            Logout
                        </button>
                    </>
                ) : (
                    <Link to="/login">Login</Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
