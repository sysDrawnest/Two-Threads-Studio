import React from 'react';
import PageContainer from '../components/layout/PageContainer';
import { 
  Hero, 
  BestSellers, 
  ExploreByRoom, 
  Banner, 
  JustForYou, 
  OurStory, 
  Reviews, 
  Learning, 
  Newsletter,
  VideoBanner
} from '../components/sections';

const Home: React.FC = () => {
  return (
    <PageContainer disablePadding={true}>
      <Hero />
      <BestSellers />
      <VideoBanner />
      <ExploreByRoom />
      <Banner />
      <JustForYou />
      <OurStory />
      <Reviews />
      <Learning />
      <Newsletter />
    </PageContainer>
  );
};

export default Home;
