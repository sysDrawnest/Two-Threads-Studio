import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ScrollReveal } from '../ui/ScrollReveal';
import { Leaf, Award, Recycle, ArrowRight } from 'lucide-react';

const sustainabilityPoints = [
  {
    icon: <Leaf className="text-[#606f5c]" size={18} strokeWidth={1.5} />,
    title: 'Unbleached Belgian Linen',
    desc: 'Woven in a carbon-neutral mill using five generations of expertise. We leave it unbleached to avoid local watershed contamination.',
  },
  {
    icon: <Award className="text-[#606f5c]" size={18} strokeWidth={1.5} />,
    title: 'FSC-Certified Beechwood',
    desc: 'Our embroidery hoops are crafted from European beechwood. They are hand-sanded and free from synthetic varnishes.',
  },
  {
    icon: <Recycle className="text-[#606f5c]" size={18} strokeWidth={1.5} />,
    title: '100% Plastic-Free',
    desc: 'From our recycled post-consumer thread cards to vegetable-based ink prints, not a single piece of plastic is used.',
  },
];

export default function SustainabilitySection() {
  return (
    <section className="py-12 md:py-24 px-4 md:px-16 bg-[#F8F7F5] border-t border-b border-outline-variant/10">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10 md:gap-16 items-start lg:items-center">
        
        {/* Left Side: Editorial Content */}
        <div className="w-full lg:w-5/12 flex flex-col items-start text-left">
          <ScrollReveal direction="left">
            <span className="font-sans text-[10px] sm:text-xs tracking-[0.3em] uppercase text-[#A34A38] mb-3 md:mb-4 font-semibold block">
              Conscious Crafting
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-5xl font-light text-primary-container leading-[1.2] md:leading-[1.25] mb-3 md:mb-6">
              Earth-first materials, stitched with intent.
            </h2>
            <p className="font-sans text-xs sm:text-sm text-[#5a4a3f] leading-relaxed md:leading-loose mb-6 md:mb-8">
              We believe crafting should leave a mark on your soul, not on the planet. Through ethical supply chains and hand-selected natural materials, we balance the beauty of handmade textiles with an active commitment to environmental preservation.
            </p>
            <Link
              to="/sustainability"
              className="inline-flex items-center justify-center gap-2 w-full md:w-auto bg-[#A34A38] text-white px-6 md:px-8 py-3 md:py-3.5 font-sans text-[10px] sm:text-xs tracking-widest uppercase hover:bg-[#83382a] transition-all cursor-pointer rounded-sm shadow-sm font-semibold no-underline"
            >
              Our Impact Standards <ArrowRight size={14} />
            </Link>
          </ScrollReveal>
        </div>

        {/* Right Side: Highlight Cards */}
        <div className="w-full lg:w-7/12">
          <div className="grid grid-cols-1 gap-3 md:gap-4 lg:gap-6">
            {sustainabilityPoints.map((point, index) => (
              <ScrollReveal key={index} direction="right" delay={index * 0.1}>
                <motion.div
                  className="bg-white border border-neutral-200/60 p-4 md:p-6 lg:p-8 rounded-sm shadow-sm hover:shadow-md hover:border-neutral-300 transition-all duration-300 flex flex-col sm:flex-row items-start gap-4 md:gap-6 group"
                  whileHover={{ y: -3 }}
                >
                  {/* Icon wrap - smaller on mobile */}
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#f1f3f0] flex items-center justify-center flex-shrink-0 transition-colors group-hover:bg-[#e4ebd9]">
                    {point.icon}
                  </div>
                  
                  {/* Content - tighter on mobile */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif text-base sm:text-xl font-normal text-primary-container mb-1 sm:mb-2 group-hover:text-[#A34A38] transition-colors">
                      {point.title}
                    </h3>
                    <p className="font-sans text-xs sm:text-sm text-[#5a4a3f]/95 leading-relaxed">
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