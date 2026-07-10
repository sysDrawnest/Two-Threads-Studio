import React from 'react';
import { motion } from 'framer-motion';
import { ScrollReveal } from '../ui/ScrollReveal';
import { Pencil, Scissors, CheckCircle2, Package, MapPin } from 'lucide-react';

const steps = [
  {
    icon: <Pencil size={22} strokeWidth={1.5} />,
    title: 'Design',
    desc: 'Every piece begins with thoughtful sketches and colour studies by our in-house artisans.',
    number: '01',
  },
  {
    icon: <Scissors size={22} strokeWidth={1.5} />,
    title: 'Handcrafted',
    desc: 'Stitched, knotted, or sculpted by hand using premium sustainable materials.',
    number: '02',
  },
  {
    icon: <CheckCircle2 size={22} strokeWidth={1.5} />,
    title: 'Quality Check',
    desc: 'Each piece is inspected to ensure it meets our exacting standards of beauty.',
    number: '03',
  },
  {
    icon: <Package size={22} strokeWidth={1.5} />,
    title: 'Packaging',
    desc: 'Wrapped in recycled paper and ribbon — gift-ready from the moment it arrives.',
    number: '04',
  },
  {
    icon: <MapPin size={22} strokeWidth={1.5} />,
    title: 'Delivered',
    desc: 'Shipped with care directly to your door, anywhere in India.',
    number: '05',
  },
];

export default function CraftingProcess() {
  return (
    <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-16 bg-[#fef8f3]">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <ScrollReveal direction="up" className="text-center mb-12 md:mb-16">
          <p className="font-sans text-[10px] sm:text-xs tracking-[0.3em] uppercase text-[#A34A38] mb-2 font-medium">
            Our Process
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-[#1C1C1B]">
            Crafted with Intention
          </h2>
          <p className="font-sans text-xs sm:text-sm text-neutral-500 mt-3 max-w-md mx-auto">
            From the first sketch to your doorstep — every step is handled with care.
          </p>
        </ScrollReveal>

        {/* Desktop horizontal timeline */}
        <div className="hidden md:block relative">
          {/* Connecting line */}
          <div className="absolute top-[42px] left-0 right-0 h-px bg-[#d2c4bc]" />

          <div className="grid grid-cols-5 gap-4">
            {steps.map((step, i) => (
              <ScrollReveal key={step.number} direction="up" delay={0.1 * i}>
                <div className="flex flex-col items-center text-center">
                  {/* Icon circle with number */}
                  <div className="relative mb-6">
                    <motion.div
                      className="w-[84px] h-[84px] rounded-full bg-white border border-[#d2c4bc] flex items-center justify-center shadow-sm group-hover:shadow-md text-[#735947] relative z-10"
                      whileHover={{ scale: 1.05, borderColor: '#A34A38' }}
                      transition={{ duration: 0.2 }}
                    >
                      {step.icon}
                    </motion.div>
                    <span className="absolute -top-1.5 -right-1 font-sans text-[9px] tracking-wider text-[#A34A38] font-medium bg-[#fef8f3] px-1 z-20">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="font-serif text-lg font-light text-[#1C1C1B] mb-2">
                    {step.title}
                  </h3>
                  <p className="font-sans text-[11px] text-neutral-500 leading-relaxed max-w-[140px] mx-auto">
                    {step.desc}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        {/* Mobile vertical timeline */}
        <div className="md:hidden space-y-0">
          {steps.map((step, i) => (
            <ScrollReveal key={step.number} direction="left" delay={0.08 * i}>
              <div className="flex gap-5 pb-8 last:pb-0">
                {/* Left: icon + vertical line */}
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-white border border-[#d2c4bc] flex items-center justify-center text-[#735947] shadow-sm">
                    {step.icon}
                  </div>
                  {i < steps.length - 1 && (
                    <div className="w-px flex-1 bg-[#d2c4bc] mt-2 min-h-[40px]" />
                  )}
                </div>
                {/* Right: content */}
                <div className="pt-2 pb-4">
                  <p className="font-sans text-[9px] tracking-[0.15em] text-[#A34A38] uppercase mb-1">
                    {step.number}
                  </p>
                  <h3 className="font-serif text-xl font-light text-[#1C1C1B] mb-1.5">
                    {step.title}
                  </h3>
                  <p className="font-sans text-xs text-neutral-500 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
