import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ScrollReveal } from '../ui/ScrollReveal';
import { Leaf, Award, Recycle, ArrowRight } from 'lucide-react';

const sustainabilityPoints = [
  {
    icon: <Leaf className="text-[#606f5c]" size={20} strokeWidth={1.5} />,
    title: 'Unbleached Belgian Linen',
    desc: 'Woven in a carbon-neutral mill using five generations of expertise. We leave it unbleached to avoid local watershed contamination.',
  },
  {
    icon: <Award className="text-[#606f5c]" size={20} strokeWidth={1.5} />,
    title: 'FSC-Certified Beechwood',
    desc: 'Our embroidery hoops are crafted from European beechwood. They are hand-sanded and free from synthetic varnishes.',
  },
  {
    icon: <Recycle className="text-[#606f5c]" size={20} strokeWidth={1.5} />,
    title: '100% Plastic-Free',
    desc: 'From our recycled post-consumer thread cards to vegetable-based ink prints, not a single piece of plastic is used.',
  },
];

export default function SustainabilitySection() {
  return (
    <section className="py-20 sm:py-24 px-4 sm:px-6 md:px-16 bg-[#F8F7F5] border-t border-b border-outline-variant/10">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
        
        {/* Left Side: Editorial Content */}
        <div className="w-full lg:w-5/12 flex flex-col items-start text-left">
          <ScrollReveal direction="left">
            <span className="font-sans text-[10px] sm:text-xs tracking-[0.3em] uppercase text-[#A34A38] mb-4 font-semibold block">
              Conscious Crafting
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-primary-container leading-[1.25] mb-6">
              Earth-first materials, stitched with intent.
            </h2>
            <p className="font-sans text-xs sm:text-sm text-[#5a4a3f] leading-loose mb-8">
              We believe crafting should leave a mark on your soul, not on the planet. Through ethical supply chains and hand-selected natural materials, we balance the beauty of handmade textiles with an active commitment to environmental preservation.
            </p>
            <Link
              to="/sustainability"
              className="inline-flex items-center gap-2 bg-[#A34A38] text-white px-8 py-3.5 font-sans text-xs tracking-widest uppercase hover:bg-[#83382a] transition-all cursor-pointer rounded-sm shadow-sm font-semibold no-underline"
            >
              Our Impact Standards <ArrowRight size={14} />
            </Link>
          </ScrollReveal>
        </div>

        {/* Right Side: Highlight Cards */}
        <div className="w-full lg:w-7/12">
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-6">
            {sustainabilityPoints.map((point, index) => (
              <ScrollReveal key={index} direction="right" delay={index * 0.1}>
                <motion.div
                  className="bg-white border border-neutral-200/60 p-6 md:p-8 rounded-sm shadow-sm hover:shadow-md hover:border-neutral-300 transition-all duration-300 flex flex-col lg:flex-row items-start gap-6 group"
                  whileHover={{ y: -3 }}
                >
                  {/* Icon wrap */}
                  <div className="w-12 h-12 rounded-full bg-[#f1f3f0] flex items-center justify-center flex-shrink-0 transition-colors group-hover:bg-[#e4ebd9]">
                    {point.icon}
                  </div>
                  
                  {/* Content */}
                  <div>
                    <h3 className="font-serif text-xl font-normal text-primary-container mb-2 group-hover:text-[#A34A38] transition-colors">
                      {point.title}
                    </h3>
                    <p className="font-sans text-xs md:text-sm text-[#5a4a3f]/95 leading-relaxed">
                      {point.desc}
                    </p>
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
