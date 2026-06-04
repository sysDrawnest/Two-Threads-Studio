import React from 'react';
import { ScrollReveal, StaggerContainer } from '../ui/ScrollReveal';

export function Hero() {
  const heroProducts = [
    { name: "Floral Hoop Kit", price: "$38", bg: "#e8ddd3" },
    { name: "Botanical Set", price: "$52", bg: "#dfd5c8" },
    { name: "Beginner Bundle", price: "$29", bg: "#ede6de" },
  ];

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.style.display = "none";
  };

  return (
    <section id="hero" className="relative min-h-[100vh] flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#f0e8de] via-[#e8ddd3] to-[#d4c4b5]" />
      <img
        src="https://images.unsplash.com/photo-1611486212557-88be5ff6f941?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
        alt="Hero background showing embroidery supplies"
        className="absolute inset-0 w-full h-full object-cover object-center opacity-60"
        onError={handleImageError}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background/85 via-background/30 to-transparent" />

      <div className="relative z-10 pt-32 px-6 md:px-16 pb-16 max-w-7xl mx-auto w-full">
        <div className="max-w-xl">
          <ScrollReveal direction="up" delay={0.15}>
            <p className="font-sans text-xs tracking-[0.3em] text-on-secondary-container uppercase mb-5">
              Handmade with Intention
            </p>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.3}>
            <h1 className="font-serif text-5xl md:text-7xl font-light leading-tight text-primary-container mb-6 tracking-tight">
              Naturally Made<br />for Living
            </h1>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.45}>
            <p className="font-sans text-base md:text-lg leading-relaxed text-[#5a4a3f] mb-9 italic">
              Thoughtfully made stitches that bring warmth, texture, and story into every room.
            </p>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.6}>
            <div className="flex gap-4 flex-wrap">
              <button className="bg-primary-container text-inverse-on-surface border-none px-9 py-3.5 font-sans text-sm tracking-[0.15em] uppercase cursor-pointer hover:bg-[#5a3d2b] transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-container outline-none">
                Shop Now
              </button>
              <button className="bg-transparent text-primary-container border border-primary-container px-9 py-3.5 font-sans text-sm tracking-[0.15em] uppercase cursor-pointer hover:bg-primary-container hover:text-inverse-on-surface transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-container outline-none">
                Explore
              </button>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Floating product cards */}
      <div className="hidden md:flex absolute right-[5vw] top-1/2 -translate-y-1/2 flex-col gap-3 z-20">
        {heroProducts.map((p, i) => (
          <ScrollReveal key={i} direction="left" delay={0.3 + i * 0.15}>
            <div className="bg-white p-4 w-40 rounded-sm shadow-sm hover:-translate-y-1 hover:shadow-md transition-all cursor-pointer" style={{ backgroundColor: p.bg }}>
              <div className="w-full h-20 bg-[#c4b5a8] rounded-sm mb-2" />
              <p className="font-sans text-xs text-primary-container">{p.name}</p>
              <p className="font-sans text-xs text-on-secondary-container mt-1">{p.price}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}

export function BestSellers() {
  const products = [
    { name: "Meadow Hoop Kit", price: "$42", tag: "Best Seller" },
    { name: "Garden Botanicals", price: "$56", tag: "New" },
    { name: "Linen Starter Set", price: "$35", tag: "" },
    { name: "Forest Creatures", price: "$48", tag: "Best Seller" },
  ];

  return (
    <section className="py-24 px-6 md:px-16 bg-inverse-on-surface">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal direction="up" className="text-center mb-12">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-on-secondary-container mb-2">Best Sellers</p>
          <h2 className="font-serif text-3xl md:text-5xl font-light text-primary-container">
            Most Loved Designs
          </h2>
        </ScrollReveal>
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((p, i) => (
            <ScrollReveal key={i} direction="up" distance={20}>
              <div className="bg-white cursor-pointer shadow-sm hover:-translate-y-1.5 hover:shadow-lg transition-all duration-300">
                <div className="h-64 relative" style={{ backgroundColor: `hsl(${30 + i * 15}, 20%, ${85 - i * 3}%)` }}>
                  {p.tag && (
                    <span className="absolute top-3 left-3 bg-primary-container text-inverse-on-surface text-[10px] tracking-[0.15em] px-2.5 py-1 uppercase font-sans">
                      {p.tag}
                    </span>
                  )}
                </div>
                <div className="p-4 pb-5">
                  <p className="font-sans text-sm text-primary-container">{p.name}</p>
                  <p className="font-sans text-sm text-on-secondary-container mt-1">{p.price}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

import roomImg1 from '../../assets/stitch/a_high_end_editorial_photo_of_a_minimalist_living_room_featuring_framed_hand.png';
import roomImg2 from '../../assets/stitch/a_high_end_editorial_photo_of_a_serene_bathroom_setting_featuring_delicate.png';
import roomImg3 from '../../assets/stitch/a_high_end_editorial_photo_of_a_cozy_bedroom_featuring_an_embroidered.png';

export function ExploreByRoom() {
  const rooms = [
    { name: "Living Spaces", desc: "Framed hoops and wall hangings that bring warmth and texture to your walls and shelves.", img: roomImg1 },
    { name: "Bathrooms", desc: "Delicate embroidered towels, framed botanical prints, and linen accents for serene spaces.", img: roomImg2 },
    { name: "Bedrooms", desc: "Pillowcase embroideries, dream-catcher wall art, and slow-stitch pieces for restful rooms.", img: roomImg3 },
  ];

  return (
    <section id="collections" className="py-24 px-6 md:px-16 bg-[#ede6de]">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal direction="up" className="text-center mb-14">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-on-secondary-container mb-2">Explore by Room</p>
          <h2 className="font-serif text-3xl md:text-5xl font-light text-primary-container mb-6">
            Stitch Every Corner
          </h2>
          <div className="md:hidden border-t border-dotted border-outline-variant max-w-[80px] mx-auto"></div>
        </ScrollReveal>

        {/* Mobile View */}
        <div className="md:hidden space-y-16">
          {rooms.map((room, i) => (
            <ScrollReveal key={i} direction="up" className="group">
              <div className="aspect-[4/5] overflow-hidden bg-surface-container-low mb-6">
                <img src={room.img} alt={room.name} className="w-full h-full object-cover grayscale-[20%] group-hover:scale-105 transition-transform duration-700 ease-out" />
              </div>
              <div className="space-y-4">
                <h3 className="font-serif text-[28px] text-primary-container">{room.name}</h3>
                <p className="font-sans text-base text-[#4e4540] leading-relaxed">
                  {room.desc}
                </p>
                <a href="#" className="inline-flex items-center font-sans text-[14px] uppercase tracking-[0.15em] font-medium border-b border-primary-container pb-1 group-hover:text-secondary group-hover:border-secondary transition-colors no-underline text-primary-container">
                  Shop {room.name}
                  <svg className="ml-2" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14m-7-7l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </a>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Desktop View */}
        <div className="hidden md:block">
          {rooms.map((room, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 items-center">
              {i % 2 !== 0 && (
                <ScrollReveal direction="left" className="hidden md:grid grid-cols-2 gap-3">
                  {[0, 1, 2, 3].map(j => (
                    <div key={j} className="h-40 rounded-sm hover:opacity-90 transition-opacity" style={{ backgroundColor: `hsl(${30 + j * 12}, 18%, ${80 - j * 2}%)` }} />
                  ))}
                </ScrollReveal>
              )}
              <ScrollReveal direction={i % 2 === 0 ? "left" : "right"} className="p-4">
                <h3 className="font-serif text-2xl md:text-4xl font-light text-primary-container mb-4">
                  {room.name}
                </h3>
                <p className="font-sans text-sm leading-relaxed text-[#5a4a3f] mb-6">{room.desc}</p>
                <button className="bg-transparent text-primary-container border border-primary-container px-7 py-3 font-sans text-xs tracking-[0.15em] uppercase cursor-pointer hover:bg-primary-container hover:text-inverse-on-surface transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-container outline-none">
                  Shop {room.name}
                </button>
              </ScrollReveal>
              {i % 2 === 0 && (
                <ScrollReveal direction="right" className="hidden md:grid grid-cols-2 gap-3">
                  {[0, 1, 2, 3].map(j => (
                    <div key={j} className="h-44 rounded-sm hover:opacity-90 transition-opacity" style={{ backgroundColor: `hsl(${25 + j * 10}, 20%, ${82 - j * 2}%)` }} />
                  ))}
                </ScrollReveal>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Banner() {
  return (
    <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#8b6f5c] to-[#5a3d2b]" />
      <ScrollReveal direction="up" className="relative z-10 text-center p-8">
        <p className="font-sans text-xs tracking-[0.3em] text-white/70 uppercase mb-4">
          An Exclusive Collection
        </p>
        <h2 className="font-serif text-3xl md:text-5xl font-light text-white leading-tight mb-6">
          Our Artisan Guild Sale
        </h2>
        <p className="font-sans text-sm text-white/80 italic mb-8">
          Premium embroidery patterns, crafted for Modern Home Weavers
        </p>
        <button className="bg-inverse-on-surface text-primary-container border-none px-9 py-3.5 font-sans text-sm tracking-[0.15em] uppercase cursor-pointer hover:bg-white transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-container outline-none">
          Explore Sale
        </button>
      </ScrollReveal>
    </section>
  );
}

export function JustForYou() {
  const items = [
    { name: "Botanical Wreath Kit", price: "$44", size: "tall" },
    { name: "Modern Grid Set", price: "$38", size: "small" },
    { name: "Forest Walk Pattern", price: "$29", size: "small" },
    { name: "Sage Linen Bundle", price: "$55", size: "medium" },
    { name: "Thread Palette Box", price: "$22", size: "medium" },
  ];

  return (
    <section className="py-24 px-6 md:px-16 bg-inverse-on-surface">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal direction="up" className="text-center mb-12">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-on-secondary-container mb-2">Just For You</p>
          <h2 className="font-serif text-3xl md:text-5xl font-light text-primary-container">
            Curated Picks
          </h2>
        </ScrollReveal>
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {items.map((item, i) => {
            const classNames = [
              "md:col-span-12 lg:col-span-8 h-[340px]",
              "md:col-span-6 lg:col-span-4 h-[340px]",
              "md:col-span-6 lg:col-span-4 h-[260px]",
              "md:col-span-6 lg:col-span-4 h-[260px]",
              "md:col-span-12 lg:col-span-4 h-[260px]"
            ];
            
            return (
              <ScrollReveal key={i} direction="up" className={classNames[i]}>
                <div className="relative group cursor-pointer overflow-hidden h-full w-full" style={{ backgroundColor: `hsl(${28 + i * 15}, 22%, ${78 - i * 3}%)` }}>
                  {/* Subtle hover zoom visual */}
                  <div className="absolute inset-0 w-full h-full bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                  <div className="absolute bottom-4 left-4 bg-inverse-on-surface/90 px-4 py-2.5 z-20 shadow-sm transition-transform duration-300 group-hover:-translate-y-1">
                    <p className="font-sans text-sm text-primary-container font-medium">{item.name}</p>
                    <p className="font-sans text-xs text-on-secondary-container mt-0.5">{item.price}</p>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}

export function OurStory() {
  return (
    <section id="our-story" className="py-24 px-6 md:px-16 bg-primary-container">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center">
        <ScrollReveal direction="left" className="relative">
          <img
            src="https://images.unsplash.com/photo-1600335895229-6f755ef92cbf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            alt="Our Story - artisan at work"
            className="w-full h-[400px] md:h-[600px] object-cover object-center"
          />
          <div className="absolute -top-5 -left-5 w-full h-full border border-white/10 pointer-events-none" />
        </ScrollReveal>
        <div>
          <ScrollReveal direction="right" delay={0.15}>
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-on-secondary-container mb-4">
              Our Story
            </p>
          </ScrollReveal>
          <ScrollReveal direction="right" delay={0.3}>
            <h2 className="font-serif text-3xl md:text-5xl font-light text-inverse-on-surface leading-tight mb-7">
              TwoThreads celebrates the art of making.
            </h2>
          </ScrollReveal>
          <ScrollReveal direction="right" delay={0.45}>
            <p className="font-sans text-sm leading-loose text-inverse-on-surface/75 mb-5">
              We partner with makers across the world to bring you golden gut home settings, embroidery kits, and the best in precision crafting. Each piece is carefully woven with love, coming together in the details that matter to us.
            </p>
          </ScrollReveal>
          <ScrollReveal direction="right" delay={0.6}>
            <p className="font-sans text-sm leading-loose text-inverse-on-surface/75 mb-8">
              We are solely committed to the crafts that mean it all. These materials are biodegradable and gentle on the earth.
            </p>
            <button className="bg-on-secondary-container text-inverse-on-surface border-none px-9 py-3.5 font-sans text-sm tracking-[0.15em] uppercase cursor-pointer hover:opacity-90 transition-opacity focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-on-secondary-container outline-none">
              Learn More
            </button>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

export function Reviews() {
  const reviews = [
    { name: "Akemi T.", review: "The quality of TwoThreads kits is unlike anything I've found elsewhere. The thread colors are so rich and the instructions are beautifully clear.", stars: 5 },
    { name: "Sarah M.", review: "I gifted the Botanical Set to my sister and she was moved to tears. Such thoughtful packaging and the design itself is stunning.", stars: 5 },
    { name: "Priya R.", review: "As a beginner I was nervous but the beginner bundle made it so accessible. Now I'm completely hooked on embroidery!", stars: 5 },
  ];

  return (
    <section id="patterns" className="py-24 px-6 md:px-16 bg-inverse-on-surface">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal direction="up" className="text-center mb-12">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-on-secondary-container mb-2">Patterns & Reviews</p>
          <h2 className="font-serif text-3xl md:text-5xl font-light text-primary-container">
            What Our Makers Say
          </h2>
        </ScrollReveal>
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <ScrollReveal key={i} direction="up">
              <div className="bg-white p-8 shadow-sm hover:shadow-md transition-shadow duration-300 border border-outline-variant/30 h-full flex flex-col justify-between">
                <div>
                  <div className="flex gap-1 mb-5">
                    {Array(r.stars).fill(0).map((_, j) => (
                      <span key={j} className="text-on-secondary-container text-sm">★</span>
                    ))}
                  </div>
                  <p className="font-sans text-sm leading-loose text-[#5a4a3f] italic mb-5">
                    "{r.review}"
                  </p>
                </div>
                <p className="font-sans text-xs tracking-wider text-on-secondary-container uppercase">— {r.name}</p>
              </div>
            </ScrollReveal>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

export function Learning() {
  const tutorials = [
    { title: "French Knots for Beginners", duration: "12 min", level: "Beginner", thumbnail: "#c4b5a8", instructor: "Maya Chen" },
    { title: "Satin Stitch Petals", duration: "18 min", level: "Beginner", thumbnail: "#b5a898", instructor: "Lena Park" },
    { title: "Geometric Grid Patterns", duration: "25 min", level: "Intermediate", thumbnail: "#a89888", instructor: "Rosa Kim" },
  ];

  return (
    <section id="learning" className="py-24 px-6 md:px-16 bg-[#ede6de]">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal direction="up" className="text-center mb-4">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-on-secondary-container mb-2">Learning Studio</p>
          <h2 className="font-serif text-3xl md:text-5xl font-light text-primary-container">
            Embroidery Design Tutorials
          </h2>
          <p className="font-sans text-sm text-[#5a4a3f] max-w-2xl mx-auto leading-loose mt-4">
            Learn at your own pace with our curated video tutorials — from first stitches to advanced techniques.
          </p>
        </ScrollReveal>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14">
          {tutorials.map((t, i) => (
            <ScrollReveal key={i} direction="up">
              <div className="bg-white cursor-pointer shadow-sm hover:-translate-y-1.5 hover:shadow-lg transition-all duration-300">
                <div className="h-48 relative overflow-hidden" style={{ backgroundColor: t.thumbnail }}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-inverse-on-surface/90 flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="#2d2520"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-primary-container/85 text-inverse-on-surface font-sans text-[10px] px-2 py-1">
                    {t.duration}
                  </div>
                </div>
                <div className="p-5">
                  <div className="mb-3">
                    <span className="bg-[#e8f4e8] text-[#3a6b3a] text-[10px] tracking-wider px-2 py-1 uppercase font-sans">
                      {t.level}
                    </span>
                  </div>
                  <h3 className="font-serif text-lg font-normal text-primary-container mb-1 leading-snug">
                    {t.title}
                  </h3>
                  <p className="font-sans text-xs text-on-secondary-container">with {t.instructor}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

export function Newsletter() {
  return (
    <section className="py-20 px-6 md:px-16 bg-primary-container text-center">
      <ScrollReveal direction="up">
        <p className="font-sans text-xs tracking-[0.3em] uppercase text-on-secondary-container mb-4">
          Stay Connected
        </p>
        <h2 className="font-serif text-3xl md:text-4xl font-light text-inverse-on-surface mb-4">
          Join the TwoThreads Community
        </h2>
        <p className="font-sans text-sm text-inverse-on-surface/65 mb-10 max-w-lg mx-auto leading-loose">
          Get early access to new patterns, tutorial releases, and exclusive member discounts.
        </p>
        <div className="flex max-w-md mx-auto justify-center">
          <input 
            type="email" 
            placeholder="Your email address" 
            aria-label="Your email address"
            className="flex-1 min-w-[200px] px-5 py-3.5 bg-inverse-on-surface/10 border border-inverse-on-surface/20 text-inverse-on-surface font-sans text-sm outline-none border-r-0 focus:border-on-secondary-container"
          />
          <button className="bg-on-secondary-container text-inverse-on-surface border border-on-secondary-container px-8 py-3.5 font-sans text-sm tracking-wider uppercase cursor-pointer hover:opacity-90 transition-opacity outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-on-secondary-container">
            Subscribe
          </button>
        </div>
      </ScrollReveal>
    </section>
  );
}
