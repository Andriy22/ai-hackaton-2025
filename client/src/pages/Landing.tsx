import React from 'react';
import { HeroSection } from '../features/landing/components/HeroSection';
import { WhatIsRetinaScan } from '../features/landing/components/WhatIsRetinaScan';
import { RetinaScanVsIris } from '../features/landing/components/RetinaScanVsIris';
import { AdvantagesLimitations } from '../features/landing/components/AdvantagesLimitations';
import { RealWorldApplications } from '../features/landing/components/RealWorldApplications';
import { Conclusion } from '../features/landing/components/Conclusion';
import { RelatedArticles } from '../features/landing/components/RelatedArticles';

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <div id="what-is-retina-scan">
        <WhatIsRetinaScan />
      </div>
      <div id="retina-vs-iris">
        <RetinaScanVsIris />
      </div>
      <div id="advantages-limitations">
        <AdvantagesLimitations />
      </div>
      <div id="real-world-applications">
        <RealWorldApplications />
      </div>
      <div id="conclusion">
        <Conclusion />
      </div>
      <RelatedArticles />
      {/* Additional sections will be added here */}
    </div>
  );
}
