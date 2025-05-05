import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import { useCart } from "../context/CartContext";
import "../styles/store.css";

const Store = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                console.log("Attempting to fetch products...");
                const productsCollection = collection(db, "products");
                console.log("Products collection reference created");
                
                const productsSnapshot = await getDocs(productsCollection);
                console.log("Products snapshot received:", productsSnapshot.size, "documents");
                
                if (productsSnapshot.empty) {
                    console.log("No products found, creating sample products...");
                    // Add sample products if none exist
                    const sampleProducts = [
                        {
                            id: "1",
                            name: "Fantasy Castle",
                            description: "A majestic castle for your fantasy world",
                            price: 29.99,
                            category: "buildings",
                            image: "https://via.placeholder.com/300"
                        },
                        {
                            id: "2",
                            name: "Dragon Model",
                            description: "A detailed dragon model for your scenes",
                            price: 19.99,
                            category: "creatures",
                            image: "https://via.placeholder.com/300"
                        }
                    ];

                    for (const product of sampleProducts) {
                        try {
                            await setDoc(doc(db, "products", product.id), product);
                            console.log("Sample product created:", product.id);
                        } catch (writeError) {
                            console.error("Error creating sample product:", writeError);
                            throw new Error(`Failed to create sample product ${product.id}: ${writeError.message}`);
                        }
                    }

                    setProducts(sampleProducts);
                } else {
                    const productsData = productsSnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));
                    console.log("Products loaded successfully:", productsData.length);
                    setProducts(productsData);
                }
            } catch (err) {
                console.error("Error fetching products:", err);
                setError(`Failed to load products: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const filteredProducts = products.filter(product => {
        const matchesCategory = filter === "all" || product.category === filter;
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            product.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    if (loading) {
        return <div className="loading">Loading products...</div>;
    }

    if (error) {
        return (
            <div className="error">
                <h3>Error Loading Products</h3>
                <p>{error}</p>
                <p>Please try refreshing the page or contact support if the problem persists.</p>
            </div>
        );
    }

    return (
        <div className="store-container">
            <div className="store-controls">
                <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="filter-select"
                >
                    <option value="all">All Categories</option>
                    <option value="buildings">Buildings</option>
                    <option value="creatures">Creatures</option>
                    <option value="props">Props</option>
                </select>
            </div>

            {filteredProducts.length === 0 ? (
                <div className="no-results">No products found matching your criteria.</div>
            ) : (
                <div className="product-grid">
                    {filteredProducts.map(product => (
                        <div key={product.id} className="product-card">
                            <img src={product.image} alt={product.name} />
                            <h3>{product.name}</h3>
                            <p>{product.description}</p>
                            <div className="product-footer">
                                <span className="price">${product.price.toFixed(2)}</span>
                                <button
                                    onClick={() => addToCart(product)}
                                    className="add-to-cart"
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Store;
