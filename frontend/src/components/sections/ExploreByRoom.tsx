import React from 'react';
import { ScrollReveal } from '../ui/ScrollReveal';
import roomImg1 from '../../assets/stitch/a_high_end_editorial_photo_of_a_minimalist_living_room_featuring_framed_hand.png';
import roomImg2 from '../../assets/stitch/a_high_end_editorial_photo_of_a_serene_bathroom_setting_featuring_delicate.png';
import roomImg3 from '../../assets/stitch/a_high_end_editorial_photo_of_a_cozy_bedroom_featuring_an_embroidered.png';

const rooms = [
  {
    name: 'Living Room',
    desc: 'Framed hoops and wall hangings that bring warmth and texture to your walls and shelves.',
    img: roomImg1,
    link: '/shop?room=living-room',
  },
  {
    name: 'Bedroom',
    desc: 'Pillowcase embroideries, dream-catcher wall art, and slow-stitch pieces for restful rooms.',
    img: roomImg3,
    link: '/shop?room=bedroom',
  },
  {
    name: 'Dining',
    desc: 'Table runners, embroidered napkins, and macramé accents for beautiful tablescapes.',
    img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=800&auto=format&fit=crop',
    link: '/shop?room=dining',
  },
  {
    name: 'Workspace',
    desc: 'Motivational hoops, desk accessories, and artisan organizers for a creative studio.',
    img: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?q=80&w=800&auto=format&fit=crop',
    link: '/shop?room=workspace',
  },
  {
    name: 'Entryway',
    desc: 'Statement wall art and macramé hangings that welcome guests with handmade warmth.',
    img: roomImg2,
    link: '/shop?room=entryway',
  },
  {
    name: "Kids' Room",
    desc: 'Whimsical embroidered art, name hoops, and playful crochet accents for little spaces.',
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800&auto=format&fit=crop',
    link: '/shop?room=kids-room',
  },
];

export default function ExploreByRoom() {
  return (
    <section id="collections" className="py-24 px-6 md:px-16 bg-[#ede6de]">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal direction="up" className="text-center mb-14">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-on-secondary-container mb-2">
            Explore by Room
          </p>
          <h2 className="font-serif text-3xl md:text-5xl font-light text-primary-container mb-6">
            Stitch Every Corner
          </h2>
          <div className="md:hidden border-t border-dotted border-outline-variant max-w-[80px] mx-auto" />
        </ScrollReveal>

        {/* Mobile View */}
        <div className="md:hidden space-y-16">
          {rooms.map((room, i) => (
            <ScrollReveal key={i} direction="up" className="group">
              <div className="aspect-[4/5] overflow-hidden bg-surface-container-low mb-6">
                <img
                  src={room.img}
                  alt={room.name}
                  loading="lazy"
                  className="w-full h-full object-cover grayscale-[20%] group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
              <div className="space-y-4">
                <h3 className="font-serif text-[28px] text-primary-container">{room.name}</h3>
                <p className="font-sans text-base text-[#4e4540] leading-relaxed">{room.desc}</p>
                <a
                  href={room.link}
                  className="inline-flex items-center font-sans text-[14px] uppercase tracking-[0.15em] font-medium border-b border-primary-container pb-1 group-hover:text-secondary group-hover:border-secondary transition-colors no-underline text-primary-container"
                >
                  Shop {room.name}
                  <svg className="ml-2" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M5 12h14m-7-7l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Desktop View */}
        <div className="hidden md:block">
          {rooms.map((room, i) => (
            <div key={i} className="grid grid-cols-2 gap-8 mb-16 items-center">
              {i % 2 !== 0 && (
                <ScrollReveal direction="left" className="hidden md:block">
                  <div className="aspect-[4/5] overflow-hidden">
                    <img
                      src={room.img}
                      alt={room.name}
                      loading="lazy"
                      className="w-full h-full object-cover grayscale-[10%] hover:scale-[1.03] transition-transform duration-700 ease-out"
                    />
                  </div>
                </ScrollReveal>
              )}
              <ScrollReveal direction={i % 2 === 0 ? 'left' : 'right'} className="p-4">
                <p className="font-sans text-[10px] tracking-[0.25em] uppercase text-[#A34A38] mb-3">
                  {String(i + 1).padStart(2, '0')} / {String(rooms.length).padStart(2, '0')}
                </p>
                <h3 className="font-serif text-2xl md:text-4xl font-light text-primary-container mb-4">
                  {room.name}
                </h3>
                <p className="font-sans text-sm leading-relaxed text-[#5a4a3f] mb-6">{room.desc}</p>
                <a
                  href={room.link}
                  className="inline-block bg-transparent text-primary-container border border-primary-container px-7 py-3 font-sans text-xs tracking-[0.15em] uppercase cursor-pointer hover:bg-primary-container hover:text-inverse-on-surface transition-colors no-underline"
                >
                  Shop {room.name}
                </a>
              </ScrollReveal>
              {i % 2 === 0 && (
                <ScrollReveal direction="right" className="hidden md:block">
                  <div className="aspect-[4/5] overflow-hidden">
                    <img
                      src={room.img}
                      alt={room.name}
                      loading="lazy"
                      className="w-full h-full object-cover grayscale-[10%] hover:scale-[1.03] transition-transform duration-700 ease-out"
                    />
                  </div>
                </ScrollReveal>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
