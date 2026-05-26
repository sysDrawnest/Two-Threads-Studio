import React, { useEffect, useRef } from 'react';
import miniWillowBat from '../assets/mini_willow_bat.png';
import leatherCricketBall from '../assets/leather_cricket_ball.png';
import wicketStumpsTrio from '../assets/wicket_stumps_trio.png';
import embroideredCrest from '../assets/embroidered_crest.png';

const CricketKeychains: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Parallax effect on header text
        const handleMouseMove = (e: MouseEvent) => {
            if (!containerRef.current) return;
            const moveX = (e.clientX - window.innerWidth / 2) * 0.005;
            const moveY = (e.clientY - window.innerHeight / 2) * 0.005;
            const headers = containerRef.current.querySelectorAll('h1, h2');
            headers.forEach(header => {
                (header as HTMLElement).style.transform = `translate(${moveX}px, ${moveY}px)`;
            });
        };

        window.addEventListener('mousemove', handleMouseMove);

        // Intersection Observer for card fade-in animations
        const observerOptions = {
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('opacity-100', 'translate-y-0');
                    entry.target.classList.remove('opacity-0', 'translate-y-10');
                }
            });
        }, observerOptions);

        const articles = containerRef.current?.querySelectorAll('article');
        if (articles) {
            articles.forEach(el => {
                el.classList.add('opacity-0', 'translate-y-10', 'transition-all', 'duration-700');
                observer.observe(el);
            });
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            if (observer && articles) {
                articles.forEach(el => {
                    observer.unobserve(el);
                });
            }
        };
    }, []);

    return (
        <div ref={containerRef} className="linen-bg">
            {/* Editorial Header Section */}
            <section className="max-w-[1440px] mx-auto px-margin-desktop pt-section-gap pb-gutter text-center">
                <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm mb-6 tracking-widest">
                    Cricket Lover’s Keychains
                </div>
                <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto italic">
                    Each piece tells a story of patience, precision, and passion for the game. Crafted by hand in our sun-drenched atelier.
                </p>
                <div className="w-24 h-px bg-outline-variant mx-auto mt-12 stitch-divider"></div>
            </section>

            {/* Product Grid Section */}
            <section className="max-w-[1440px] mx-auto px-margin-desktop py-gutter">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
                    {/* Product 1: Mini Willow Bat */}
                    <article className="group hover-card transition-all duration-500 ease-out bg-surface-container-lowest rounded-lg overflow-hidden">
                        <div className="relative aspect-square overflow-hidden bg-surface-container">
                            <img
                                alt="Mini Willow Bat Keychain"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                src={miniWillowBat}
                            />
                            <span className="absolute top-4 left-4 font-label-sm text-label-sm bg-background/90 px-3 py-1 rounded-sm border border-dashed border-outline-variant">
                                Handmade
                            </span>
                        </div>
                        <div className="p-gutter flex flex-col items-center text-center">
                            <h3 className="font-headline-md text-headline-md text-primary mb-1">
                                Mini Willow Bat
                            </h3>
                            <p className="font-label-sm text-label-sm text-on-surface-variant mb-4 tracking-tighter uppercase italic">
                                Carved Maple • Engraved Stitching
                            </p>
                            <span className="font-headline-md text-[20px] text-secondary mb-6">
                                $45.00
                            </span>
                            <button className="w-full py-3 px-6 rounded-full bg-secondary text-on-secondary font-label-sm text-label-sm tracking-widest hover:bg-primary transition-colors duration-300 active:scale-95">
                                ADD TO CART
                            </button>
                        </div>
                    </article>

                    {/* Product 2: Leather Cricket Ball */}
                    <article className="group hover-card transition-all duration-500 ease-out bg-surface-container-lowest rounded-lg overflow-hidden">
                        <div className="relative aspect-square overflow-hidden bg-surface-container">
                            <img
                                alt="Leather Cricket Ball Keychain"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                src={leatherCricketBall}
                            />
                            <span className="absolute top-4 left-4 font-label-sm text-label-sm bg-tertiary-fixed text-on-tertiary-fixed px-3 py-1 rounded-sm border border-dashed border-on-tertiary-fixed/20">
                                Limited Edition
                            </span>
                        </div>
                        <div className="p-gutter flex flex-col items-center text-center">
                            <h3 className="font-headline-md text-headline-md text-primary mb-1">
                                Leather Cricket Ball
                            </h3>
                            <p className="font-label-sm text-label-sm text-on-surface-variant mb-4 tracking-tighter uppercase italic">
                                Genuine Leather • Hand-painted Seam
                            </p>
                            <span className="font-headline-md text-[20px] text-secondary mb-6">
                                $38.00
                            </span>
                            <button className="w-full py-3 px-6 rounded-full bg-secondary text-on-secondary font-label-sm text-label-sm tracking-widest hover:bg-primary transition-colors duration-300 active:scale-95">
                                ADD TO CART
                            </button>
                        </div>
                    </article>

                    {/* Product 3: Wicket Stumps Trio */}
                    <article className="group hover-card transition-all duration-500 ease-out bg-surface-container-lowest rounded-lg overflow-hidden">
                        <div className="relative aspect-square overflow-hidden bg-surface-container">
                            <img
                                alt="Wicket Stumps Trio"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                src={wicketStumpsTrio}
                            />
                            <span className="absolute top-4 left-4 font-label-sm text-label-sm bg-surface-bright text-primary px-3 py-1 rounded-sm border border-dashed border-outline-variant">
                                New Arrival
                            </span>
                        </div>
                        <div className="p-gutter flex flex-col items-center text-center">
                            <h3 className="font-headline-md text-headline-md text-primary mb-1">
                                Wicket Stumps Trio
                            </h3>
                            <p className="font-label-sm text-label-sm text-on-surface-variant mb-4 tracking-tighter uppercase italic">
                                Polished Wood • Jute Binding
                            </p>
                            <span className="font-headline-md text-[20px] text-secondary mb-6">
                                $42.00
                            </span>
                            <button className="w-full py-3 px-6 rounded-full bg-secondary text-on-secondary font-label-sm text-label-sm tracking-widest hover:bg-primary transition-colors duration-300 active:scale-95">
                                ADD TO CART
                            </button>
                        </div>
                    </article>

                    {/* Product 4: Embroidered Crest */}
                    <article className="group hover-card transition-all duration-500 ease-out bg-surface-container-lowest rounded-lg overflow-hidden">
                        <div className="relative aspect-square overflow-hidden bg-surface-container">
                            <img
                                alt="Embroidered Cricket Crest Keychain"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                src={embroideredCrest}
                            />
                            <span className="absolute top-4 left-4 font-label-sm text-label-sm bg-secondary-fixed text-on-secondary-fixed px-3 py-1 rounded-sm border border-dashed border-on-secondary-fixed/20">
                                Artisan Made
                            </span>
                        </div>
                        <div className="p-gutter flex flex-col items-center text-center">
                            <h3 className="font-headline-md text-headline-md text-primary mb-1">
                                Embroidered Crest
                            </h3>
                            <p className="font-label-sm text-label-sm text-on-surface-variant mb-4 tracking-tighter uppercase italic">
                                Gold Thread • Navy Embroidery
                            </p>
                            <span className="font-headline-md text-[20px] text-secondary mb-6">
                                $32.00
                            </span>
                            <button className="w-full py-3 px-6 rounded-full bg-secondary text-on-secondary font-label-sm text-label-sm tracking-widest hover:bg-primary transition-colors duration-300 active:scale-95">
                                ADD TO CART
                            </button>
                        </div>
                    </article>
                </div>
            </section>

            {/* Artisanal Details Section */}
            <section className="max-w-[1440px] mx-auto px-margin-desktop py-section-gap grid grid-cols-1 md:grid-cols-3 gap-gutter text-center border-t border-dashed border-outline-variant mt-section-gap">
                <div className="flex flex-col items-center">
                    <span className="material-symbols-outlined text-[40px] text-secondary mb-4">
                        auto_awesome
                    </span>
                    <h4 className="font-headline-md text-[24px] text-primary mb-2">
                        Heritage Craft
                    </h4>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                        Traditional techniques passed down through generations of artisans.
                    </p>
                </div>
                <div className="flex flex-col items-center">
                    <span className="material-symbols-outlined text-[40px] text-secondary mb-4">
                        nature
                    </span>
                    <h4 className="font-headline-md text-[24px] text-primary mb-2">
                        Sustainably Sourced
                    </h4>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                        Ethically harvested English willow and premium vegetable-tanned leathers.
                    </p>
                </div>
                <div className="flex flex-col items-center">
                    <span className="material-symbols-outlined text-[40px] text-secondary mb-4">
                        history_edu
                    </span>
                    <h4 className="font-headline-md text-[24px] text-primary mb-2">
                        Bespoke Stories
                    </h4>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                        Each item is numbered and signed by the master craftsman who finished it.
                    </p>
                </div>
            </section>
        </div>
    );
};

export default CricketKeychains;