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
  Newsletter 
} from '../components/sections/HomeSections';
import CricketKeychains from '../components/CricketKeychains';

const Home: React.FC = () => {
  return (
    <PageContainer>
      <Hero />
      <BestSellers />
      <ExploreByRoom />
      <Banner />
      <JustForYou />
      <CricketKeychains />
      <OurStory />
      <Reviews />
      <Learning />
      <Newsletter />
    </PageContainer>
  );
};

export default Home;
