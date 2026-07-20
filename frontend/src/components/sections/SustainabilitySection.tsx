import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ScrollReveal } from '../ui/ScrollReveal';
import { Leaf, Award, Recycle, ArrowRight } from 'lucide-react';

const sustainabilityPoints = [
  {
    icon: <Leaf size={18} strokeWidth={1.5} />,
    title: 'Unbleached Belgian Linen',
    desc: 'Carbon-neutral woven linen from a five-generation mill.',
    fullDesc: 'Woven in a carbon-neutral mill using five generations of expertise. We leave it unbleached to avoid local watershed contamination.',
  },
  {
    icon: <Award size={18} strokeWidth={1.5} />,
    title: 'FSC-Certified Beechwood',
    desc: 'Natural untreated European beechwood hoops.',
    fullDesc: 'Our embroidery hoops are crafted from European beechwood. They are hand-sanded and free from synthetic varnishes.',
  },
  {
    icon: <Recycle size={18} strokeWidth={1.5} />,
    title: '100% Plastic-Free',
    desc: 'Vegetable-based packaging without plastics.',
    fullDesc: 'From our recycled post-consumer thread cards to vegetable-based ink prints, not a single piece of plastic is used.',
  },
];

export default function SustainabilitySection() {
  return (
    <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 md:px-16 bg-[#F8F7F5] border-t border-b border-outline-variant/10">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 md:gap-12 lg:gap-16 items-start">
        
        {/* Left Side: Editorial Content */}
        <div className="w-full lg:w-5/12 flex flex-col items-start text-left">
          <ScrollReveal direction="left">
            <span className="font-sans text-[10px] sm:text-xs tracking-[0.3em] uppercase text-[#A34A38] mb-3 sm:mb-4 font-semibold block">
              Conscious Crafting
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-primary-container leading-[1.2] sm:leading-[1.25] mb-4 sm:mb-6">
              Earth-first materials, <br className="hidden sm:block" />
              stitched with intent.
            </h2>
            <p className="font-sans text-xs sm:text-sm text-[#5a4a3f] leading-relaxed sm:leading-loose mb-6 sm:mb-8">
              We believe crafting should leave a mark on your soul, not on the planet. Through ethical supply chains and hand-selected natural materials, we balance the beauty of handmade textiles with an active commitment to environmental preservation.
            </p>
            
            {/* Desktop CTA - Hidden on mobile, shown on larger screens */}
            <Link
              to="/sustainability"
              className="hidden sm:inline-flex items-center justify-center gap-2 bg-[#A34A38] text-white px-6 sm:px-8 py-3 sm:py-3.5 font-sans text-[10px] sm:text-xs tracking-widest uppercase hover:bg-[#83382a] transition-all cursor-pointer rounded-sm shadow-sm font-semibold no-underline"
            >
              Our Impact Standards <ArrowRight size={14} />
            </Link>
          </ScrollReveal>
        </div>

        {/* Right Side: Compact Feature Rows - Mobile Optimized */}
        <div className="w-full lg:w-7/12">
          <div className="space-y-2 sm:space-y-3 md:space-y-4">
            {sustainabilityPoints.map((point, index) => (
              <ScrollReveal key={index} direction="right" delay={index * 0.08}>
                <motion.div
                  className="group flex items-start gap-3 sm:gap-4 md:gap-6 p-3 sm:p-4 md:p-6 lg:p-8 bg-white border border-neutral-200/60 rounded-sm hover:border-neutral-300 transition-all duration-300 hover:shadow-sm"
                  whileHover={{ x: 4 }}
                >
                  {/* Compact Icon - Smaller on mobile */}
                  <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-[#f1f3f0] flex items-center justify-center transition-colors group-hover:bg-[#e4ebd9]">
                    <span className="text-[#606f5c]">
                      {React.cloneElement(point.icon, {
                        size: window.innerWidth < 640 ? 16 : 18,
                        className: "text-[#606f5c]"
                      })}
                    </span>
                  </div>
                  
                  {/* Content - Compact on mobile */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif text-base sm:text-lg md:text-xl font-normal text-primary-container mb-0.5 sm:mb-1 group-hover:text-[#A34A38] transition-colors">
                      {point.title}
                    </h3>
                    {/* Short description on mobile, full description on larger screens */}
                    <p className="font-sans text-xs sm:text-sm text-[#5a4a3f]/95 leading-relaxed hidden sm:block">
                      {point.fullDesc}
                    </p>
                    <p className="font-sans text-xs text-[#5a4a3f]/95 leading-relaxed sm:hidden">
                      {point.desc}
                    </p>
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
            
            {/* Mobile CTA - Shown below cards on mobile */}
            <ScrollReveal direction="up" delay={0.2}>
              <Link
                to="/sustainability"
                className="sm:hidden w-full inline-flex items-center justify-center gap-2 bg-[#A34A38] text-white px-6 py-3.5 font-sans text-[10px] tracking-widest uppercase hover:bg-[#83382a] transition-all cursor-pointer rounded-sm shadow-sm font-semibold no-underline mt-2"
              >
                Our Impact Standards <ArrowRight size={14} />
              </Link>
            </ScrollReveal>
          </div>
        </div>

      </div>
    </section>
  );
}