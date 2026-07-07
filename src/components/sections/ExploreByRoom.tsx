import React from 'react';
import { ScrollReveal } from '../ui/ScrollReveal';
import roomImg1 from '../../assets/stitch/a_high_end_editorial_photo_of_a_minimalist_living_room_featuring_framed_hand.png';
import roomImg2 from '../../assets/stitch/a_high_end_editorial_photo_of_a_serene_bathroom_setting_featuring_delicate.png';
import roomImg3 from '../../assets/stitch/a_high_end_editorial_photo_of_a_cozy_bedroom_featuring_an_embroidered.png';

export default function ExploreByRoom() {
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
                <a href="#collections" className="inline-flex items-center font-sans text-[14px] uppercase tracking-[0.15em] font-medium border-b border-primary-container pb-1 group-hover:text-secondary group-hover:border-secondary transition-colors no-underline text-primary-container">
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
