import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        const fetchCart = async () => {
            if (!user) {
                setCart([]);
                setLoading(false);
                return;
            }

            try {
                const cartDoc = await getDoc(doc(db, "carts", user.uid));
                if (cartDoc.exists()) {
                    setCart(cartDoc.data().items || []);
                } else {
                    await setDoc(doc(db, "carts", user.uid), { 
                        items: [],
                        createdAt: new Date(),
                        updatedAt: new Date()
                    });
                    setCart([]);
                }
            } catch (err) {
                console.error("Error fetching cart:", err);
                setError("Failed to load cart. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchCart();
    }, [user]);

    const updateCartInFirestore = async (newCart) => {
        if (!user) {
            throw new Error("User must be logged in to update cart");
        }

        try {
            await updateDoc(doc(db, "carts", user.uid), {
                items: newCart,
                updatedAt: new Date()
            });
        } catch (err) {
            console.error("Error updating cart:", err);
            throw new Error("Failed to update cart. Please try again later.");
        }
    };

    const addToCart = async (product) => {
        if (!user) {
            throw new Error("You must be logged in to add items to cart");
        }

        try {
            const existingItem = cart.find(item => item.id === product.id);
            let newCart;

            if (existingItem) {
                newCart = cart.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                newCart = [...cart, { ...product, quantity: 1 }];
            }

            setCart(newCart);
            await updateCartInFirestore(newCart);
        } catch (err) {
            console.error("Error adding to cart:", err);
            throw new Error("Failed to add item to cart. Please try again later.");
        }
    };

    const removeFromCart = async (productId) => {
        if (!user) {
            throw new Error("You must be logged in to remove items from cart");
        }

        try {
            const newCart = cart.filter(item => item.id !== productId);
            setCart(newCart);
            await updateCartInFirestore(newCart);
        } catch (err) {
            console.error("Error removing from cart:", err);
            throw new Error("Failed to remove item from cart. Please try again later.");
        }
    };

    const updateQuantity = async (productId, quantity) => {
        if (!user) {
            throw new Error("You must be logged in to update cart quantities");
        }

        if (quantity < 1) {
            throw new Error("Quantity must be at least 1");
        }

        try {
            const newCart = cart.map(item =>
                item.id === productId
                    ? { ...item, quantity }
                    : item
            );
            setCart(newCart);
            await updateCartInFirestore(newCart);
        } catch (err) {
            console.error("Error updating quantity:", err);
            throw new Error("Failed to update item quantity. Please try again later.");
        }
    };

    const clearCart = async () => {
        if (!user) {
            throw new Error("You must be logged in to clear cart");
        }

        try {
            setCart([]);
            await updateCartInFirestore([]);
        } catch (err) {
            console.error("Error clearing cart:", err);
            throw new Error("Failed to clear cart. Please try again later.");
        }
    };

    const value = {
        cart,
        loading,
        error,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}; 