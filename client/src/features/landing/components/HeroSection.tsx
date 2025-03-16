import { useState } from 'react';
import { Facebook, Twitter, Linkedin, Link, ArrowRight, ChevronDown } from 'lucide-react';

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

export const HeroSection = () => {
  const [isContentExpanded, setIsContentExpanded] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full overflow-hidden pt-12 md:pt-20 lg:pt-24">
      {/* Background elements */}
      <div className="absolute left-0 top-0 -z-10 h-full w-full overflow-hidden">
        <div className="absolute -right-24 -top-24 h-[600px] w-[600px] rounded-full bg-gradient-to-b from-teal-50 to-teal-100/20 opacity-70 blur-3xl"></div>
        <div className="absolute -left-40 top-40 h-[400px] w-[400px] rounded-full bg-gradient-to-tr from-blue-50 to-blue-100/30 opacity-50 blur-3xl"></div>
      </div>
      
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative grid grid-cols-1 gap-12 lg:grid-cols-5">
          {/* Main content - 3 columns on large screens */}
          <div className="lg:col-span-3">
            <div className="space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center rounded-full bg-teal-50 px-3 py-1 text-sm font-medium text-teal-700 ring-1 ring-inset ring-teal-700/20">
                Latest Research
              </div>
              
              {/* Main heading with gradient text */}
              <h1 className="text-4xl font-bold leading-tight tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
                Beyond the Iris: <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">Retina Scan</span> for Future Biometric Security
              </h1>
              
              {/* Subtitle with increased spacing */}
              <p className="text-xl leading-relaxed text-gray-600">
                An in-depth exploration of retinal scanning technology, its advantages over iris recognition, 
                and its potential applications in next-generation security systems.
              </p>
              
              {/* Meta information with improved styling */}
              <div className="flex flex-wrap items-center gap-x-8 gap-y-4 border-y border-gray-200 py-4">
                <div className="flex items-center text-gray-700">
                  <span className="text-sm font-medium text-gray-500">Published:</span>
                  <span className="ml-2 text-sm">March 16, 2025</span>
                </div>
                
                <div className="flex items-center text-gray-700">
                  <span className="text-sm font-medium text-gray-500">Reading time:</span>
                  <span className="ml-2 text-sm">12 min</span>
                </div>
                
                <div className="flex items-center text-gray-700">
                  <span className="text-sm font-medium text-gray-500">Category:</span>
                  <span className="ml-2 text-sm">Biometric Security</span>
                </div>
              </div>
              
              {/* Article summary/intro with collapsible content */}
              <div className="prose prose-lg prose-teal max-w-none text-gray-600">
                <p>
                  In an era where digital security is paramount, biometric identification stands at the forefront of 
                  authentication technologies. While fingerprints and facial recognition have become commonplace, 
                  retina scanning represents one of the most secure—yet underutilized—methods available today.
                </p>
                
                <div 
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    isContentExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="mt-4">
                    This article examines the science behind retina scanning, its technical implementation, 
                    and how it compares to other biometric methods. We'll explore current applications, 
                    future possibilities, and address privacy concerns surrounding this powerful technology.
                  </p>
                </div>
                
                <button 
                  onClick={() => setIsContentExpanded(!isContentExpanded)}
                  className="mt-2 flex items-center text-sm font-medium text-teal-600 hover:text-teal-700"
                  aria-expanded={isContentExpanded}
                  aria-controls="expandable-content"
                >
                  {isContentExpanded ? 'Read less' : 'Read more'}
                  <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${isContentExpanded ? 'rotate-180 transform' : ''}`} />
                </button>
              </div>
              
              {/* CTA buttons with improved styling */}
              <div className="flex flex-wrap gap-4">
                <a
                  href="#what-is-retina-scan"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection('what-is-retina-scan');
                  }}
                  className="inline-flex items-center rounded-md bg-teal-600 px-6 py-3 text-base font-medium text-white shadow-sm transition-colors hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                >
                  Start Reading
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
                <a
                  href="#"
                  className="inline-flex items-center rounded-md border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                >
                  Download PDF
                </a>
              </div>
            </div>
          </div>
          
          {/* Right sidebar - 2 columns on large screens */}
          <div className="mt-8 rounded-xl bg-gray-50 p-6 shadow-sm lg:col-span-2 lg:mt-0">
            <div className="space-y-6">
              {/* Table of contents */}
              <div>
                <h3 className="mb-4 text-lg font-semibold text-gray-900">Table of Contents</h3>
                <nav>
                  <ul className="space-y-3">
                    {tableOfContentsItems.map((item, index) => (
                      <li key={item.id}>
                        <a
                          href={`#${item.id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            scrollToSection(item.id);
                          }}
                          className="group flex items-center text-gray-700 transition-colors hover:text-teal-600"
                        >
                          <span className="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-sm font-medium text-gray-700 group-hover:bg-teal-100 group-hover:text-teal-800">
                            {index + 1}
                          </span>
                          <span className="text-sm font-medium">{item.title}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
              
              {/* Share section */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">Share this article</h3>
                <div className="flex space-x-4">
                  <a
                    href="#"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white transition-transform hover:scale-110 hover:bg-blue-700"
                    aria-label="Share on Facebook"
                  >
                    <Facebook className="h-5 w-5" />
                  </a>
                  <a
                    href="#"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-400 text-white transition-transform hover:scale-110 hover:bg-blue-500"
                    aria-label="Share on Twitter"
                  >
                    <Twitter className="h-5 w-5" />
                  </a>
                  <a
                    href="#"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-700 text-white transition-transform hover:scale-110 hover:bg-blue-800"
                    aria-label="Share on LinkedIn"
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                  <a
                    href="#"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-600 text-white transition-transform hover:scale-110 hover:bg-gray-700"
                    aria-label="Copy link"
                  >
                    <Link className="h-5 w-5" />
                  </a>
                </div>
              </div>
              
              {/* Featured image or illustration */}
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <div className="aspect-w-4 aspect-h-3 relative h-48 w-full bg-gradient-to-br from-teal-500 to-blue-600">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-24 w-24 rounded-full bg-white/20 backdrop-blur-md"></div>
                    <div className="absolute h-16 w-16 rounded-full border-4 border-white"></div>
                    <div className="absolute h-4 w-4 rounded-full bg-teal-200"></div>
                    <div className="absolute h-48 w-48 rounded-full border border-white/30"></div>
                  </div>
                </div>
                <div className="bg-white p-4">
                  <p className="text-sm text-gray-600">
                    Illustration of retina scanning technology with pattern recognition visualization
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="mt-16 flex justify-center">
        <button
          onClick={() => scrollToSection('what-is-retina-scan')}
          className="flex animate-bounce flex-col items-center text-gray-500 transition-colors hover:text-teal-600"
          aria-label="Scroll to content"
        >
          <span className="mb-2 text-sm font-medium">Scroll to explore</span>
          <ChevronDown className="h-6 w-6" />
        </button>
      </div>
    </section>
  );
};
