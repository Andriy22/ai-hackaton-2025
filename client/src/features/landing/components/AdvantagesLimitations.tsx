import { useState } from 'react';
import { Check, X, AlertCircle, ChevronRight, ArrowRightLeft } from 'lucide-react';

type ComparisonItem = {
  id: string;
  title: string;
  description: string;
};

type ComparisonData = {
  advantages: ComparisonItem[];
  limitations: ComparisonItem[];
};

export const AdvantagesLimitations = () => {
  const [activeTab, setActiveTab] = useState<'advantages' | 'limitations' | 'comparison'>('comparison');
  const [selectedAdvantage, setSelectedAdvantage] = useState<string>('accuracy');
  const [selectedLimitation, setSelectedLimitation] = useState<string>('invasive');

  const comparisonData: ComparisonData = {
    advantages: [
      {
        id: 'accuracy',
        title: 'Unmatched Accuracy',
        description: 'The retinal pattern offers an incredibly high level of accuracy in identification. The unique configuration of retinal blood vessels ensures that the probability of false positives is extremely low.',
      },
      {
        id: 'security',
        title: 'Enhanced Security',
        description: 'Given the internal location of the retina and the requirement of a live individual present for the scanning process, retina scans are highly secure and nearly impossible to forge or replicate.',
      },
      {
        id: 'health',
        title: 'Health Insights',
        description: 'Beyond identification, retina scans can offer valuable insights into a person\'s health. The visibility of blood vessels allows for the detection of various conditions, including diabetic retinopathy, hypertension, and other ocular or systemic health issues.',
      },
      {
        id: 'stability',
        title: 'Long-term Stability',
        description: 'Unlike some biometric identifiers that can change over time, retinal patterns remain relatively stable throughout a person\'s life, making them reliable for long-term identification purposes.',
      },
      {
        id: 'processing',
        title: 'Rapid Processing',
        description: 'Modern retina scanning technology can process and match identities in milliseconds, allowing for quick verification in secure environments.',
      }
    ],
    limitations: [
      {
        id: 'invasive',
        title: 'Invasive Nature',
        description: 'The process of retina scanning typically involves close proximity between the device and the individual\'s eye, which can be perceived as intrusive or uncomfortable. This closeness may also pose challenges for individuals with certain disabilities.',
      },
      {
        id: 'cost',
        title: 'Technological Complexity and Cost',
        description: 'The sophisticated nature of retinal scanning technology translates to higher costs and infrastructural demands. This complexity limits the feasibility of deploying retina scans in public or consumer-focused settings.',
      },
      {
        id: 'conditions',
        title: 'Sensitivity to Ocular Conditions',
        description: 'Changes in the retina due to conditions like macular degeneration or diabetic retinopathy can affect the accuracy of the scans, necessitating regular updates to the biometric data.',
      },
      {
        id: 'acceptance',
        title: 'User Acceptance',
        description: 'Many individuals may be hesitant to submit to retina scans due to privacy concerns or physical discomfort, limiting the widespread adoption of this technology.',
      },
      {
        id: 'infrastructure',
        title: 'Infrastructure Requirements',
        description: 'Implementing retina scanning systems requires specialized equipment and trained operators, making it challenging to deploy in diverse or resource-limited environments.',
      }
    ]
  };

  return (
    <section id="advantages-limitations" className="relative overflow-hidden py-16">
      {/* Decorative background elements */}
      <div className="absolute right-0 top-20 -z-10 h-96 w-96 rounded-full bg-blue-50 opacity-40 blur-3xl"></div>
      <div className="absolute -left-40 bottom-40 -z-10 h-96 w-96 rounded-full bg-teal-50 opacity-40 blur-3xl"></div>
      
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-12 text-center">
          <h2 className="mb-4 inline-block bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl lg:text-5xl">
            Advantages and Limitations
          </h2>
          <div className="mx-auto mt-6 max-w-3xl">
            <p className="text-lg text-gray-600">
              Retina scanning technology offers superior security and accuracy, but comes with practical challenges 
              that influence its implementation in various environments.
            </p>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="mb-10 flex justify-center space-x-2">
          <button
            onClick={() => setActiveTab('comparison')}
            className={`rounded-full px-6 py-2 text-sm font-medium transition-colors ${
              activeTab === 'comparison'
                ? 'bg-gradient-to-r from-blue-500 to-teal-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            aria-pressed={activeTab === 'comparison'}
            aria-label="View side by side comparison"
          >
            Side-by-Side
          </button>
          <button
            onClick={() => setActiveTab('advantages')}
            className={`rounded-full px-6 py-2 text-sm font-medium transition-colors ${
              activeTab === 'advantages'
                ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            aria-pressed={activeTab === 'advantages'}
            aria-label="View advantages"
          >
            Advantages
          </button>
          <button
            onClick={() => setActiveTab('limitations')}
            className={`rounded-full px-6 py-2 text-sm font-medium transition-colors ${
              activeTab === 'limitations'
                ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            aria-pressed={activeTab === 'limitations'}
            aria-label="View limitations"
          >
            Limitations
          </button>
        </div>

        {/* Comparison view */}
        <div className={`${activeTab === 'comparison' ? 'block' : 'hidden'}`}>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Advantages side */}
            <div className="overflow-hidden rounded-xl bg-gradient-to-br from-green-500 to-teal-600 p-1 shadow-md">
              <div className="h-full rounded-lg bg-white p-6">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600">
                    <Check className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Advantages</h3>
                </div>
                
                <div className="mb-4 space-y-2">
                  {comparisonData.advantages.map(item => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedAdvantage(item.id)}
                      className={`w-full rounded-lg px-4 py-3 text-left transition-colors ${
                        selectedAdvantage === item.id
                          ? 'bg-green-50 border border-green-200'
                          : 'bg-gray-50 hover:bg-gray-100 border border-transparent'
                      }`}
                      aria-pressed={selectedAdvantage === item.id}
                      aria-label={`Select advantage: ${item.title}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">{item.title}</span>
                        <ChevronRight className={`h-4 w-4 text-green-500 transition-transform ${
                          selectedAdvantage === item.id ? 'rotate-90' : ''
                        }`} />
                      </div>
                    </button>
                  ))}
                </div>
                
                <div className="mt-6 rounded-lg bg-green-50 p-4">
                  <h4 className="mb-2 font-medium text-gray-900">
                    {comparisonData.advantages.find(a => a.id === selectedAdvantage)?.title}
                  </h4>
                  <p className="text-sm text-gray-700">
                    {comparisonData.advantages.find(a => a.id === selectedAdvantage)?.description}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Limitations side */}
            <div className="overflow-hidden rounded-xl bg-gradient-to-br from-red-500 to-orange-500 p-1 shadow-md">
              <div className="h-full rounded-lg bg-white p-6">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600">
                    <X className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Limitations</h3>
                </div>
                
                <div className="mb-4 space-y-2">
                  {comparisonData.limitations.map(item => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedLimitation(item.id)}
                      className={`w-full rounded-lg px-4 py-3 text-left transition-colors ${
                        selectedLimitation === item.id
                          ? 'bg-red-50 border border-red-200'
                          : 'bg-gray-50 hover:bg-gray-100 border border-transparent'
                      }`}
                      aria-pressed={selectedLimitation === item.id}
                      aria-label={`Select limitation: ${item.title}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">{item.title}</span>
                        <ChevronRight className={`h-4 w-4 text-red-500 transition-transform ${
                          selectedLimitation === item.id ? 'rotate-90' : ''
                        }`} />
                      </div>
                    </button>
                  ))}
                </div>
                
                <div className="mt-6 rounded-lg bg-red-50 p-4">
                  <h4 className="mb-2 font-medium text-gray-900">
                    {comparisonData.limitations.find(l => l.id === selectedLimitation)?.title}
                  </h4>
                  <p className="text-sm text-gray-700">
                    {comparisonData.limitations.find(l => l.id === selectedLimitation)?.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Bottom comparison tip */}
          <div className="mt-8 flex items-center justify-center">
            <div className="inline-flex items-center rounded-full bg-blue-50 px-4 py-2 text-sm text-blue-700">
              <ArrowRightLeft className="mr-2 h-4 w-4" />
              <span>Click on any item above to see details</span>
            </div>
          </div>
        </div>
        
        {/* Advantages view */}
        <div className={`${activeTab === 'advantages' ? 'block' : 'hidden'}`}>
          <div className="overflow-hidden rounded-xl bg-white shadow-md">
            <div className="border-b border-gray-100 bg-green-50 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <Check className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Key Advantages of Retina Scans</h3>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {comparisonData.advantages.map(item => (
                  <div key={item.id} className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm transition-all hover:shadow-md hover:border-green-200">
                    <h4 className="mb-2 font-medium text-gray-900">{item.title}</h4>
                    <p className="text-sm text-gray-700">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Limitations view */}
        <div className={`${activeTab === 'limitations' ? 'block' : 'hidden'}`}>
          <div className="overflow-hidden rounded-xl bg-white shadow-md">
            <div className="border-b border-gray-100 bg-red-50 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600">
                  <X className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Key Limitations of Retina Scans</h3>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {comparisonData.limitations.map(item => (
                  <div key={item.id} className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm transition-all hover:shadow-md hover:border-red-200">
                    <h4 className="mb-2 font-medium text-gray-900">{item.title}</h4>
                    <p className="text-sm text-gray-700">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Balancing the Equation */}
        <div className="mt-12 overflow-hidden rounded-xl bg-gradient-to-r from-gray-900 to-blue-900 p-1 shadow-lg">
          <div className="rounded-lg bg-white p-6">
            <div className="sm:flex sm:items-center sm:justify-between">
              <div className="mb-6 flex items-center gap-3 sm:mb-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <AlertCircle className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Balancing the Equation</h3>
              </div>
              
              <div className="relative h-24 w-24 overflow-hidden rounded-full bg-gradient-to-r from-blue-200 to-teal-200 sm:h-32 sm:w-32 sm:flex-shrink-0">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-20 w-20 animate-pulse rounded-full bg-blue-50 sm:h-28 sm:w-28"></div>
                  <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-teal-400 to-transparent"></div>
                  <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-blue-400 to-transparent"></div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 space-y-4 text-gray-700">
              <p>
                While retina scans offer a high degree of security and accuracy, the balance between the technology's 
                benefits and its practical challenges is crucial. The cost, comfort, and accessibility factors play 
                significant roles in determining the feasibility of implementing retina scanning solutions.
              </p>
              <p>
                As technology advances, we may see improvements that address current limitations, such as more 
                comfortable scanning procedures, reduced costs, and increased adaptability to various environmental 
                conditions, potentially expanding the applicability of retina scanning beyond its current niche.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
