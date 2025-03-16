import React from 'react';
import { Facebook, Twitter, Linkedin, Link, ArrowRight } from 'lucide-react';

type TableOfContentsItem = {
  id: string;
  title: string;
};

const tableOfContentsItems: TableOfContentsItem[] = [
  { id: 'what-is-retina-scan', title: 'What is a Retina Scan?' },
  { id: 'retina-vs-iris', title: 'Retina Scans vs. Iris Recognition' },
  { id: 'advantages-limitations', title: 'Advantages and Limitations of Retina Scans' },
  { id: 'real-world-applications', title: 'Possible Real-World Applications' },
  { id: 'conclusion', title: 'Conclusion' }
];

export const HeroSection: React.FC = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full overflow-hidden px-4 py-12 md:py-20 lg:px-8">
      {/* Background decoration */}
      <div className="pointer-events-none absolute right-0 top-0 -z-10 h-full w-full overflow-hidden">
        <div className="absolute right-0 top-0 h-[400px] w-[400px] rounded-full bg-gradient-to-r from-gray-50 to-transparent opacity-50 blur-xl"></div>
        <div className="absolute right-[10%] top-[15%] h-[300px] w-[300px] rounded-full bg-gradient-to-r from-gray-100 to-transparent opacity-60 blur-md"></div>
      </div>
      
      <div className="container mx-auto max-w-7xl">
        <div className="relative flex flex-col gap-12 md:flex-row">
          {/* Left content area */}
          <div className="w-full md:w-3/5 xl:w-2/3">
            <div className="space-y-8">
              {/* Main heading */}
              <h1 className="text-4xl font-bold leading-tight text-black md:text-5xl lg:text-6xl">
                Beyond the Iris: Retina Scan for Future Biometric Security?
              </h1>
              
              {/* Meta information */}
              <div className="space-y-4">
                <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-x-8 md:space-y-0">
                  <div className="flex items-center">
                    <span className="text-sm font-medium uppercase text-gray-600">DATE:</span>
                    <span className="ml-2 text-sm">19/1/2024</span>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="text-sm font-medium uppercase text-gray-600">CATEGORY:</span>
                    <span className="ml-2 text-sm uppercase">BIOMETRIC POST</span>
                  </div>
                </div>
                
                {/* Share section */}
                <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-y-0">
                  <span className="text-sm font-medium uppercase text-gray-600">SHARE ON:</span>
                  <div className="flex items-center space-x-4 md:ml-2">
                    <button 
                      aria-label="Share on Facebook" 
                      tabIndex={0} 
                      className="transform rounded-full p-1 text-gray-700 transition-all hover:scale-110 hover:text-blue-600"
                      onClick={() => {}}
                      onKeyDown={(e) => {if (e.key === 'Enter' || e.key === ' ') e.currentTarget.click()}}
                    >
                      <Facebook size={18} />
                    </button>
                    <button 
                      aria-label="Share on Twitter" 
                      tabIndex={0} 
                      className="transform rounded-full p-1 text-gray-700 transition-all hover:scale-110 hover:text-blue-400"
                      onClick={() => {}}
                      onKeyDown={(e) => {if (e.key === 'Enter' || e.key === ' ') e.currentTarget.click()}}
                    >
                      <Twitter size={18} />
                    </button>
                    <button 
                      aria-label="Share on LinkedIn" 
                      tabIndex={0} 
                      className="transform rounded-full p-1 text-gray-700 transition-all hover:scale-110 hover:text-blue-700"
                      onClick={() => {}}
                      onKeyDown={(e) => {if (e.key === 'Enter' || e.key === ' ') e.currentTarget.click()}}
                    >
                      <Linkedin size={18} />
                    </button>
                    <button 
                      aria-label="Copy link" 
                      tabIndex={0} 
                      className="transform rounded-full p-1 text-gray-700 transition-all hover:scale-110 hover:text-gray-900"
                      onClick={() => {}}
                      onKeyDown={(e) => {if (e.key === 'Enter' || e.key === ' ') e.currentTarget.click()}}
                    >
                      <Link size={18} />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Introduction text */}
              <div className="pr-0 text-gray-700 leading-relaxed md:pr-10">
                <p className="mb-4">
                  In the realm of biometrics, where the quest for accuracy and security never ceases, the human eye, often referred to as the "window to the soul," has become a gateway to the future of identification and protection. While iris scanning has gained prominence, lurking in the shadows lies an even more intricate and secure method: retina scanning.
                </p>
                <p>
                  Beyond the colorful iris lies the retinal pattern, a complex and unique roadmap formed by the delicate blood vessels at the back of our eyes. Welcome to the world of retina scanning, where the unperceived beam of light unveils our innermost secrets and where security takes a leap into the future.
                </p>
              </div>
              
              {/* Table of contents */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-semibold text-gray-900">Table of Contents</h2>
                <ul className="space-y-3">
                  {tableOfContentsItems.map((item) => (
                    <li key={item.id}>
                      <button
                        onClick={() => scrollToSection(item.id)}
                        className="group flex w-full items-center text-left text-gray-700 hover:text-blue-600 transition-colors"
                        tabIndex={0}
                        aria-label={`Navigate to ${item.title} section`}
                      >
                        <ArrowRight className="mr-2 h-4 w-4 text-gray-400 group-hover:text-blue-600" />
                        <span>{item.title}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Right column - retina image */}
          <div className="relative order-first md:order-last md:w-2/5 xl:w-1/3">
            <div className="relative h-[300px] w-full overflow-hidden rounded-xl md:h-[360px] lg:h-[420px]">
              <img
                src="https://cdn.prod.website-files.com/61845f7929f5aa517ebab941/65b0c2f48105baace50d3ce7_Retina%20Scan%20for%20Future%20Biometric%20Security.jpg"
                alt="Close-up of a human eye during retina scan"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
