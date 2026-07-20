import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { ScrollReveal } from '../ui/ScrollReveal';

// Assets
import craftImg from '../../assets/Embroidery_hoop,_pencil,_thread_2K_202607100702.jpeg';
import portraitImg from '../../assets/portrait_of_personalized_portraits_for_a_luxur.png';
import weddingImg from '../../assets/portrait_of_wedding_keepsakes_for_a_luxury_em.png';
import heritageImg from '../../assets/portrait_of_a_heritage_collection_for_a_luxury.png';

const examples = [
  { title: 'Portrait', image: portraitImg },
  { title: 'Wedding Keepsakes', image: weddingImg },
  { title: 'Pet Memories', image: heritageImg }, // using heritage as placeholder for pets or family
];

export default function CustomCreations() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);

  return (
    <section className="bg-primary-container py-16 md:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-16">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-center">
          
          {/* Mobile Only: Hero Image (Full Bleed logic via negative margins) */}
          <div className="md:hidden -mx-6 mb-8 relative h-[350px] overflow-hidden">
             <motion.img 
               style={{ scale: imgScale }}
               src={craftImg} 
               alt="Embroidery craftsmanship" 
               className="w-full h-full object-cover"
             />
          </div>

          {/* Text Narrative (Left Column on Desktop) */}
          <div className="md:col-span-5 flex flex-col justify-center">
            <ScrollReveal direction="up">
              <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl font-light text-inverse-on-surface leading-[1.1] mb-6">
                Commission <br className="hidden md:block" />a Piece
              </h2>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.1}>
              <div className="mb-8 font-sans text-xs md:text-sm tracking-[0.2em] text-inverse-on-surface/60 uppercase leading-loose">
                <p>One photograph.</p>
                <p>One artisan.</p>
                <p>Weeks of craftsmanship.</p>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.2}>
              <p className="font-sans text-sm text-inverse-on-surface/75 leading-relaxed mb-10 max-w-sm">
                <strong className="block mb-4 text-inverse-on-surface font-medium">Every stitch carries a memory.</strong>
                Whether it's the smile of someone you love, a wedding day, or the quiet companionship of a beloved pet, our artisans transform photographs into heirloom embroidery designed to last for generations.
              </p>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.3}>
              <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start sm:items-center">
                <Link 
                  to="/shop?type=custom"
                  className="group flex items-center gap-3 font-sans text-[11px] tracking-[0.2em] uppercase text-inverse-on-surface hover:text-[#A34A38] transition-colors"
                >
                  <span className="border-b border-inverse-on-surface/30 group-hover:border-[#A34A38] pb-1 transition-colors">
                    Begin Your Commission
                  </span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <Link 
                  to="/gallery"
                  className="font-sans text-[10px] tracking-[0.15em] uppercase text-inverse-on-surface/50 hover:text-inverse-on-surface transition-colors"
                >
                  Browse Past Creations
                </Link>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column: Visual Journey (Desktop Only) */}
          <div className="hidden md:block md:col-span-7 relative">
            <motion.div 
              style={{ y }}
              className="relative w-full h-[600px] lg:h-[700px]"
            >
              <img 
                src={craftImg} 
                alt="Craftsmanship process" 
                className="w-[80%] h-full object-cover absolute right-0 shadow-2xl"
              />
              
              {/* Floating detail images */}
              <motion.img 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.4 }}
                viewport={{ once: true }}
                src={portraitImg}
                alt="Portrait detail"
                className="absolute left-0 bottom-[20%] w-[45%] aspect-square object-cover shadow-xl border border-white/20"
              />
              
              <motion.img 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.6 }}
                viewport={{ once: true }}
                src={weddingImg}
                alt="Wedding detail"
                className="absolute left-[10%] top-[15%] w-[35%] aspect-[3/4] object-cover shadow-xl border border-white/20"
              />
            </motion.div>
          </div>
        </div>

        {/* Mobile Gallery (Touch-friendly horizontal scroll) */}
        <div className="md:hidden mt-16 -mx-6 px-6 overflow-hidden">
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-6 pr-6">
            {examples.map((ex, i) => (
              <div key={ex.title} className="w-[75vw] flex-shrink-0 snap-center">
                <img 
                  src={ex.image} 
                  alt={ex.title} 
                  className="w-full aspect-[4/5] object-cover mb-4 shadow-md"
                />
                <p className="font-sans text-xs tracking-[0.15em] uppercase text-inverse-on-surface/80 text-center">
                  {ex.title}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
