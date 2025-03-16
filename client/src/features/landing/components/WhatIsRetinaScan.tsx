import { useState } from 'react';
import { Plus, Minus, Eye } from 'lucide-react';

type ContentItem = {
  highlight: string;
  text: string;
};

type SectionContent = {
  title: string;
  content: {
    description: string;
    items: ContentItem[];
  };
};

export const WhatIsRetinaScan = () => {
  const [expandedSection, setExpandedSection] = useState<number | null>(null);

  const toggleSection = (sectionIndex: number) => {
    setExpandedSection(expandedSection === sectionIndex ? null : sectionIndex);
  };

  const sections: SectionContent[] = [
    {
      title: "Understanding the Retina",
      content: {
        description: "The retina, located at the back of the eye, is a layer of tissue that is essential for vision. It's in this area where light entering the eye is converted into neural signals that the brain interprets as visual images. The retina's complex structure includes various cells, but for retina scans, the focus is mainly on the intricate network of retinal blood vessels.",
        items: [
          { highlight: "Complex Structure", text: "The retina is a multi-layered, light-sensitive tissue lining the posterior portion of the eye. Its primary function is to receive light that the lens has focused, convert the light into neural signals, and send these signals to the brain for visual recognition." },
          { highlight: "Retinal Blood Vessels", text: "Integral to retinal scans are the blood vessels in the retina. Each individual's pattern of retinal blood vessels is unique and typically remains unchanged throughout their life, barring certain diseases or conditions." },
          { highlight: "Optic Nerve", text: "Serving as the data highway between the eye and the brain, the optic nerve plays a crucial role in vision. It exits at the optic disc, creating a distinct pattern in the vascular network that is also analyzed during retinal scanning." }
        ]
      }
    },
    {
      title: "How Retina Scanning Works",
      content: {
        description: "A retina scan is a biometric technique that involves analyzing the layer of blood vessels situated at the back of the eye. It captures the unique patterns formed by these blood vessels, creating what is essentially a 'vascular map' of an individual's eye.",
        items: [
          { highlight: "Scanning Process", text: "During a retina scan, a person looks into a specialized device that emits a low-energy infrared light. This light illuminates the blood vessels in the retina, which are then captured by a camera within the device." },
          { highlight: "Pattern Recognition", text: "The captured image is processed to extract the pattern of blood vessels. Advanced algorithms analyze the branching pattern, thickness, and arrangement of these vessels to create a digital template." },
          { highlight: "Template Comparison", text: "For identification or verification purposes, the newly created template is compared against previously stored templates in a database. A match indicates a positive identification." }
        ]
      }
    },
    {
      title: "Uniqueness and Stability",
      content: {
        description: "What makes retina scans particularly valuable in biometric identification is the remarkable uniqueness and stability of retinal patterns.",
        items: [
          { highlight: "Biological Uniqueness", text: "The pattern of blood vessels in the retina is unique to each individual, even among identical twins. This makes it an exceptionally reliable biometric identifier." },
          { highlight: "Pattern Stability", text: "Unlike some biometric features that can change with age or environmental factors, retinal patterns remain relatively stable throughout a person's life, barring serious eye injuries or certain medical conditions." },
          { highlight: "Difficult to Replicate", text: "The retina's location inside the eye makes it extremely difficult to forge or replicate, offering a level of security that surpasses many other biometric methods." }
        ]
      }
    }
  ];

  return (
    <section className="relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute -left-24 top-20 -z-10 h-64 w-64 rounded-full bg-teal-50 opacity-60 blur-3xl"></div>
      <div className="absolute -right-24 bottom-20 -z-10 h-64 w-64 rounded-full bg-blue-50 opacity-60 blur-3xl"></div>
      
      <div className="container mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-4 inline-block bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl lg:text-5xl">
            What is a Retina Scan?
          </h2>
          <div className="mx-auto mt-4 max-w-3xl">
            <p className="text-lg text-gray-600">
              The eye, often celebrated as the most complex organ in the human body, holds the key to one of the most 
              secure forms of biometric identification: the retina scan.
            </p>
          </div>
        </div>

        <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Left column - Detailed description */}
          <div className="space-y-6 pr-0 text-gray-700 leading-relaxed md:pr-6">
            <p className="rounded-lg border-l-4 border-teal-500 bg-teal-50 p-4 text-lg">
              A retina scan, or retinal scanning, leverages the unique patterns of blood vessels in a person's retina, 
              a thin layer of tissue situated at the back of the eye, to establish, identify, or verify an individual's 
              identity with remarkable accuracy.
            </p>
            
            <p>
              This biometric technology stands apart from other identification methods due to its exceptional accuracy and
              security. The unique pattern of blood vessels in the retina forms what is essentially a biological fingerprint,
              but one that is protected inside the body and extremely difficult to replicate or forge.
            </p>
            
            <p>
              While retina scanning has traditionally been associated with high-security applications, recent advancements 
              in both hardware miniaturization and processing algorithms have begun to make this technology more accessible 
              for a wider range of uses.
            </p>
          </div>
          
          {/* Right column - Eye illustration */}
          <div className="flex items-center justify-center">
            <div className="relative h-64 w-64 rounded-full bg-gradient-to-br from-blue-100 to-teal-100 p-1 shadow-lg">
              <div className="absolute inset-0 rounded-full bg-white/80"></div>
              <div className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 transform rounded-full border-4 border-teal-200 bg-gradient-to-br from-blue-500/10 to-teal-500/10"></div>
              <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-gradient-to-br from-blue-500 to-teal-600">
                <div className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-black">
                  <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-white"></div>
                </div>
              </div>
              
              {/* Animated scan effect */}
              <div className="absolute left-1/2 top-0 h-full w-1 -translate-x-1/2 transform bg-teal-400/30 animate-pulse motion-reduce:animate-none"></div>

              {/* Blood vessel representation */}
              <div className="absolute inset-0 z-10 rounded-full">
                <svg 
                  viewBox="0 0 200 200" 
                  className="h-full w-full overflow-visible opacity-60"
                >
                  {/* Using standard Tailwind animations with custom delays via CSS variables */}
                  <path 
                    d="M100,100 L140,70 L160,85 L170,60" 
                    className="stroke-red-500 stroke-[0.5] fill-none animate-pulse motion-reduce:animate-none" 
                    style={{ animationDelay: '0ms' }}
                  />
                  <path 
                    d="M100,100 L60,70 L40,85 L30,60" 
                    className="stroke-red-500 stroke-[0.5] fill-none animate-pulse motion-reduce:animate-none" 
                    style={{ animationDelay: '300ms' }}
                  />
                  <path 
                    d="M100,100 L120,130 L150,140 L160,160" 
                    className="stroke-red-500 stroke-[0.5] fill-none animate-pulse motion-reduce:animate-none" 
                    style={{ animationDelay: '600ms' }}
                  />
                  <path 
                    d="M100,100 L80,130 L50,140 L40,160" 
                    className="stroke-red-500 stroke-[0.5] fill-none animate-pulse motion-reduce:animate-none" 
                    style={{ animationDelay: '900ms' }}
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Expandable sections with details */}
        <div className="mb-8 space-y-4">
          {sections.map((section, index) => (
            <div key={index} className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all duration-200 hover:shadow-md">
              <button
                className="flex w-full items-center justify-between px-6 py-4 text-left"
                onClick={() => toggleSection(index)}
                aria-expanded={expandedSection === index}
                aria-controls={`section-content-${index}`}
              >
                <div className="flex items-center">
                  <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 text-teal-600">
                    <Eye className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{section.title}</h3>
                </div>
                <div className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 text-gray-400">
                  {expandedSection === index ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </div>
              </button>
              
              <div 
                id={`section-content-${index}`}
                className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                  expandedSection === index ? 'max-h-[1000px] pb-6 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <p className="mb-4 text-gray-700">{section.content.description}</p>
                <ul className="space-y-3 text-gray-700">
                  {section.content.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex">
                      <span className="mr-2 text-teal-500">•</span>
                      <div>
                        <span className="font-medium text-gray-900">{item.highlight}: </span>
                        {item.text}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Key facts callout */}
        <div className="rounded-2xl bg-gradient-to-r from-teal-500 to-blue-600 p-1">
          <div className="rounded-xl bg-white p-6">
            <h3 className="mb-4 text-xl font-semibold text-gray-900">Key Facts About Retina Scanning</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg bg-gray-50 p-4 text-center">
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 text-teal-600">
                  <span className="text-lg font-bold">99.9%</span>
                </div>
                <p className="text-sm text-gray-700">Accuracy rate for identification</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-4 text-center">
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 text-teal-600">
                  <span className="text-lg font-bold">&lt;2s</span>
                </div>
                <p className="text-sm text-gray-700">Time needed for verification</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-4 text-center">
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 text-teal-600">
                  <span className="text-lg font-bold">~1937</span>
                </div>
                <p className="text-sm text-gray-700">Year the technology was first conceptualized</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
