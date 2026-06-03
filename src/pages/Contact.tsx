import React from 'react';
import PageContainer from '../components/layout/PageContainer';

const Contact: React.FC = () => {
  return (
    <PageContainer>
      <div className="flex-1 flex flex-col items-center justify-center py-32 px-6">
        <p className="font-sans text-xs tracking-[0.3em] uppercase text-on-secondary-container mb-4">
          Get in Touch
        </p>
        <h1 className="font-serif text-4xl md:text-6xl font-light text-primary-container mb-6 text-center">
          Contact Us
        </h1>
        <p className="font-sans text-sm text-[#5a4a3f] max-w-lg text-center leading-loose">
          We'd love to hear from you. Our contact form is currently being built. Please email us directly for any inquiries.
        </p>
      </div>
    </PageContainer>
  );
};

export default Contact;
