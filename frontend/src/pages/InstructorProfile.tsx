import React from 'react';
import { useParams, Link } from 'react-router-dom';
import PageContainer from '../components/layout/PageContainer';
import { mockInstructors, mockTutorials } from '../data/tutorials';

const InstructorProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const instructor = mockInstructors.find(i => i.id === id);

  if (!instructor) {
    return (
      <PageContainer>
        <div className="flex-1 flex flex-col items-center justify-center py-32 px-6 text-center">
          <h1 className="font-serif text-3xl text-primary-container mb-4">Instructor Not Found</h1>
          <Link to="/learning" className="text-on-secondary-container underline">Return to Learning Hub</Link>
        </div>
      </PageContainer>
    );
  }

  const instructorTutorials = mockTutorials.filter(t => t.instructorId === instructor.id);

  return (
    <PageContainer>
      {/* Instructor Hero */}
      <section className="bg-[#ede6de] py-20 px-6 md:px-16">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-12 items-center md:items-start">
          <div className="w-48 h-48 md:w-64 md:h-64 flex-shrink-0 relative">
            <img 
              src={instructor.avatar} 
              alt={instructor.name} 
              className="w-full h-full object-cover rounded-full shadow-lg relative z-10"
            />
            {/* Decorative background circle */}
            <div className="absolute inset-0 rounded-full border border-primary-container/20 translate-x-4 translate-y-4" />
          </div>
          <div className="flex-1 text-center md:text-left pt-4">
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-on-secondary-container mb-4">
              Instructor Profile
            </p>
            <h1 className="font-serif text-4xl md:text-6xl font-light text-primary-container mb-2">
              {instructor.name}
            </h1>
            <p className="font-sans text-sm text-on-surface-variant uppercase tracking-wider mb-8">
              {instructor.specialty}
            </p>
            <p className="font-sans text-base text-[#5a4a3f] leading-loose max-w-2xl mx-auto md:mx-0">
              {instructor.bio}
            </p>
          </div>
        </div>
      </section>

      {/* Instructor's Courses */}
      <section className="py-24 px-6 md:px-16 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 border-b border-outline-variant pb-6">
            <h2 className="font-serif text-3xl md:text-4xl font-light text-primary-container">
              Courses by {instructor.name.split(' ')[0]}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {instructorTutorials.map((tutorial) => (
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
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="mb-4">
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
                </div>
              </Link>
            ))}
          </div>
          
          {instructorTutorials.length === 0 && (
            <div className="text-center py-20">
              <p className="font-sans text-lg text-on-surface-variant italic">No tutorials currently available from this instructor.</p>
            </div>
          )}
        </div>
      </section>
    </PageContainer>
  );
};

export default InstructorProfile;
