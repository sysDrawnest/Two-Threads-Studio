import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PageContainer from '../components/layout/PageContainer';
import { mockTutorials, mockInstructors, Tutorial } from '../data/tutorials';

const Learning: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"All" | "Beginner" | "Intermediate" | "Advanced">("All");

  const filteredTutorials = mockTutorials.filter(t => activeTab === "All" || t.difficulty === activeTab);
  
  // Featured tutorial (just taking the first one)
  const featured = mockTutorials[0];
  const featuredInstructor = mockInstructors.find(i => i.id === featured.instructorId);

  return (
    <PageContainer>
      <div className="bg-background min-h-screen">
        
        {/* Hero / Featured Course */}
        <section className="pt-8 pb-16 px-6 md:px-16 bg-[#ede6de]">
          <div className="max-w-7xl mx-auto">
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-on-secondary-container mb-6 text-center md:text-left">
              Learning Studio
            </p>
            <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-center">
              <div className="w-full md:w-1/2">
                <Link to={`/learning/${featured.id}`} className="block relative aspect-[4/3] overflow-hidden group">
                  <img 
                    src={featured.thumbnail} 
                    alt={featured.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center pl-1 shadow-lg">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="#2d2520"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="w-full md:w-1/2 flex flex-col items-start text-left">
                <span className="bg-primary-container text-inverse-on-surface font-sans text-[10px] tracking-widest px-3 py-1.5 uppercase mb-6">
                  Featured Course
                </span>
                <h1 className="font-serif text-4xl md:text-5xl font-light text-primary-container mb-4 leading-tight">
                  {featured.title}
                </h1>
                <p className="font-sans text-sm text-[#5a4a3f] leading-loose mb-8 line-clamp-3">
                  {featured.description}
                </p>
                <div className="flex items-center gap-4 mb-8">
                  <img src={featuredInstructor?.avatar} alt={featuredInstructor?.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <p className="font-sans text-xs tracking-wider uppercase text-on-secondary-container">Instructor</p>
                    <Link to={`/instructor/${featuredInstructor?.id}`} className="font-serif text-lg text-primary-container no-underline hover:text-on-secondary-container transition-colors">
                      {featuredInstructor?.name}
                    </Link>
                  </div>
                </div>
                <Link 
                  to={`/learning/${featured.id}`}
                  className="bg-transparent text-primary-container border border-primary-container px-9 py-3.5 font-sans text-sm tracking-[0.15em] uppercase cursor-pointer hover:bg-primary-container hover:text-inverse-on-surface transition-colors no-underline"
                >
                  Start Learning
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Course Library */}
        <section className="py-24 px-6 md:px-16">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center mb-12 border-b border-outline-variant pb-6 gap-6">
              <h2 className="font-serif text-3xl md:text-4xl font-light text-primary-container">
                Course Library
              </h2>
              <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                {(["All", "Beginner", "Intermediate", "Advanced"] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`font-sans text-xs tracking-widest uppercase px-5 py-2.5 whitespace-nowrap transition-colors border ${
                      activeTab === tab 
                        ? 'bg-primary-container text-inverse-on-surface border-primary-container' 
                        : 'bg-transparent text-on-surface-variant border-transparent hover:border-outline-variant'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTutorials.map((tutorial) => {
                const instructor = mockInstructors.find(i => i.id === tutorial.instructorId);
                return (
                  <Link 
                    key={tutorial.id} 
                    to={`/learning/${tutorial.id}`}
                    className="group no-underline bg-white shadow-sm hover:-translate-y-2 hover:shadow-xl transition-all duration-500 flex flex-col h-full"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-surface-container">
                      <img 
                        src={tutorial.thumbnail} 
                        alt={tutorial.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute bottom-3 right-3 bg-primary-container/90 text-inverse-on-surface font-sans text-[10px] px-2 py-1 tracking-wider">
                        {tutorial.duration}
                      </div>
                      <div className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center pl-1 shadow-lg">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="#2d2520"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                        </div>
                      </div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="mb-4 flex items-center justify-between">
                        <span className={`font-sans text-[10px] tracking-widest px-2.5 py-1 uppercase ${
                          tutorial.difficulty === 'Beginner' ? 'bg-[#e8f4e8] text-[#3a6b3a]' : 
                          tutorial.difficulty === 'Intermediate' ? 'bg-[#fef3e8] text-[#8b5a00]' : 
                          'bg-[#fde8e8] text-[#8b0000]'
                        }`}>
                          {tutorial.difficulty}
                        </span>
                      </div>
                      <h3 className="font-serif text-xl font-normal text-primary-container mb-2 line-clamp-2">
                        {tutorial.title}
                      </h3>
                      <p className="font-sans text-xs text-on-surface-variant uppercase tracking-wider mt-auto pt-4 border-t border-outline-variant/50">
                        Instructor: {instructor?.name}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>

            {filteredTutorials.length === 0 && (
              <div className="text-center py-20">
                <p className="font-sans text-lg text-on-surface-variant italic">No tutorials found for this category.</p>
              </div>
            )}
          </div>
        </section>

      </div>
    </PageContainer>
  );
};

export default Learning;
