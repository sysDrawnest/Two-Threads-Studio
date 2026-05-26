import { useState, useEffect } from "react";

// Type definitions
interface IntroAnimationProps {
  onComplete: () => void;
}

interface Product {
  name: string;
  price: string;
  tag?: string;
}

interface Room {
  name: string;
  desc: string;
  img: string | null;
}

interface Review {
  name: string;
  review: string;
  stars: number;
}

interface Tutorial {
  title: string;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  thumbnail: string;
  instructor: string;
}

interface LevelColor {
  bg: string;
  color: string;
}

interface FooterColumn {
  title: string;
  links: string[];
}

// ── Intro Animation ──────────────────────────────────────────────────────────
function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const [phase, setPhase] = useState<"enter" | "hold" | "exit">("enter"); // enter → hold → exit

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("hold"), 800);
    const t2 = setTimeout(() => setPhase("exit"), 2200);
    const t3 = setTimeout(onComplete, 3000);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        backgroundColor: "#f5f0eb",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        transition: "opacity 0.8s ease, transform 0.8s ease",
        opacity: phase === "exit" ? 0 : 1,
        pointerEvents: phase === "exit" ? "none" : ("all" as const),
      }}
    >
      {/* Needle SVG icon */}
      <div
        style={{
          transition: "opacity 0.8s 0.1s ease, transform 0.8s 0.1s ease",
          opacity: phase === "enter" ? 0 : 1,
          transform: phase === "enter" ? "translateY(10px)" : "translateY(0)",
          marginBottom: "1.2rem",
        }}
      >
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="19" stroke="#8b6f5c" strokeWidth="1.5" />
          <path d="M20 8 L20 32 M14 14 L20 8 L26 14" stroke="#8b6f5c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="20" cy="28" r="2" fill="#8b6f5c" />
        </svg>
      </div>
      <div
        style={{
          fontFamily: "'Cormorant Garamond', 'Garamond', Georgia, serif",
          fontSize: "clamp(1.8rem, 6vw, 3.2rem)",
          letterSpacing: "0.12em",
          color: "#2d2520",
          fontWeight: 300,
          transition: "opacity 0.8s 0.3s ease, transform 0.8s 0.3s ease",
          opacity: phase === "enter" ? 0 : 1,
          transform: phase === "enter" ? "scale(0.94)" : "scale(1)",
        }}
      >
        TwoThreads Studio
      </div>
      <div
        style={{
          marginTop: "0.6rem",
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: "0.8rem",
          letterSpacing: "0.3em",
          color: "#8b6f5c",
          textTransform: "uppercase",
          transition: "opacity 0.8s 0.5s ease",
          opacity: phase === "enter" ? 0 : 1,
        }}
      >
        Handcrafted with love
      </div>
    </div>
  );
}

// ── Navbar ───────────────────────────────────────────────────────────────────
function Navbar() {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);

  useEffect(() => {
    const handler = (): void => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const links: string[] = ["Shop", "Collections", "Learning", "Our Story", "Blog"];

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        backgroundColor: scrolled ? "rgba(245,240,235,0.97)" : "transparent",
        backdropFilter: scrolled ? "blur(8px)" : "none",
        transition: "background-color 0.4s ease, box-shadow 0.4s ease",
        boxShadow: scrolled ? "0 1px 20px rgba(0,0,0,0.08)" : "none",
        padding: "0 clamp(1rem, 5vw, 4rem)",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        {/* Logo */}
        <a href="#" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "1.3rem", letterSpacing: "0.08em", color: "#2d2520", textDecoration: "none", fontWeight: 500 }}>
          TwoThreads Studio
        </a>

        {/* Desktop Links */}
        <div style={{ display: "flex", gap: "2.2rem", alignItems: "center" }} className="desktop-nav">
          {links.map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(" ", "-")}`} style={{ fontFamily: "Georgia, serif", fontSize: "0.82rem", letterSpacing: "0.12em", color: "#2d2520", textDecoration: "none", textTransform: "uppercase", opacity: 0.8 }}>
              {l}
            </a>
          ))}
        </div>

        {/* Icons */}
        <div style={{ display: "flex", gap: "1.2rem", alignItems: "center" }}>
          <button style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
            <svg width="20" height="20" fill="none" stroke="#2d2520" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          </button>
          <button style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
            <svg width="20" height="20" fill="none" stroke="#2d2520" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          </button>
          {/* Hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex", flexDirection: "column", gap: 4 }} className="hamburger">
            <span style={{ display: "block", width: 22, height: 1.5, backgroundColor: "#2d2520", transition: "transform 0.3s, opacity 0.3s", transform: menuOpen ? "translateY(5.5px) rotate(45deg)" : "none" }} />
            <span style={{ display: "block", width: 22, height: 1.5, backgroundColor: "#2d2520", opacity: menuOpen ? 0 : 1, transition: "opacity 0.3s" }} />
            <span style={{ display: "block", width: 22, height: 1.5, backgroundColor: "#2d2520", transition: "transform 0.3s, opacity 0.3s", transform: menuOpen ? "translateY(-5.5px) rotate(-45deg)" : "none" }} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div style={{
        overflow: "hidden",
        maxHeight: menuOpen ? 400 : 0,
        transition: "max-height 0.4s ease",
        backgroundColor: "rgba(245,240,235,0.98)",
        borderTop: menuOpen ? "1px solid #e8e0d8" : "none",
      }}>
        <div style={{ padding: "1.5rem clamp(1rem,5vw,4rem)", display: "flex", flexDirection: "column", gap: "1.4rem" }}>
          {links.map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(" ", "-")}`} onClick={() => setMenuOpen(false)} style={{ fontFamily: "Georgia, serif", fontSize: "1.1rem", letterSpacing: "0.08em", color: "#2d2520", textDecoration: "none" }}>
              {l}
            </a>
          ))}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Lato:wght@300;400&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f5f0eb; }
        @media (min-width: 768px) { .hamburger { display: none !important; } }
        @media (max-width: 767px) { .desktop-nav { display: none !important; } }
        html { scroll-behavior: smooth; }
        .card-hover { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .card-hover:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,0.1) !important; }
        .btn-primary { transition: background-color 0.3s, transform 0.2s; }
        .btn-primary:hover { background-color: #5a3d2b !important; transform: translateY(-1px); }
        .btn-outline:hover { background-color: #2d2520 !important; color: #f5f0eb !important; }
      `}</style>
    </nav>
  );
}

// ── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  interface HeroProduct {
    name: string;
    price: string;
    bg: string;
  }

  const heroProducts: HeroProduct[] = [
    { name: "Floral Hoop Kit", price: "$38", bg: "#e8ddd3" },
    { name: "Botanical Set", price: "$52", bg: "#dfd5c8" },
    { name: "Beginner Bundle", price: "$29", bg: "#ede6de" },
  ];

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>): void => {
    e.currentTarget.style.display = "none";
  };

  return (
    <section id="hero" style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
      {/* Background */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #f0e8de 0%, #e8ddd3 40%, #d4c4b5 100%)" }} />
      <img
        src="https://images.unsplash.com/photo-1611486212557-88be5ff6f941?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
        alt="Hero background showing embroidery supplies"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", opacity: 0.6 }}
        onError={handleImageError}
      />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(245,240,235,0.85) 0%, rgba(245,240,235,0.3) 60%, transparent 100%)" }} />

      <div style={{ position: "relative", zIndex: 2, padding: "8rem clamp(1.5rem,8vw,6rem) 4rem", maxWidth: 1280, margin: "0 auto", width: "100%" }}>
        <div style={{ maxWidth: 520 }}>
          <p style={{ fontFamily: "Georgia, serif", fontSize: "0.75rem", letterSpacing: "0.3em", color: "#8b6f5c", textTransform: "uppercase", marginBottom: "1.2rem" }}>
            Handmade with Intention
          </p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(2.6rem, 6vw, 4.5rem)", fontWeight: 300, lineHeight: 1.15, color: "#2d2520", marginBottom: "1.4rem", letterSpacing: "-0.01em" }}>
            Naturally Made<br />for Living
          </h1>
          <p style={{ fontFamily: "Georgia, serif", fontSize: "clamp(0.9rem, 2vw, 1.05rem)", lineHeight: 1.8, color: "#5a4a3f", marginBottom: "2.2rem", fontStyle: "italic" }}>
            Thoughtfully made stitches that bring warmth, texture, and story into every room.
          </p>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <button className="btn-primary" style={{ backgroundColor: "#2d2520", color: "#f5f0eb", border: "none", padding: "0.9rem 2.2rem", fontFamily: "Georgia, serif", fontSize: "0.8rem", letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer" }}>
              Shop Now
            </button>
            <button className="btn-outline" style={{ backgroundColor: "transparent", color: "#2d2520", border: "1px solid #2d2520", padding: "0.9rem 2.2rem", fontFamily: "Georgia, serif", fontSize: "0.8rem", letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer" }}>
              Explore
            </button>
          </div>
        </div>
      </div>

      {/* Floating product cards */}
      <div style={{ position: "absolute", right: "clamp(1rem, 5vw, 5rem)", top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column", gap: "0.8rem", zIndex: 3 }} className="hero-cards">
        {heroProducts.map((p, i) => (
          <div key={i} className="card-hover" style={{ backgroundColor: p.bg, padding: "1rem 1.2rem", width: 160, borderRadius: 2, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
            <div style={{ width: "100%", height: 80, backgroundColor: "#c4b5a8", borderRadius: 2, marginBottom: "0.6rem" }} />
            <p style={{ fontFamily: "Georgia, serif", fontSize: "0.78rem", color: "#2d2520" }}>{p.name}</p>
            <p style={{ fontFamily: "Georgia, serif", fontSize: "0.75rem", color: "#8b6f5c", marginTop: "0.2rem" }}>{p.price}</p>
          </div>
        ))}
      </div>
      <style>{`@media(max-width:767px){.hero-cards{display:none!important}}`}</style>
    </section>
  );
}

// ── Best Sellers ──────────────────────────────────────────────────────────────
function BestSellers() {
  const products: Product[] = [
    { name: "Meadow Hoop Kit", price: "$42", tag: "Best Seller" },
    { name: "Garden Botanicals", price: "$56", tag: "New" },
    { name: "Linen Starter Set", price: "$35", tag: "" },
    { name: "Forest Creatures", price: "$48", tag: "Best Seller" },
  ];

  return (
    <section style={{ padding: "6rem clamp(1.5rem,8vw,6rem)", backgroundColor: "#f5f0eb" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <p style={{ fontFamily: "Georgia, serif", fontSize: "0.7rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#8b6f5c", textAlign: "center", marginBottom: "0.6rem" }}>Best Sellers</p>
        <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 300, textAlign: "center", color: "#2d2520", marginBottom: "3rem" }}>
          Most Loved Designs
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1.5rem" }}>
          {products.map((p, i) => (
            <div key={i} className="card-hover" style={{ backgroundColor: "#fff", cursor: "pointer", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
              <div style={{ height: 260, backgroundColor: `hsl(${30 + i * 15}, 20%, ${85 - i * 3}%)`, position: "relative" }}>
                {p.tag && (
                  <span style={{ position: "absolute", top: 12, left: 12, backgroundColor: "#2d2520", color: "#f5f0eb", fontSize: "0.65rem", letterSpacing: "0.15em", padding: "0.25rem 0.6rem", textTransform: "uppercase", fontFamily: "Georgia, serif" }}>
                    {p.tag}
                  </span>
                )}
              </div>
              <div style={{ padding: "1rem 1.2rem 1.4rem" }}>
                <p style={{ fontFamily: "Georgia, serif", fontSize: "0.85rem", color: "#2d2520" }}>{p.name}</p>
                <p style={{ fontFamily: "Georgia, serif", fontSize: "0.8rem", color: "#8b6f5c", marginTop: "0.3rem" }}>{p.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Explore by Room ───────────────────────────────────────────────────────────
function ExploreByRoom() {
  const rooms: Room[] = [
    { name: "Living Spaces", desc: "Framed hoops and wall hangings that bring warmth and texture to your walls and shelves.", img: null },
    { name: "Bathrooms", desc: "Delicate embroidered towels, framed botanical prints, and linen accents for serene spaces.", img: null },
    { name: "Bedrooms", desc: "Pillowcase embroideries, dream-catcher wall art, and slow-stitch pieces for restful rooms.", img: null },
  ];

  return (
    <section id="collections" style={{ padding: "6rem clamp(1.5rem,8vw,6rem)", backgroundColor: "#ede6de" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <p style={{ fontFamily: "Georgia, serif", fontSize: "0.7rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#8b6f5c", textAlign: "center", marginBottom: "0.6rem" }}>Explore by Room</p>
        <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 300, textAlign: "center", color: "#2d2520", marginBottom: "3.5rem" }}>
          Stitch Every Corner
        </h2>

        {rooms.map((room, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: i % 2 === 0 ? "1fr 1.6fr" : "1.6fr 1fr", gap: "2rem", marginBottom: "4rem", alignItems: "center" }} className="room-grid">
            {i % 2 !== 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem" }}>
                {[0, 1, 2, 3].map(j => (
                  <div key={j} style={{ height: 160, backgroundColor: `hsl(${30 + j * 12}, 18%, ${80 - j * 2}%)`, borderRadius: 2 }} />
                ))}
              </div>
            )}
            <div style={{ padding: "1rem" }}>
              <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(1.6rem,3vw,2.2rem)", fontWeight: 300, color: "#2d2520", marginBottom: "1rem" }}>
                {room.name}
              </h3>
              <p style={{ fontFamily: "Georgia, serif", fontSize: "0.88rem", lineHeight: 1.9, color: "#5a4a3f" }}>{room.desc}</p>
              <button className="btn-outline" style={{ marginTop: "1.5rem", backgroundColor: "transparent", color: "#2d2520", border: "1px solid #2d2520", padding: "0.7rem 1.8rem", fontFamily: "Georgia, serif", fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer" }}>
                Shop {room.name}
              </button>
            </div>
            {i % 2 === 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem" }}>
                {[0, 1, 2, 3].map(j => (
                  <div key={j} style={{ height: 180, backgroundColor: `hsl(${25 + j * 10}, 20%, ${82 - j * 2}%)`, borderRadius: 2 }} />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <style>{`@media(max-width:767px){.room-grid{grid-template-columns:1fr!important}}`}</style>
    </section>
  );
}

// ── Banner ────────────────────────────────────────────────────────────────────
function Banner() {
  return (
    <section style={{ position: "relative", height: "clamp(280px, 40vw, 500px)", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #8b6f5c 0%, #5a3d2b 100%)" }} />
      <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "2rem" }}>
        <p style={{ fontFamily: "Georgia, serif", fontSize: "0.72rem", letterSpacing: "0.3em", color: "rgba(255,255,255,0.7)", textTransform: "uppercase", marginBottom: "1rem" }}>
          An Exclusive Collection
        </p>
        <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(1.8rem,5vw,3.5rem)", fontWeight: 300, color: "#fff", lineHeight: 1.2, marginBottom: "1.5rem" }}>
          Our Artisan Guild Sale
        </h2>
        <p style={{ fontFamily: "Georgia, serif", fontSize: "0.9rem", color: "rgba(255,255,255,0.8)", fontStyle: "italic", marginBottom: "2rem" }}>
          Premium embroidery patterns, crafted for Modern Home Weavers
        </p>
        <button className="btn-primary" style={{ backgroundColor: "#f5f0eb", color: "#2d2520", border: "none", padding: "0.9rem 2.4rem", fontFamily: "Georgia, serif", fontSize: "0.78rem", letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer" }}>
          Explore Sale
        </button>
      </div>
    </section>
  );
}

// ── Just For You ──────────────────────────────────────────────────────────────
function JustForYou() {
  interface JustForYouItem {
    name: string;
    price: string;
    size: string;
  }

  const items: JustForYouItem[] = [
    { name: "Botanical Wreath Kit", price: "$44", size: "tall" },
    { name: "Modern Grid Set", price: "$38", size: "small" },
    { name: "Forest Walk Pattern", price: "$29", size: "small" },
    { name: "Sage Linen Bundle", price: "$55", size: "medium" },
    { name: "Thread Palette Box", price: "$22", size: "medium" },
  ];

  return (
    <section style={{ padding: "6rem clamp(1.5rem,8vw,6rem)", backgroundColor: "#f5f0eb" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <p style={{ fontFamily: "Georgia, serif", fontSize: "0.7rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#8b6f5c", textAlign: "center", marginBottom: "0.6rem" }}>Just For You</p>
        <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 300, textAlign: "center", color: "#2d2520", marginBottom: "3rem" }}>
          Curated Picks
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "1rem" }} className="masonry-grid">
          {items.map((item, i) => {
            const spans: number[] = [8, 4, 4, 6, 6];
            const heights: number[] = [340, 200, 200, 260, 260];
            return (
              <div key={i} className="card-hover" style={{ gridColumn: `span ${spans[i]}`, cursor: "pointer" }}>
                <div style={{ height: heights[i], backgroundColor: `hsl(${28 + i * 15}, 22%, ${78 - i * 3}%)`, position: "relative" }}>
                  <div style={{ position: "absolute", bottom: 12, left: 12, backgroundColor: "rgba(245,240,235,0.92)", padding: "0.5rem 0.8rem" }}>
                    <p style={{ fontFamily: "Georgia, serif", fontSize: "0.78rem", color: "#2d2520" }}>{item.name}</p>
                    <p style={{ fontFamily: "Georgia, serif", fontSize: "0.72rem", color: "#8b6f5c" }}>{item.price}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <style>{`@media(max-width:767px){.masonry-grid>div{grid-column:span 12!important}}`}</style>
    </section>
  );
}

// ── Our Story ─────────────────────────────────────────────────────────────────
function OurStory() {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>): void => {
    const parent = e.currentTarget.parentNode as HTMLElement;
    if (parent) {
      parent.style.backgroundColor = "#5a3d2b";
    }
    e.currentTarget.style.display = "none";
  };

  return (
    <section id="our-story" style={{ padding: "6rem clamp(1.5rem,8vw,6rem)", backgroundColor: "#2d2520" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center" }} className="story-grid">
        {/* Left: Image */}
        <div style={{ position: "relative" }}>
          <img
            src="https://images.unsplash.com/photo-1600335895229-6f755ef92cbf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            alt="Our Story - artisan at work"
            style={{ width: "100%", height: "clamp(380px, 50vw, 600px)", objectFit: "cover", objectPosition: "center" }}
            onError={handleImageError}
          />
          <div style={{ position: "absolute", top: -20, left: -20, width: "100%", height: "100%", border: "1px solid rgba(255,255,255,0.1)", pointerEvents: "none" }} />
        </div>
        {/* Right: Text */}
        <div>
          <p style={{ fontFamily: "Georgia, serif", fontSize: "0.7rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#8b6f5c", marginBottom: "1rem" }}>
            Our Story
          </p>
          <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 300, color: "#f5f0eb", lineHeight: 1.2, marginBottom: "1.8rem" }}>
            TwoThreads celebrates the art of making.
          </h2>
          <p style={{ fontFamily: "Georgia, serif", fontSize: "0.9rem", lineHeight: 1.9, color: "rgba(245,240,235,0.75)", marginBottom: "1.2rem" }}>
            We partner with makers across the world to bring you golden gut home settings, embroidery kits, and the best in precision crafting. Each piece is carefully woven with love, coming together in the details that matter to us.
          </p>
          <p style={{ fontFamily: "Georgia, serif", fontSize: "0.9rem", lineHeight: 1.9, color: "rgba(245,240,235,0.75)", marginBottom: "2rem" }}>
            We are solely committed to the crafts that mean it all. These materials are biodegradable and gentle on the earth.
          </p>
          <button className="btn-primary" style={{ backgroundColor: "#8b6f5c", color: "#f5f0eb", border: "none", padding: "0.9rem 2.2rem", fontFamily: "Georgia, serif", fontSize: "0.78rem", letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer" }}>
            Learn More
          </button>
        </div>
      </div>
      <style>{`@media(max-width:767px){.story-grid{grid-template-columns:1fr!important;gap:2.5rem!important}}`}</style>
    </section>
  );
}

// ── Patterns / Reviews ─────────────────────────────────────────────────────────
function Reviews() {
  const reviews: Review[] = [
    { name: "Akemi T.", review: "The quality of TwoThreads kits is unlike anything I've found elsewhere. The thread colors are so rich and the instructions are beautifully clear.", stars: 5 },
    { name: "Sarah M.", review: "I gifted the Botanical Set to my sister and she was moved to tears. Such thoughtful packaging and the design itself is stunning.", stars: 5 },
    { name: "Priya R.", review: "As a beginner I was nervous but the beginner bundle made it so accessible. Now I'm completely hooked on embroidery!", stars: 5 },
  ];

  return (
    <section id="patterns" style={{ padding: "6rem clamp(1.5rem,8vw,6rem)", backgroundColor: "#f5f0eb" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <p style={{ fontFamily: "Georgia, serif", fontSize: "0.7rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#8b6f5c", textAlign: "center", marginBottom: "0.6rem" }}>Patterns & Reviews</p>
        <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 300, textAlign: "center", color: "#2d2520", marginBottom: "3rem" }}>
          What Our Makers Say
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
          {reviews.map((r, i) => (
            <div key={i} style={{ backgroundColor: "#fff", padding: "2rem", boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}>
              <div style={{ display: "flex", gap: "0.3rem", marginBottom: "1.2rem" }}>
                {Array(r.stars).fill(0).map((_, j) => (
                  <span key={j} style={{ color: "#8b6f5c", fontSize: "0.9rem" }}>★</span>
                ))}
              </div>
              <p style={{ fontFamily: "Georgia, serif", fontSize: "0.88rem", lineHeight: 1.8, color: "#5a4a3f", fontStyle: "italic", marginBottom: "1.2rem" }}>
                "{r.review}"
              </p>
              <p style={{ fontFamily: "Georgia, serif", fontSize: "0.78rem", letterSpacing: "0.1em", color: "#8b6f5c", textTransform: "uppercase" }}>— {r.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Learning Section ──────────────────────────────────────────────────────────
function Learning() {
  const tutorials: Tutorial[] = [
    { title: "French Knots for Beginners", duration: "12 min", level: "Beginner", thumbnail: "#c4b5a8", instructor: "Maya Chen" },
    { title: "Satin Stitch Petals", duration: "18 min", level: "Beginner", thumbnail: "#b5a898", instructor: "Lena Park" },
    { title: "Geometric Grid Patterns", duration: "25 min", level: "Intermediate", thumbnail: "#a89888", instructor: "Rosa Kim" },
    { title: "Botanical Fill Techniques", duration: "32 min", level: "Intermediate", thumbnail: "#988878", instructor: "Sara Wells" },
    { title: "Shadow Work on Linen", duration: "28 min", level: "Advanced", thumbnail: "#886858", instructor: "Akemi Tanaka" },
    { title: "Creating 3D Texture", duration: "40 min", level: "Advanced", thumbnail: "#785848", instructor: "Priya Singh" },
  ];

  const levelColors: Record<string, LevelColor> = {
    Beginner: { bg: "#e8f4e8", color: "#3a6b3a" },
    Intermediate: { bg: "#fef3e8", color: "#8b5a00" },
    Advanced: { bg: "#fde8e8", color: "#8b0000" },
  };

  return (
    <section id="learning" style={{ padding: "6rem clamp(1.5rem,8vw,6rem)", backgroundColor: "#ede6de" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <p style={{ fontFamily: "Georgia, serif", fontSize: "0.7rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#8b6f5c", textAlign: "center", marginBottom: "0.6rem" }}>Learning Studio</p>
        <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 300, textAlign: "center", color: "#2d2520", marginBottom: "1rem" }}>
          Embroidery Design Tutorials
        </h2>
        <p style={{ fontFamily: "Georgia, serif", fontSize: "0.9rem", color: "#5a4a3f", textAlign: "center", maxWidth: 540, margin: "0 auto 3.5rem", lineHeight: 1.8 }}>
          Learn at your own pace with our curated video tutorials — from first stitches to advanced techniques.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
          {tutorials.map((t, i) => (
            <div key={i} className="card-hover" style={{ backgroundColor: "#fff", cursor: "pointer", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
              {/* Thumbnail */}
              <div style={{ height: 200, backgroundColor: t.thumbnail, position: "relative", overflow: "hidden" }}>
                {/* Play button */}
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ width: 52, height: 52, borderRadius: "50%", backgroundColor: "rgba(245,240,235,0.92)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px rgba(0,0,0,0.2)" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#2d2520"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                  </div>
                </div>
                {/* Duration badge */}
                <div style={{ position: "absolute", bottom: 10, right: 10, backgroundColor: "rgba(45,37,32,0.85)", color: "#f5f0eb", fontFamily: "Georgia, serif", fontSize: "0.7rem", padding: "0.25rem 0.5rem" }}>
                  {t.duration}
                </div>
              </div>
              {/* Info */}
              <div style={{ padding: "1.2rem 1.4rem 1.6rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.7rem" }}>
                  <span style={{ backgroundColor: levelColors[t.level].bg, color: levelColors[t.level].color, fontSize: "0.65rem", letterSpacing: "0.1em", padding: "0.2rem 0.6rem", textTransform: "uppercase", fontFamily: "Georgia, serif" }}>
                    {t.level}
                  </span>
                </div>
                <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "1.1rem", fontWeight: 400, color: "#2d2520", marginBottom: "0.4rem", lineHeight: 1.3 }}>
                  {t.title}
                </h3>
                <p style={{ fontFamily: "Georgia, serif", fontSize: "0.76rem", color: "#8b6f5c" }}>with {t.instructor}</p>
                <button className="btn-outline" style={{ marginTop: "1rem", backgroundColor: "transparent", color: "#2d2520", border: "1px solid #2d2520", padding: "0.55rem 1.4rem", fontFamily: "Georgia, serif", fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer", width: "100%" }}>
                  Watch Now
                </button>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: "3rem" }}>
          <button className="btn-primary" style={{ backgroundColor: "#2d2520", color: "#f5f0eb", border: "none", padding: "1rem 3rem", fontFamily: "Georgia, serif", fontSize: "0.8rem", letterSpacing: "0.18em", textTransform: "uppercase", cursor: "pointer" }}>
            View All Tutorials
          </button>
        </div>
      </div>
    </section>
  );
}

// ── Newsletter ────────────────────────────────────────────────────────────────
function Newsletter() {
  return (
    <section style={{ padding: "5rem clamp(1.5rem,8vw,6rem)", backgroundColor: "#2d2520", textAlign: "center" }}>
      <p style={{ fontFamily: "Georgia, serif", fontSize: "0.7rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#8b6f5c", marginBottom: "1rem" }}>
        Stay Connected
      </p>
      <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(1.6rem,4vw,2.4rem)", fontWeight: 300, color: "#f5f0eb", marginBottom: "1rem" }}>
        Join the TwoThreads Community
      </h2>
      <p style={{ fontFamily: "Georgia, serif", fontSize: "0.88rem", color: "rgba(245,240,235,0.65)", marginBottom: "2.5rem", maxWidth: 440, margin: "0 auto 2.5rem", lineHeight: 1.8 }}>
        Get early access to new patterns, tutorial releases, and exclusive member discounts.
      </p>
      <div style={{ display: "flex", gap: "0", maxWidth: 460, margin: "0 auto", flexWrap: "wrap", justifyContent: "center" }}>
        <input type="email" placeholder="Your email address" style={{ flex: 1, minWidth: 240, padding: "0.9rem 1.4rem", backgroundColor: "rgba(245,240,235,0.08)", border: "1px solid rgba(245,240,235,0.2)", color: "#f5f0eb", fontFamily: "Georgia, serif", fontSize: "0.85rem", outline: "none", borderRight: "none" }} />
        <button className="btn-primary" style={{ backgroundColor: "#8b6f5c", color: "#f5f0eb", border: "1px solid #8b6f5c", padding: "0.9rem 2rem", fontFamily: "Georgia, serif", fontSize: "0.78rem", letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer", whiteSpace: "nowrap" }}>
          Subscribe
        </button>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  const cols: FooterColumn[] = [
    { title: "Shop", links: ["New Arrivals", "Kits & Bundles", "Patterns", "Threads & Fabric", "Gift Cards"] },
    { title: "Learn", links: ["Video Tutorials", "Beginner Guide", "Stitch Library", "Pattern Downloads", "Community"] },
    { title: "Studio", links: ["Our Story", "Sustainability", "Collaborations", "Press", "Careers"] },
    { title: "Support", links: ["FAQ", "Shipping Info", "Returns", "Track Order", "Contact Us"] },
  ];

  return (
    <footer style={{ backgroundColor: "#1e1812", padding: "5rem clamp(1.5rem,8vw,6rem) 2rem" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr repeat(4, 1fr)", gap: "3rem", marginBottom: "4rem" }} className="footer-grid">
          <div>
            <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "1.4rem", color: "#f5f0eb", fontWeight: 300, marginBottom: "1rem" }}>
              TwoThreads Studio
            </h3>
            <p style={{ fontFamily: "Georgia, serif", fontSize: "0.82rem", color: "rgba(245,240,235,0.5)", lineHeight: 1.8, marginBottom: "1.5rem" }}>
              Handmade embroidery kits and patterns, crafted with love.
            </p>
            <div style={{ display: "flex", gap: "1rem" }}>
              {["Instagram", "Pinterest", "YouTube"].map(s => (
                <a key={s} href="#" style={{ fontFamily: "Georgia, serif", fontSize: "0.7rem", color: "#8b6f5c", letterSpacing: "0.1em", textDecoration: "none" }}>{s}</a>
              ))}
            </div>
          </div>
          {cols.map((col, i) => (
            <div key={i}>
              <h4 style={{ fontFamily: "Georgia, serif", fontSize: "0.72rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(245,240,235,0.6)", marginBottom: "1.2rem" }}>
                {col.title}
              </h4>
              {col.links.map(l => (
                <a key={l} href="#" style={{ display: "block", fontFamily: "Georgia, serif", fontSize: "0.82rem", color: "rgba(245,240,235,0.45)", textDecoration: "none", marginBottom: "0.7rem", lineHeight: 1.5 }}>
                  {l}
                </a>
              ))}
            </div>
          ))}
        </div>
        <div style={{ borderTop: "1px solid rgba(245,240,235,0.08)", paddingTop: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <p style={{ fontFamily: "Georgia, serif", fontSize: "0.75rem", color: "rgba(245,240,235,0.3)" }}>
            © 2026 TwoThreads Studio. All rights reserved.
          </p>
          <p style={{ fontFamily: "Georgia, serif", fontSize: "0.75rem", color: "rgba(245,240,235,0.3)" }}>
            Privacy Policy · Terms of Service
          </p>
        </div>
      </div>
      <style>{`@media(max-width:767px){.footer-grid{grid-template-columns:1fr 1fr!important;gap:2rem!important}}`}</style>
    </footer>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [showIntro, setShowIntro] = useState<boolean>(() => {
    try { 
      return !sessionStorage.getItem("tt_visited"); 
    } catch { 
      return true; 
    }
  });

  const handleIntroComplete = (): void => {
    try { 
      sessionStorage.setItem("tt_visited", "1"); 
    } catch {}
    setShowIntro(false);
  };

  return (
    <div style={{ overflowX: "hidden" }}>
      {showIntro && <IntroAnimation onComplete={handleIntroComplete} />}
      <Navbar />
      <main style={{ opacity: showIntro ? 0 : 1, transition: "opacity 0.6s ease" }}>
        <Hero />
        <BestSellers />
        <ExploreByRoom />
        <Banner />
        <JustForYou />
        <OurStory />
        <Reviews />
        <Learning />
        <Newsletter />
        <Footer />
      </main>
    </div>
  );
}