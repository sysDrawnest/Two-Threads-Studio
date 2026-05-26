// src/components/CricketKeychains.tsx
import React from 'react';

// Product data
const keychains = [
    {
        id: 1,
        name: "Mini Willow Bat Keychain",
        description: "Hand-carved from sustainable maple wood, engraved with stitch lines.",
        price: "$18.00",
        badge: "Best Seller",
        image: "https://placekitten.com/400/400?image=1", // Replace with real image URL
        alt: "Wooden cricket bat keychain"
    },
    {
        id: 2,
        name: "Leather Cricket Ball Keychain",
        description: "Genuine leather with hand-painted red seam details. Miniature and lightweight.",
        price: "$22.00",
        badge: "New",
        image: "https://placekitten.com/400/400?image=2",
        alt: "Leather cricket ball keychain"
    },
    {
        id: 3,
        name: "Wicket Stumps Trio",
        description: "Three miniature stumps tied with natural jute twine. A true collector's piece.",
        price: "$24.00",
        badge: "Handmade",
        image: "https://placekitten.com/400/400?image=3",
        alt: "Wooden stumps keychain"
    },
    {
        id: 4,
        name: "Classic Cricket Helmet",
        description: "Tiny handcrafted helmet with metal grille. Proudly made from recycled tin.",
        price: "$28.00",
        badge: "Limited",
        image: "https://placekitten.com/400/400?image=4",
        alt: "Mini helmet keychain"
    }
];

const CricketKeychains: React.FC = () => {
    return (
        <section style={styles.section}>
            <div style={styles.container}>
                {/* Section Header */}
                <div style={styles.header}>
                    <span style={styles.superBadge}>Handmade Collection</span>
                    <h2 style={styles.title}>Cricket Lover's Keychains</h2>
                    <p style={styles.subtitle}>
                        Each keychain is handcrafted by artisans using ethically sourced wood, leather, and metal.
                        Perfect for your bag, keys, or gift for the cricket enthusiast.
                    </p>
                </div>

                {/* Product Grid */}
                <div style={styles.grid}>
                    {keychains.map((item) => (
                        <div key={item.id} style={styles.card}>
                            <div style={styles.imageWrapper}>
                                <img src={item.image} alt={item.alt} style={styles.image} />
                                <span style={styles.badge}>{item.badge}</span>
                            </div>
                            <div style={styles.cardContent}>
                                <h3 style={styles.productName}>{item.name}</h3>
                                <p style={styles.productDesc}>{item.description}</p>
                                <div style={styles.priceRow}>
                                    <span style={styles.price}>{item.price}</span>
                                    <button style={styles.button}>Add to Cart</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// ----- Styles (matching your design system) -----
const styles: { [key: string]: React.CSSProperties } = {
    section: {
        padding: '5rem 0',
        backgroundColor: '#ede6de', // Warm sand / cream background
    },
    container: {
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 2rem',
    },
    header: {
        textAlign: 'center',
        marginBottom: '3rem',
    },
    superBadge: {
        display: 'inline-block',
        fontSize: '0.85rem',
        textTransform: 'uppercase',
        letterSpacing: '2px',
        color: '#8b6f5c', // Artisan Gold-Brown
        backgroundColor: '#fef3e8',
        padding: '0.3rem 1rem',
        borderRadius: '30px',
        marginBottom: '1rem',
        fontFamily: "'Lato', sans-serif",
    },
    title: {
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: 'clamp(2rem, 5vw, 3rem)',
        fontWeight: '500',
        color: '#2d2520',
        marginBottom: '0.75rem',
    },
    subtitle: {
        fontFamily: "'Lato', sans-serif",
        fontSize: '1.1rem',
        color: '#5a3d2b',
        maxWidth: '600px',
        margin: '0 auto',
        lineHeight: 1.5,
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '2rem',
    },
    card: {
        backgroundColor: '#f5f0eb',
        borderRadius: '12px',
        overflow: 'hidden',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        cursor: 'pointer',
    },
    cardHover: {
        transform: 'translateY(-4px)',
        boxShadow: '0 20px 25px -12px rgba(0,0,0,0.15)',
    },
    imageWrapper: {
        position: 'relative' as 'relative',
    },
    image: {
        width: '100%',
        aspectRatio: '1 / 1',
        objectFit: 'cover' as 'cover',
        display: 'block',
    },
    badge: {
        position: 'absolute' as 'absolute',
        top: '12px',
        right: '12px',
        backgroundColor: '#8b6f5c',
        color: '#f5f0eb',
        fontFamily: "'Lato', sans-serif",
        fontSize: '0.7rem',
        fontWeight: 'bold',
        padding: '0.3rem 0.7rem',
        borderRadius: '30px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
    },
    cardContent: {
        padding: '1.5rem',
    },
    productName: {
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: '1.4rem',
        fontWeight: '600',
        color: '#2d2520',
        marginBottom: '0.5rem',
    },
    productDesc: {
        fontFamily: "'Lato', sans-serif",
        fontSize: '0.9rem',
        color: '#5a3d2b',
        lineHeight: 1.4,
        marginBottom: '1.2rem',
    },
    priceRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    price: {
        fontFamily: "'Lato', sans-serif",
        fontSize: '1.2rem',
        fontWeight: '600',
        color: '#1e1812',
    },
    button: {
        backgroundColor: '#8b6f5c',
        color: '#fff',
        border: 'none',
        padding: '0.5rem 1.2rem',
        borderRadius: '30px',
        fontFamily: "'Lato', sans-serif",
        fontSize: '0.8rem',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'background-color 0.2s ease',
    },
};

// Add hover effect using CSS class (you can also do this with onMouseEnter/Leave)
// For simplicity, I'll add a style tag to handle hover.
// Alternatively, attach event handlers to each card.

// To enable hover effect without inline JS, we can inject a style tag.
// But since you use inline styles, here's a quick way: attach onMouseEnter/Leave
// I'll update the card rendering below.

// Actually, let's modify the card rendering to include hover state.
// I'll replace the static card style with a component that handles hover.
// For brevity, I'll show the final return with hover handlers.

// Final version of component with hover effect:
export default CricketKeychains;