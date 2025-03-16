import Navbar from '../features/landing/components/Navbar';
import { HeroSection } from '../features/landing/components/HeroSection';
import { WhatIsRetinaScan } from '../features/landing/components/WhatIsRetinaScan';
import { RetinaScanVsIris } from '../features/landing/components/RetinaScanVsIris';
import { AdvantagesLimitations } from '../features/landing/components/AdvantagesLimitations';
import { RealWorldApplications } from '../features/landing/components/RealWorldApplications';
import { Conclusion } from '../features/landing/components/Conclusion';
import { RelatedArticles } from '../features/landing/components/RelatedArticles';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Fixed navbar with higher z-index */}
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>
      
      {/* Main content container */}
      <div className="mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        {/* Hero section without container constraints for full-width design */}
        <HeroSection />
        
        {/* Content sections with elegant spacing */}
        <div className="space-y-24 py-12 md:py-16 lg:py-24">
          <div id="what-is-retina-scan" className="scroll-mt-24">
            <WhatIsRetinaScan />
          </div>
          
          <div id="retina-vs-iris" className="scroll-mt-24">
            <RetinaScanVsIris />
          </div>
          
          <div id="advantages-limitations" className="scroll-mt-24">
            <AdvantagesLimitations />
          </div>
          
          <div id="real-world-applications" className="scroll-mt-24">
            <RealWorldApplications />
          </div>
          
          <div id="conclusion" className="scroll-mt-24">
            <Conclusion />
          </div>
          
          <div className="scroll-mt-24">
            <RelatedArticles />
          </div>
        </div>
      </div>
      
      {/* Modern, gradient footer */}
      <footer className="mt-24 bg-gradient-to-br from-teal-600 to-teal-800 py-12 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <h3 className="text-lg font-semibold">LUMINA SECURE</h3>
              <p className="mt-4 text-sm text-teal-100">
                Leading provider of advanced biometric security solutions for enterprise and government.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Products</h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li><a href="#" className="text-teal-100 hover:text-white transition-colors">RetinaScan Pro</a></li>
                <li><a href="#" className="text-teal-100 hover:text-white transition-colors">Biometric Access Control</a></li>
                <li><a href="#" className="text-teal-100 hover:text-white transition-colors">Identity Verification</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Resources</h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li><a href="#" className="text-teal-100 hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="text-teal-100 hover:text-white transition-colors">API Reference</a></li>
                <li><a href="#" className="text-teal-100 hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Contact</h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li className="text-teal-100">info@lumina-secure.com</li>
                <li className="text-teal-100">+1 (555) 123-4567</li>
                <li className="text-teal-100">123 Tech Street, San Francisco, CA</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-teal-500 pt-8 text-center text-sm text-teal-200">
            <p> {new Date().getFullYear()} LUMINA SECURE. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
