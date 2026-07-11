import React, { useState } from 'react';
import PageContainer from '../components/layout/PageContainer';
import { ScrollReveal, StaggerContainer } from '../components/ui/ScrollReveal';
import { MapPin, Briefcase, Clock, CheckCircle } from 'lucide-react';

interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
}

export default function Careers() {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [applied, setApplied] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const jobs: Job[] = [
    {
      id: 'job-1',
      title: 'Senior Textile & Pattern Designer',
      department: 'Design & Artistry',
      location: 'Portland, OR (Hybrid)',
      type: 'Full-time',
      description: 'Two Threads Studio, a brand operated by SYS Pvt. Ltd., is hiring a Senior Textile & Pattern Designer. In this role, you will lead the creative conceptualization and hand-drawn drafting of our upcoming seasonal embroidery kits, bridging classical botanical illustrations with modern stitching guides.',
      requirements: [
        '5+ years of experience in textile design or professional illustration.',
        'Strong portfolio displaying hand-drawn botanical or geometric linework.',
        'Deep understanding of traditional embroidery methods (thread painting, crewel, satin stitch).',
        'Capability to translate physical art into clear digital instruction guides.'
      ]
    },
    {
      id: 'job-2',
      title: 'Frontend Engineer (React / TypeScript)',
      department: 'Engineering & Technology',
      location: 'Bengaluru, India (Remote / Hybrid)',
      type: 'Full-time',
      description: 'SYS Pvt. Ltd. is hiring a Frontend Engineer to support our portfolio of digital-first consumer brands, including Two Threads Studio and TANVO. You will build and maintain our premium ecommerce experiences, focus on sub-second page loads, elegant micro-interactions, and visual layouts.',
      requirements: [
        '3+ years of professional experience building responsive web apps with React and TypeScript.',
        'Expertise in CSS architectures, TailwindCSS, and animation frameworks (such as Framer Motion).',
        'Strong eye for detail, micro-copy, typography, and premium user-centered experiences.',
        'Experience integrating headless commerce and order orchestration backends.'
      ]
    },
    {
      id: 'job-3',
      title: 'Artisan Partnerships Coordinator',
      department: 'Operations & Sustainability',
      location: 'New Delhi, India (Hybrid)',
      type: 'Full-time',
      description: 'Two Threads Studio, a brand operated by SYS Pvt. Ltd., is seeking an Artisan Partnerships Coordinator. You will serve as our primary coordinator with traditional weavers, thread mills, and rural craft cooperatives in India and Belgium, ensuring sustainable sourcing and fair wage compliance.',
      requirements: [
        'Degree in social work, textile conservation, or supply chain management.',
        'Prior experience working directly with rural artisan communities or NGOs.',
        'Excellent communication and documentation skills.',
        'Willingness to travel to artisan clusters for quality audits and relationship building.'
      ]
    }
  ];

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setApplied(true);
    setTimeout(() => {
      setApplied(false);
      setSelectedJob(null);
      setName('');
      setEmail('');
    }, 4000);
  };

  return (
    <PageContainer>
      <div className="min-h-screen bg-[#FBFBFA] pt-28 pb-24 px-6 md:px-16 font-sans text-[#1C1C1B]">
        <div className="max-w-5xl mx-auto">
          
          {/* Header */}
          <div className="max-w-3xl mb-20">
            <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#A34A38] block mb-4 font-semibold">
              Work with Purpose
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-primary-container leading-tight mb-8">
              Join the Studio.
            </h1>
            <p className="font-sans text-base text-[#5a4a3f] leading-loose mb-6">
              Two Threads Studio is a fast-growing premium consumer brand operated under our parent company, <strong>SYS Pvt. Ltd.</strong> At SYS Pvt. Ltd., we construct digital-first consumer brands focused on heritage craftsmanship, design, technology, and meaningful products.
            </p>
            <p className="font-sans text-sm text-[#5a4a3f] leading-relaxed">
              Join SYS Pvt. Ltd. and help build the future of our brands. We believe in slow growth, mindful collaboration, and sustainable scaling. Explore our open positions below.
            </p>
          </div>

          <div className="border-t border-neutral-200 w-full mb-16"></div>

          {/* Job Listings Grid */}
          <StaggerContainer className="grid grid-cols-1 gap-6">
            {jobs.map((job) => (
              <ScrollReveal key={job.id} direction="up">
                <div className="bg-white border border-neutral-200/60 p-6 md:p-10 rounded-sm shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                  <div className="max-w-2xl">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <span className="bg-neutral-100 text-neutral-500 font-sans text-[9px] tracking-widest uppercase px-2.5 py-1 rounded-sm">
                        {job.department}
                      </span>
                      <span className="flex items-center gap-1 font-sans text-xs text-neutral-400">
                        <MapPin size={12} /> {job.location}
                      </span>
                    </div>
                    <h3 className="font-serif text-2xl text-primary-container mb-4">{job.title}</h3>
                    <p className="font-sans text-sm text-[#5a4a3f] leading-relaxed line-clamp-3">
                      {job.description}
                    </p>
                  </div>
                  
                  <div className="flex flex-row md:flex-col gap-3 w-full md:w-auto flex-shrink-0">
                    <button
                      onClick={() => setSelectedJob(job)}
                      className="w-full md:w-auto bg-[#1C1C1B] text-[#FAF9F7] border border-transparent px-8 py-3.5 font-sans text-xs tracking-widest uppercase hover:bg-neutral-800 transition-colors cursor-pointer rounded-sm shadow-sm font-semibold"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </StaggerContainer>

          {/* Job Details Modal overlay */}
          {selectedJob && (
            <div className="fixed inset-0 bg-[#1C1C1B]/40 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in duration-300">
              <div className="bg-white w-full max-w-2xl p-8 md:p-12 border border-neutral-300 shadow-xl rounded-sm max-h-[85vh] overflow-y-auto relative">
                
                <button
                  onClick={() => setSelectedJob(null)}
                  className="absolute right-6 top-6 bg-transparent border-none cursor-pointer text-neutral-400 hover:text-[#1C1C1B] text-xl"
                  aria-label="Close modal"
                >
                  ✕
                </button>

                {applied ? (
                  <div className="text-center py-12 flex flex-col items-center justify-center">
                    <CheckCircle size={48} className="text-[#A34A38] mb-4" />
                    <h3 className="font-serif text-2xl text-primary-container mb-2">Application Received</h3>
                    <p className="font-sans text-sm text-neutral-500 max-w-sm mb-2">
                      Thank you for applying for the <strong>{selectedJob.title}</strong> role.
                    </p>
                    <p className="font-sans text-xs text-neutral-400 italic">
                      Our hiring team at SYS Pvt. Ltd. will review your portfolio and reach out shortly.
                    </p>
                  </div>
                ) : (
                  <div>
                    <span className="font-sans text-[10px] tracking-widest uppercase text-[#A34A38] font-bold block mb-2">
                      SYS Pvt. Ltd. • {selectedJob.department}
                    </span>
                    <h2 className="font-serif text-3xl text-primary-container mb-6">{selectedJob.title}</h2>
                    
                    <div className="flex gap-6 mb-8 text-xs text-neutral-500 border-b border-neutral-100 pb-4">
                      <span className="flex items-center gap-1"><Briefcase size={13} /> {selectedJob.type}</span>
                      <span className="flex items-center gap-1"><MapPin size={13} /> {selectedJob.location}</span>
                    </div>

                    <div className="prose prose-neutral max-w-none text-sm text-[#5a4a3f] leading-relaxed mb-8">
                      <p className="mb-4">{selectedJob.description}</p>
                      
                      <h4 className="font-serif text-base text-primary-container font-medium mt-6 mb-3">Key Requirements:</h4>
                      <ul className="list-disc pl-5 space-y-2">
                        {selectedJob.requirements.map((req, i) => (
                          <li key={i}>{req}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="border-t border-neutral-100 pt-8 mt-8">
                      <h4 className="font-serif text-lg text-primary-container mb-4">Submit Application</h4>
                      <form onSubmit={handleApply} className="flex flex-col gap-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="flex flex-col gap-1.5">
                            <label className="font-sans text-[10px] uppercase tracking-wider text-neutral-400">Full Name</label>
                            <input 
                              type="text" 
                              required 
                              value={name}
                              onChange={e => setName(e.target.value)}
                              placeholder="Julia Hampton"
                              className="w-full p-3 border border-neutral-200 focus:border-[#A34A38] focus:ring-0 focus:outline-none bg-[#FBFBFA] text-sm text-[#1C1C1B] rounded-sm" 
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="font-sans text-[10px] uppercase tracking-wider text-neutral-400">Email Address</label>
                            <input 
                              type="email" 
                              required 
                              value={email}
                              onChange={e => setEmail(e.target.value)}
                              placeholder="julia@example.com"
                              className="w-full p-3 border border-neutral-200 focus:border-[#A34A38] focus:ring-0 focus:outline-none bg-[#FBFBFA] text-sm text-[#1C1C1B] rounded-sm" 
                            />
                          </div>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="font-sans text-[10px] uppercase tracking-wider text-neutral-400">Portfolio URL or Cover Letter Link</label>
                          <input 
                            type="url" 
                            required 
                            placeholder="https://behance.net/portfolio"
                            className="w-full p-3 border border-neutral-200 focus:border-[#A34A38] focus:ring-0 focus:outline-none bg-[#FBFBFA] text-sm text-[#1C1C1B] rounded-sm" 
                          />
                        </div>
                        <button 
                          type="submit" 
                          className="bg-[#A34A38] text-white hover:bg-[#83382a] py-3.5 px-8 text-xs tracking-widest uppercase transition-colors border-none cursor-pointer rounded-sm shadow-sm font-semibold mt-2"
                        >
                          Submit Application to SYS Pvt. Ltd.
                        </button>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </PageContainer>
  );
}
