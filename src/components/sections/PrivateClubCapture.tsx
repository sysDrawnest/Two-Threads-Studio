import React, { useState } from 'react';

export const PrivateClubCapture: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Welcome to the Inner Circle.');
    setEmail('');
  };

  return (
    <section className="w-full bg-background py-32 px-6 flex justify-center items-center">
      <div className="max-w-xl w-full text-center">
        <div className="w-px h-16 bg-primary-container mx-auto mb-12" />
        <h2 className="font-serif font-light text-3xl md:text-4xl text-primary-container mb-6">
          Join the Atelier Inner Circle
        </h2>
        <p className="font-sans font-light text-sm tracking-wide text-on-surface-variant mb-12 leading-relaxed">
          Receive exclusive invitations to private commission slots, early access to new volumes of the Journal, and insights from the studio.
        </p>
        
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-8">
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            required
            className="w-full max-w-sm bg-transparent border-0 border-b border-outline-variant pb-3 text-center font-sans text-sm text-primary-container placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary-container transition-colors"
          />
          <button 
            type="submit" 
            className="font-sans text-xs uppercase tracking-[0.2em] text-primary-container bg-transparent border border-primary-container px-12 py-4 hover:bg-primary-container hover:text-inverse-on-surface transition-colors duration-500 cursor-pointer"
          >
            Request Access
          </button>
        </form>
      </div>
    </section>
  );
};
