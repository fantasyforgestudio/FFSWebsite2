import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import "./styles/App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Support from "./pages/Support";
import Store from "./pages/Store";
import Checkout from "./components/Checkout";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermOfService from "./pages/TermOfService";

const App = () => {
    return (
        <AuthProvider>
            <CartProvider>
                <div className="app">
                    <Navbar />
                    <main className="main-content">
                        <Routes> {/* No extra Router */}
                            <Route path="/" element={<Navigate to="/home" replace />} />
                            <Route path="/home" element={<Home />} />
                            <Route path="/store" element={<Store />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/checkout" element={<Checkout />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/support" element={<Support />} />
                            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                            <Route path="/terms-of-service" element={<TermOfService />} />
                            <Route path="*" element={<Navigate to="/home" replace />} />
                        </Routes>
                    </main>
                    <Footer />
                </div>
            </CartProvider>
        </AuthProvider>
    );
};

export default App;
