import React from 'react';
import { Link } from 'react-router-dom';
import { ScrollReveal } from '../ui/ScrollReveal';
import { motion } from 'framer-motion';
import { ArrowRight, Paintbrush2, Sparkles } from 'lucide-react';
import hoopImg from '../../assets/stitch/a_beautifully_finished_embroidery_piece_displayed_in_a_wooden_hoop_featuring_an.png';

const customTypes = [
  { label: 'Portrait Embroidery', icon: '🎨' },
  { label: 'Pet Portraits', icon: '🐾' },
  { label: 'Wedding Gifts', icon: '💍' },
  { label: 'Family Embroidery', icon: '🌸' },
  { label: 'Name Hoops', icon: '✍️' },
];

export default function CustomCreations() {
  return (
    <section className="relative overflow-hidden min-h-[520px] md:min-h-[620px] flex items-center">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src={hoopImg}
          alt="Custom embroidery creation"
          className="w-full h-full object-cover object-center"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1C1C1B]/90 via-[#1C1C1B]/65 to-[#1C1C1B]/20 md:from-[#1C1C1B]/85 md:via-[#1C1C1B]/50 md:to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-16 w-full py-20">
        <div className="max-w-xl">
          <ScrollReveal direction="right">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={14} className="text-[#c4973a]" />
              <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#c4973a] font-medium">
                Custom Creations
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={0.15}>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-white leading-tight mb-5">
              Made <em>Just</em> <br />for You
            </h2>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={0.28}>
            <p className="font-sans text-sm text-white/75 leading-relaxed mb-8 max-w-md">
              Turn your most treasured memories into handcrafted art. Each custom piece is lovingly
              stitched by our master artisans — a gift unlike anything else.
            </p>
          </ScrollReveal>

          {/* Custom type tags */}
          <ScrollReveal direction="right" delay={0.4}>
            <div className="flex flex-wrap gap-2 mb-10">
              {customTypes.map((type) => (
                <span
                  key={type.label}
                  className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-sans text-[10px] tracking-[0.12em] uppercase px-3 py-1.5 hover:bg-white/20 transition-colors duration-200 cursor-default"
                >
                  <span className="text-xs">{type.icon}</span>
                  {type.label}
                </span>
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={0.52}>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/shop?type=custom"
                className="inline-flex items-center justify-center gap-2 bg-[#f4ebd9] text-[#1C1C1B] px-8 py-3.5 font-sans text-[10px] tracking-[0.18em] uppercase font-medium hover:bg-white transition-colors duration-200 no-underline"
              >
                <Paintbrush2 size={13} />
                Start Your Custom Order
              </Link>
              <Link
                to="/shop?type=custom"
                className="inline-flex items-center justify-center gap-2 border border-white/40 text-white px-8 py-3.5 font-sans text-[10px] tracking-[0.18em] uppercase hover:border-white/70 transition-colors duration-200 no-underline"
              >
                See Examples <ArrowRight size={13} />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Decorative side accent */}
      <motion.div
        className="absolute right-12 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-3 opacity-30"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.3 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, delay: 0.5 }}
      >
        <div className="w-px h-16 bg-white" />
        <p className="font-sans text-[9px] tracking-[0.3em] uppercase text-white rotate-90 whitespace-nowrap">
          Bespoke · Handcrafted · Yours
        </p>
        <div className="w-px h-16 bg-white" />
      </motion.div>
    </section>
  );
}
