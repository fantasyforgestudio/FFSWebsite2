import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase/firebase";
import { doc, updateDoc } from "firebase/firestore";
import "../styles/checkout.css";

const Checkout = () => {
    const { cart, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [paymentInfo, setPaymentInfo] = useState({
        cardNumber: "",
        expiryDate: "",
        cvv: "",
        cardholderName: ""
    });

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const validatePaymentInfo = () => {
        if (!paymentInfo.cardNumber.match(/^\d{16}$/)) {
            return "Please enter a valid 16-digit card number";
        }
        if (!paymentInfo.expiryDate.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) {
            return "Please enter a valid expiry date (MM/YY)";
        }
        if (!paymentInfo.cvv.match(/^\d{3,4}$/)) {
            return "Please enter a valid CVV";
        }
        if (paymentInfo.cardholderName.trim().length < 3) {
            return "Please enter the cardholder's name";
        }
        return null;
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            if (!user) {
                throw new Error("You must be logged in to complete the purchase");
            }

            const validationError = validatePaymentInfo();
            if (validationError) {
                throw new Error(validationError);
            }

            // Simulate payment processing
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Clear the cart in Firestore
            await updateDoc(doc(db, "carts", user.uid), {
                items: [],
                lastPurchase: new Date()
            });

            // Clear the local cart
            clearCart();

            // Navigate to success page or home
            navigate("/home");
        } catch (err) {
            console.error("Payment error:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        navigate("/login");
        return null;
    }

    if (cart.length === 0) {
        return (
            <div className="checkout-container">
                <h2>Your cart is empty</h2>
                <button onClick={() => navigate("/store")} className="continue-shopping">
                    Continue Shopping
                </button>
            </div>
        );
    }

    return (
        <div className="checkout-container">
            <h2>Checkout</h2>
            
            <div className="cart-items">
                {cart.map(item => (
                    <div key={item.id} className="cart-item">
                        <img src={item.image} alt={item.name} />
                        <div className="item-details">
                            <h3>{item.name}</h3>
                            <p>Quantity: {item.quantity}</p>
                            <p>Price: ${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="checkout-summary">
                <h3>Order Summary</h3>
                <div className="summary-item">
                    <span>Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                </div>
                <div className="summary-item">
                    <span>Shipping</span>
                    <span>Free</span>
                </div>
                <div className="summary-item total">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                </div>
            </div>

            <form onSubmit={handlePayment} className="payment-form">
                <h3>Payment Information</h3>
                {error && <p className="error-message">{error}</p>}
                
                <div className="form-group">
                    <label htmlFor="cardNumber">Card Number</label>
                    <input
                        type="text"
                        id="cardNumber"
                        value={paymentInfo.cardNumber}
                        onChange={(e) => setPaymentInfo({ ...paymentInfo, cardNumber: e.target.value.replace(/\D/g, '') })}
                        maxLength={16}
                        required
                        disabled={loading}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="expiryDate">Expiry Date (MM/YY)</label>
                    <input
                        type="text"
                        id="expiryDate"
                        value={paymentInfo.expiryDate}
                        onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            if (value.length <= 4) {
                                const formatted = value.replace(/(\d{2})(\d{0,2})/, '$1/$2');
                                setPaymentInfo({ ...paymentInfo, expiryDate: formatted });
                            }
                        }}
                        maxLength={5}
                        required
                        disabled={loading}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="cvv">CVV</label>
                    <input
                        type="text"
                        id="cvv"
                        value={paymentInfo.cvv}
                        onChange={(e) => setPaymentInfo({ ...paymentInfo, cvv: e.target.value.replace(/\D/g, '') })}
                        maxLength={4}
                        required
                        disabled={loading}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="cardholderName">Cardholder Name</label>
                    <input
                        type="text"
                        id="cardholderName"
                        value={paymentInfo.cardholderName}
                        onChange={(e) => setPaymentInfo({ ...paymentInfo, cardholderName: e.target.value })}
                        required
                        disabled={loading}
                    />
                </div>

                <button type="submit" disabled={loading} className="pay-button">
                    {loading ? "Processing..." : `Pay $${total.toFixed(2)}`}
                </button>
            </form>
        </div>
    );
};

export default Checkout;
