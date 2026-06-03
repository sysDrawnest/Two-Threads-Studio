import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageContainer from '../components/layout/PageContainer';
import { mockTutorials, mockInstructors } from '../data/tutorials';

const TutorialDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const tutorial = mockTutorials.find(t => t.id === id);
  const [activeModule, setActiveModule] = useState(0);

  if (!tutorial) {
    return (
      <PageContainer>
        <div className="flex-1 flex flex-col items-center justify-center py-32 px-6 text-center">
          <h1 className="font-serif text-3xl text-primary-container mb-4">Tutorial Not Found</h1>
          <Link to="/learning" className="text-on-secondary-container underline">Return to Learning Hub</Link>
        </div>
      </PageContainer>
    );
  }

  const instructor = mockInstructors.find(i => i.id === tutorial.instructorId);
  const completedCount = tutorial.modules.filter(m => m.completed).length;
  const progressPercent = Math.round((completedCount / tutorial.modules.length) * 100);

  return (
    <PageContainer>
      {/* Video Hero */}
      <section className="bg-inverse-on-surface">
        <div className="max-w-6xl mx-auto w-full aspect-[16/9] relative group bg-black cursor-pointer">
          <img 
            src={tutorial.videoPlaceholder} 
            alt="Video Placeholder" 
            className="w-full h-full object-cover opacity-70 group-hover:opacity-50 transition-opacity duration-500"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center pl-2 border border-white/40 group-hover:scale-110 transition-transform duration-500">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="#ffffff"><polygon points="5 3 19 12 5 21 5 3" /></svg>
            </div>
          </div>
          {/* Mock Video UI */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex items-center gap-4 text-white font-sans text-xs opacity-0 group-hover:opacity-100 transition-opacity">
            <span>00:00</span>
            <div className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
              <div className="w-0 h-full bg-primary-container" />
            </div>
            <span>{tutorial.modules[activeModule].duration}</span>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="py-12 px-6 md:px-16 bg-background">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left Column: Details */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <span className={`inline-block font-sans text-[10px] tracking-widest px-3 py-1.5 uppercase mb-4 ${
                tutorial.difficulty === 'Beginner' ? 'bg-[#e8f4e8] text-[#3a6b3a]' : 
                tutorial.difficulty === 'Intermediate' ? 'bg-[#fef3e8] text-[#8b5a00]' : 
                'bg-[#fde8e8] text-[#8b0000]'
              }`}>
                {tutorial.difficulty}
              </span>
              <h1 className="font-serif text-3xl md:text-5xl font-light text-primary-container mb-4">
                {tutorial.title}
              </h1>
              <p className="font-sans text-sm text-on-surface-variant uppercase tracking-wider mb-8">
                {tutorial.duration} Total Duration • {tutorial.modules.length} Modules
              </p>
              <p className="font-sans text-base text-[#5a4a3f] leading-loose">
                {tutorial.description}
              </p>
            </div>

            {/* Instructor Mini-Profile */}
            {instructor && (
              <div className="flex items-start gap-6 py-8 border-y border-outline-variant mb-12">
                <img src={instructor.avatar} alt={instructor.name} className="w-20 h-20 rounded-full object-cover" />
                <div>
                  <p className="font-sans text-xs tracking-wider uppercase text-on-secondary-container mb-1">Taught by</p>
                  <Link to={`/instructor/${instructor.id}`} className="font-serif text-2xl text-primary-container no-underline hover:text-on-secondary-container transition-colors mb-3 block">
                    {instructor.name}
                  </Link>
                  <p className="font-sans text-sm text-[#5a4a3f] leading-relaxed line-clamp-2 max-w-lg">
                    {instructor.bio}
                  </p>
                </div>
              </div>
            )}

            {/* Downloads */}
            {tutorial.resources.length > 0 && (
              <div className="mb-12">
                <h3 className="font-serif text-2xl font-light text-primary-container mb-6">Course Resources</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {tutorial.resources.map((res, i) => (
                    <div key={i} className="border border-outline-variant p-5 flex items-center justify-between hover:bg-inverse-on-surface transition-colors cursor-pointer group">
                      <div className="flex items-center gap-4">
                        <svg width="24" height="24" fill="none" stroke="#8b6f5c" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><polyline points="9 15 12 18 15 15"/></svg>
                        <div>
                          <p className="font-sans text-sm text-primary-container group-hover:text-on-secondary-container transition-colors">{res.title}</p>
                          <p className="font-sans text-xs text-on-surface-variant uppercase mt-1">{res.type} • {res.size}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Syllabus/Progress */}
          <div className="lg:col-span-1">
            <div className="bg-inverse-on-surface p-6 md:p-8 sticky top-24">
              <h3 className="font-serif text-2xl font-light text-primary-container mb-4">Syllabus</h3>
              
              <div className="mb-8">
                <div className="flex justify-between items-center font-sans text-xs uppercase tracking-wider text-on-surface-variant mb-2">
                  <span>Your Progress</span>
                  <span>{progressPercent}%</span>
                </div>
                <div className="h-1.5 w-full bg-outline-variant/50 overflow-hidden">
                  <div 
                    className="h-full bg-on-secondary-container transition-all duration-1000 ease-out" 
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                {tutorial.modules.map((module, i) => (
                  <button
                    key={module.id}
                    onClick={() => setActiveModule(i)}
                    className={`flex items-start gap-4 p-4 text-left border-l-2 transition-colors ${
                      activeModule === i 
                        ? 'border-primary-container bg-white shadow-sm' 
                        : 'border-transparent hover:bg-white/50'
                    }`}
                  >
                    <div className="mt-1">
                      {module.completed ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3a6b3a" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M20 6L9 17l-5-5" /></svg>
                      ) : (
                        <div className="w-4 h-4 border border-outline-variant rounded-full" />
                      )}
                    </div>
                    <div>
                      <p className={`font-sans text-sm leading-snug mb-1 ${activeModule === i ? 'text-primary-container font-medium' : 'text-[#5a4a3f]'}`}>
                        {i + 1}. {module.title}
                      </p>
                      <p className="font-sans text-xs text-on-surface-variant">{module.duration}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>
    </PageContainer>
  );
};

export default TutorialDetail;
