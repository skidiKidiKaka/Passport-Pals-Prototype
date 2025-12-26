import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { StorySection } from '@/components/landing/StorySection';
import { Footer } from '@/components/landing/Footer';
import { AppLayout } from '@/components/layout/AppLayout';

const Index = () => {
  return (
    <AppLayout>
      <HeroSection />
      <FeaturesSection />
      <StorySection />
      <Footer />
    </AppLayout>
  );
};

export default Index;