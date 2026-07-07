import React from 'react';
import PageContainer from '../components/layout/PageContainer';
import { 
  BestSellers, 
  ExploreByRoom 
} from '../components/sections/HomeSections';
import { HeroVideo } from '../components/sections/HeroVideo';
import { BrandManifesto } from '../components/sections/BrandManifesto';
import { CollectionExclusives } from '../components/sections/CollectionExclusives';
import { TheAtelierStory } from '../components/sections/TheAtelierStory';
import { AtelierJournal } from '../components/sections/AtelierJournal';
import { PrivateClubCapture } from '../components/sections/PrivateClubCapture';

// Note: Old components are removed from the loop (Hero, Banner, JustForYou, CricketKeychains, OurStory, Reviews, Learning, Newsletter)

const Home: React.FC = () => {
  return (
    <PageContainer>
      <HeroVideo />
      <BrandManifesto />
      <BestSellers />
      <CollectionExclusives />
      <ExploreByRoom />
      <TheAtelierStory />
      <AtelierJournal />
      <PrivateClubCapture />
    </PageContainer>
  );
};

export default Home;
