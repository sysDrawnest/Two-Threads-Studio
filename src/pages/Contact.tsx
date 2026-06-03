import React, { useState } from 'react';
import PageContainer from '../components/layout/PageContainer';

const Contact: React.FC = () => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const faqs = [
    { q: "Do you ship internationally?", a: "Yes, we ship to over 50 countries worldwide. International shipping usually takes 7-14 business days. Please note that customs duties may apply depending on your location." },
    { q: "What is your return policy?", a: "We accept returns on unopened kits within 30 days of delivery. Digital patterns and courses are non-refundable. Please contact our support team to initiate a return." },
    { q: "Do you offer wholesale accounts?", a: "We do partner with select independent boutiques and craft stores. If you're interested in carrying TwoThreads, please use the contact form below and select 'Wholesale Inquiry'." },
    { q: "My kit is missing a thread color. What should I do?", a: "We sincerely apologize! While we pack everything by hand with care, mistakes occasionally happen. Send us an email with your order number, and we will dispatch the missing thread immediately." }
  ];

  return (
    <PageContainer>
      <div className="flex flex-col lg:flex-row min-h-screen bg-background">
        
        {/* Left Side: Contact Info & Form */}
        <div className="w-full lg:w-1/2 p-8 md:p-16 lg:p-24 flex flex-col justify-center">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-on-secondary-container mb-6">
            Get in Touch
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-light text-primary-container mb-6">
            Contact the Studio.
          </h1>
          <p className="font-sans text-sm text-[#5a4a3f] leading-loose mb-12 max-w-md">
            Whether you have a question about an order, a wholesale inquiry, or just want to share your latest finished piece, we'd love to hear from you.
          </p>

          <form className="flex flex-col gap-6 max-w-md" onSubmit={(e) => e.preventDefault()}>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <label htmlFor="name" className="block font-sans text-xs uppercase tracking-widest text-primary-container mb-2">Name</label>
                <input type="text" id="name" className="w-full bg-transparent border-b border-outline-variant py-2 focus:outline-none focus:border-primary-container transition-colors font-sans text-sm text-primary-container" />
              </div>
              <div className="flex-1">
                <label htmlFor="email" className="block font-sans text-xs uppercase tracking-widest text-primary-container mb-2">Email</label>
                <input type="email" id="email" className="w-full bg-transparent border-b border-outline-variant py-2 focus:outline-none focus:border-primary-container transition-colors font-sans text-sm text-primary-container" />
              </div>
            </div>
            
            <div>
              <label htmlFor="inquiry" className="block font-sans text-xs uppercase tracking-widest text-primary-container mb-2">Inquiry Type</label>
              <select id="inquiry" className="w-full bg-transparent border-b border-outline-variant py-2 focus:outline-none focus:border-primary-container transition-colors font-sans text-sm text-primary-container appearance-none cursor-pointer">
                <option>General Question</option>
                <option>Order Support</option>
                <option>Wholesale Inquiry</option>
                <option>Press / Collaboration</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block font-sans text-xs uppercase tracking-widest text-primary-container mb-2">Message</label>
              <textarea id="message" rows={4} className="w-full bg-transparent border-b border-outline-variant py-2 focus:outline-none focus:border-primary-container transition-colors font-sans text-sm text-primary-container resize-none"></textarea>
            </div>

            <button type="submit" className="self-start mt-4 bg-primary-container text-inverse-on-surface px-9 py-4 font-sans text-sm tracking-[0.15em] uppercase cursor-pointer hover:bg-[#5a3d2b] transition-colors border-none">
              Send Message
            </button>
          </form>
        </div>

        {/* Right Side: FAQ & Imagery */}
        <div className="w-full lg:w-1/2 bg-inverse-on-surface p-8 md:p-16 lg:p-24 flex flex-col relative overflow-hidden">
          {/* Aesthetic background image */}
          <img 
            src="https://images.unsplash.com/photo-1584446927514-633215c0e0b3?q=80&w=800&auto=format&fit=crop" 
            alt="Studio Details" 
            className="absolute inset-0 w-full h-full object-cover opacity-10"
          />
          
          <div className="relative z-10 my-auto max-w-lg">
            <h2 className="font-serif text-3xl font-light text-primary-container mb-12">
              Frequently Asked Questions
            </h2>
            
            <div className="flex flex-col gap-4">
              {faqs.map((faq, i) => (
                <div key={i} className="border-b border-outline-variant pb-4">
                  <button 
                    onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                    className="w-full flex justify-between items-center text-left bg-transparent border-none cursor-pointer py-2"
                  >
                    <span className="font-serif text-lg text-primary-container pr-8">{faq.q}</span>
                    <span className="text-primary-container text-xl leading-none">
                      {activeFaq === i ? '−' : '+'}
                    </span>
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${activeFaq === i ? 'max-h-40 opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>
                    <p className="font-sans text-sm text-[#5a4a3f] leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-16 p-6 border border-primary-container/20 bg-background/50 backdrop-blur-sm">
              <p className="font-sans text-sm text-primary-container font-medium mb-1">Direct Email</p>
              <p className="font-sans text-sm text-[#5a4a3f] mb-4">hello@twothreadsstudio.com</p>
              
              <p className="font-sans text-sm text-primary-container font-medium mb-1">Studio Address (By Appointment)</p>
              <p className="font-sans text-sm text-[#5a4a3f]">
                124 Artisan Way, Suite 300<br/>
                Portland, OR 97209
              </p>
            </div>
          </div>
        </div>

      </div>
    </PageContainer>
  );
};

export default Contact;
