import { useState } from 'react';
import { Eye, Check, BarChart, UserCheck, Clock, Shield, X } from 'lucide-react';

type ComparisonItem = {
  feature: string;
  retina: {
    value: string;
    rating: 'high' | 'medium' | 'low';
    icon: React.ReactNode;
  };
  iris: {
    value: string;
    rating: 'high' | 'medium' | 'low';
    icon: React.ReactNode;
  };
};

export const RetinaScanVsIris = () => {
  const [activeTab, setActiveTab] = useState<'comparison' | 'details'>('comparison');

  const comparisonData: ComparisonItem[] = [
    {
      feature: "Accuracy",
      retina: {
        value: "Extremely High",
        rating: "high",
        icon: <BarChart className="h-4 w-4" />
      },
      iris: {
        value: "Very High",
        rating: "high",
        icon: <BarChart className="h-4 w-4" />
      }
    },
    {
      feature: "User Experience",
      retina: {
        value: "More Intrusive",
        rating: "low",
        icon: <UserCheck className="h-4 w-4" />
      },
      iris: {
        value: "Less Intrusive",
        rating: "high",
        icon: <UserCheck className="h-4 w-4" />
      }
    },
    {
      feature: "Scan Time",
      retina: {
        value: "Slower (1-5s)",
        rating: "medium",
        icon: <Clock className="h-4 w-4" />
      },
      iris: {
        value: "Faster (<1s)",
        rating: "high",
        icon: <Clock className="h-4 w-4" />
      }
    },
    {
      feature: "Security Level",
      retina: {
        value: "Highest Available",
        rating: "high",
        icon: <Shield className="h-4 w-4" />
      },
      iris: {
        value: "Very High",
        rating: "high",
        icon: <Shield className="h-4 w-4" />
      }
    },
    {
      feature: "Disease Impact",
      retina: {
        value: "More Vulnerable",
        rating: "low",
        icon: <X className="h-4 w-4" />
      },
      iris: {
        value: "Less Vulnerable",
        rating: "medium",
        icon: <Check className="h-4 w-4" />
      }
    }
  ];

  const getRatingColor = (rating: 'high' | 'medium' | 'low') => {
    switch (rating) {
      case 'high':
        return 'bg-teal-500 text-white';
      case 'medium':
        return 'bg-amber-500 text-white';
      case 'low':
        return 'bg-gray-400 text-white';
    }
  };

  return (
    <section id="retina-vs-iris" className="relative overflow-hidden py-16">
      {/* Decorative background elements */}
      <div className="absolute left-[10%] top-40 -z-10 h-72 w-72 rounded-full bg-blue-50 opacity-60 blur-3xl"></div>
      <div className="absolute right-[10%] top-20 -z-10 h-72 w-72 rounded-full bg-teal-50 opacity-60 blur-3xl"></div>
      
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="inline-block bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl lg:text-5xl">
            Retina Scans vs. Iris Recognition
          </h2>
          <div className="mx-auto mt-6 max-w-3xl">
            <p className="text-lg text-gray-600">
              Though often confused, these two ocular biometric technologies differ significantly 
              in their approach, accuracy, and practical applications.
            </p>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="mb-8 flex justify-center space-x-2">
          <button
            onClick={() => setActiveTab('comparison')}
            className={`rounded-full px-6 py-2 text-sm font-medium transition-colors ${
              activeTab === 'comparison'
                ? 'bg-gradient-to-r from-blue-500 to-teal-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            aria-pressed={activeTab === 'comparison'}
          >
            Side-by-Side Comparison
          </button>
          <button
            onClick={() => setActiveTab('details')}
            className={`rounded-full px-6 py-2 text-sm font-medium transition-colors ${
              activeTab === 'details'
                ? 'bg-gradient-to-r from-blue-500 to-teal-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            aria-pressed={activeTab === 'details'}
          >
            Detailed Analysis
          </button>
        </div>

        {/* Comparison tab content */}
        <div className={`${activeTab === 'comparison' ? 'block' : 'hidden'}`}>
          <div className="mb-8 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
              <div className="col-span-3 p-4 text-left text-sm font-medium text-gray-500">
                Feature
              </div>
              <div className="col-span-2 p-4 text-center text-sm font-medium text-teal-600">
                Retina Scan
              </div>
              <div className="col-span-2 p-4 text-center text-sm font-medium text-blue-600">
                Iris Recognition
              </div>
            </div>
            
            {comparisonData.map((item, index) => (
              <div 
                key={index} 
                className={`grid grid-cols-7 ${
                  index !== comparisonData.length - 1 ? 'border-b border-gray-200' : ''
                }`}
              >
                <div className="col-span-3 p-4 text-left">
                  <span className="font-medium text-gray-900">{item.feature}</span>
                </div>
                <div className="col-span-2 flex items-center justify-center p-4">
                  <div className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getRatingColor(item.retina.rating)}`}>
                    {item.retina.icon}
                    <span className="ml-1.5">{item.retina.value}</span>
                  </div>
                </div>
                <div className="col-span-2 flex items-center justify-center p-4">
                  <div className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getRatingColor(item.iris.rating)}`}>
                    {item.iris.icon}
                    <span className="ml-1.5">{item.iris.value}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Visual comparison */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Retina scan visual */}
            <div className="overflow-hidden rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 p-1 shadow-md">
              <div className="h-full rounded-lg bg-white p-6">
                <div className="mb-4 flex items-center">
                  <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 text-teal-600">
                    <Eye className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Retina Scanning</h3>
                </div>
                
                <div className="mb-4 flex justify-center">
                  <div className="relative h-32 w-32 overflow-hidden rounded-full bg-teal-50">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-24 w-24 rounded-full bg-white"></div>
                      <div className="absolute h-20 w-20 rounded-full border-2 border-teal-300"></div>
                      <div className="absolute h-10 w-10 rounded-full bg-teal-700/80"></div>
                      
                      {/* Retina blood vessels illustration */}
                      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100">
                        <g className="stroke-red-500/60 stroke-[0.5]">
                          <path d="M50,50 L40,35 L30,30 L25,20" fill="none" />
                          <path d="M50,50 L60,35 L70,30 L75,20" fill="none" />
                          <path d="M50,50 L40,65 L30,70 L25,80" fill="none" />
                          <path d="M50,50 L60,65 L70,70 L75,80" fill="none" />
                          <path d="M50,50 L35,40 L30,30 L20,25" fill="none" />
                          <path d="M50,50 L65,40 L70,30 L80,25" fill="none" />
                          <path d="M50,50 L35,60 L30,70 L20,75" fill="none" />
                          <path d="M50,50 L65,60 L70,70 L80,75" fill="none" />
                        </g>
                      </svg>
                      
                      {/* Scanning beam */}
                      <div className="absolute h-full w-1 translate-x-0 bg-teal-400/50 animate-[ping_1.5s_ease-in-out_infinite]"></div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3 text-sm text-gray-700">
                  <p>
                    <span className="font-medium">Scans:</span> Blood vessel patterns in the retina
                  </p>
                  <p>
                    <span className="font-medium">Uses:</span> High-security facilities, military, government
                  </p>
                  <p>
                    <span className="font-medium">Technology:</span> Low-energy infrared illumination
                  </p>
                  <p>
                    <span className="font-medium">Development:</span> First conceptualized in the 1930s
                  </p>
                </div>
              </div>
            </div>
            
            {/* Iris recognition visual */}
            <div className="overflow-hidden rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-1 shadow-md">
              <div className="h-full rounded-lg bg-white p-6">
                <div className="mb-4 flex items-center">
                  <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <Eye className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Iris Recognition</h3>
                </div>
                
                <div className="mb-4 flex justify-center">
                  <div className="relative h-32 w-32 overflow-hidden rounded-full bg-blue-50">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-24 w-24 rounded-full bg-white"></div>
                      <div className="absolute h-20 w-20 rounded-full bg-gradient-to-b from-blue-300 to-blue-600"></div>
                      <div className="absolute h-10 w-10 rounded-full bg-black"></div>
                      <div className="absolute h-2 w-2 rounded-full bg-white"></div>
                      
                      {/* Iris pattern illustration */}
                      <svg className="absolute inset-0 h-full w-full opacity-30" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="18" fill="none" className="stroke-white stroke-[0.5]" />
                        <circle cx="50" cy="50" r="15" fill="none" className="stroke-white stroke-[0.5]" />
                        <circle cx="50" cy="50" r="12" fill="none" className="stroke-white stroke-[0.5]" />
                        <path d="M32,50 L68,50" fill="none" className="stroke-white stroke-[0.5]" />
                        <path d="M50,32 L50,68" fill="none" className="stroke-white stroke-[0.5]" />
                        <path d="M36,36 L64,64" fill="none" className="stroke-white stroke-[0.5]" />
                        <path d="M36,64 L64,36" fill="none" className="stroke-white stroke-[0.5]" />
                      </svg>
                      
                      {/* Scanning effect */}
                      <div className="absolute h-[120%] w-[120%] rounded-full border-2 border-blue-300 opacity-0 animate-[ping_2s_ease-in-out_infinite]"></div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3 text-sm text-gray-700">
                  <p>
                    <span className="font-medium">Scans:</span> Unique patterns in the colored part of the eye
                  </p>
                  <p>
                    <span className="font-medium">Uses:</span> Border control, smartphones, access systems
                  </p>
                  <p>
                    <span className="font-medium">Technology:</span> Near-infrared or visible light
                  </p>
                  <p>
                    <span className="font-medium">Development:</span> Popularized in the 1990s
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Detailed analysis tab content */}
        <div className={`${activeTab === 'details' ? 'block' : 'hidden'} grid gap-8 md:grid-cols-2`}>
          {/* Left column */}
          <div className="space-y-8">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md">
              <h3 className="mb-4 text-xl font-semibold text-gray-900">Fundamental Differences</h3>
              <div className="space-y-4 text-gray-700">
                <p>
                  The primary distinction between retina scans and iris recognition lies in the part of the eye 
                  each technology analyzes and the method of capturing this data.
                </p>
                <ul className="space-y-3">
                  <li className="flex">
                    <span className="mr-2 text-teal-500">•</span>
                    <div>
                      <span className="font-medium text-gray-900">Retina Scans: </span>
                      Analyzes the pattern of blood vessels in the retina, located at the back of the eye. 
                      It requires low energy infrared light to illuminate the intricate network of blood vessels.
                    </div>
                  </li>
                  <li className="flex">
                    <span className="mr-2 text-blue-500">•</span>
                    <div>
                      <span className="font-medium text-gray-900">Iris Recognition: </span>
                      Captures the unique patterns in the colored part of the eye, the iris. 
                      It typically uses visible light or near-infrared illumination to highlight the features of the iris.
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md">
              <h3 className="mb-4 text-xl font-semibold text-gray-900">Technical Implementation</h3>
              <div className="space-y-4 text-gray-700">
                <p>
                  The technical approaches to these biometric modalities differ significantly in terms of 
                  hardware requirements, image processing techniques, and database management.
                </p>
                <ul className="space-y-3">
                  <li className="flex">
                    <span className="mr-2 text-teal-500">•</span>
                    <div>
                      <span className="font-medium text-gray-900">Retina Scan Hardware: </span>
                      Requires specialized ophthalmic equipment that can focus on the retina and 
                      capture a clear image of blood vessel patterns. This often means more expensive, 
                      specialized hardware.
                    </div>
                  </li>
                  <li className="flex">
                    <span className="mr-2 text-blue-500">•</span>
                    <div>
                      <span className="font-medium text-gray-900">Iris Recognition Hardware: </span>
                      Can be implemented with standard cameras with appropriate infrared capabilities. 
                      This has led to widespread adoption in consumer electronics like smartphones.
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Right column */}
          <div className="space-y-8">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md">
              <h3 className="mb-4 text-xl font-semibold text-gray-900">User Experience and Applications</h3>
              <div className="space-y-4 text-gray-700">
                <p>
                  The practicality of implementing these technologies varies significantly, influenced by factors 
                  like user comfort, ease of use, and the potential need for physical contact or proximity.
                </p>
                <ul className="space-y-3">
                  <li className="flex">
                    <span className="mr-2 text-teal-500">•</span>
                    <div>
                      <span className="font-medium text-gray-900">Retina Scan Experience: </span>
                      More intrusive as it requires the subject to position their eye close to the device, 
                      which can be challenging for those with certain disabilities or discomfort with close contact.
                    </div>
                  </li>
                  <li className="flex">
                    <span className="mr-2 text-blue-500">•</span>
                    <div>
                      <span className="font-medium text-gray-900">Iris Recognition Experience: </span>
                      Less intrusive and can often be performed at a distance (contactless), making it more 
                      user-friendly and quicker for mass scanning scenarios, such as airport security.
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-teal-600 p-6 shadow-md">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white opacity-10 blur-xl"></div>
              <div className="relative z-10">
                <h3 className="mb-4 text-2xl font-semibold text-white">Key Takeaway</h3>
                <p className="text-white/90 leading-relaxed">
                  While retina scans and iris recognition each offer unique merits in biometric identification, 
                  their practical deployment is influenced by technological availability, application context, 
                  and the balance of security against accessibility. 
                  
                  <span className="mt-2 block font-medium">
                    Retina scanning, with its unparalleled precision, remains a highly specialized solution 
                    predominantly reserved for high-security sectors, while iris recognition has found its way 
                    into mainstream applications due to its balance of security and user-friendliness.
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
