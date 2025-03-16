import { useState } from 'react';
import { ShieldCheck, HeartPulse, CreditCard, AlertTriangle, Building, Globe, PlusCircle } from 'lucide-react';

type ApplicationCard = {
  id: string;
  title: string;
  icon: React.ReactNode;
  iconBgClass: string;
  iconColorClass: string;
  iconHoverClass: string;
  description: string;
  examples: Array<{
    title: string;
    description: string;
  }>;
};

export const RealWorldApplications = () => {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  
  const toggleCard = (id: string) => {
    setExpandedCard(expandedCard === id ? null : id);
  };
  
  const applications: ApplicationCard[] = [
    {
      id: "security",
      title: "High-Security Access Control",
      icon: <ShieldCheck className="h-6 w-6" />,
      iconBgClass: "bg-blue-100",
      iconColorClass: "text-blue-600",
      iconHoverClass: "group-hover:bg-blue-200",
      description: "The precision of retina scanning makes it an ideal candidate for environments where security cannot be compromised.",
      examples: [
        {
          title: "Military and Government Facilities",
          description: "Retina scanning could be considered for military bases and sensitive government installations where the highest level of security is crucial."
        },
        {
          title: "Nuclear Power Plants",
          description: "In theoretical applications, retina scanning could serve as a robust access control mechanism in nuclear facilities, safeguarding sensitive areas from unauthorized entry."
        },
        {
          title: "Intelligence Agencies",
          description: "Intelligence organizations may utilize retina scanning for their most sensitive operations and secure facilities."
        }
      ]
    },
    {
      id: "healthcare",
      title: "Healthcare and Research",
      icon: <HeartPulse className="h-6 w-6" />,
      iconBgClass: "bg-teal-100",
      iconColorClass: "text-teal-600",
      iconHoverClass: "group-hover:bg-teal-200",
      description: "The detailed imagery provided by retina scans can be extremely valuable in healthcare settings, not just for identification but also for medical diagnosis.",
      examples: [
        {
          title: "Patient Identification",
          description: "In specialized healthcare environments, retina scanning could ensure accurate patient identification, aligning medical services and records with the correct individuals securely."
        },
        {
          title: "Medical Research",
          description: "Retinal imaging is already a cornerstone in studying eye diseases. With further advancements, retina scanning could play a pivotal role in diagnosing and monitoring conditions like macular degeneration and diabetic retinopathy more effectively."
        },
        {
          title: "Telemedicine Authentication",
          description: "As telemedicine grows, secure patient authentication becomes crucial. Retina scanning could verify identities during remote consultations for sensitive medical matters."
        }
      ]
    },
    {
      id: "financial",
      title: "Financial Transactions",
      icon: <CreditCard className="h-6 w-6" />,
      iconBgClass: "bg-amber-100",
      iconColorClass: "text-amber-600",
      iconHoverClass: "group-hover:bg-amber-200",
      description: "Retina scanning could also play a vital role in securing financial transactions in specific settings.",
      examples: [
        {
          title: "Banking and Financial Institutions",
          description: "Retina scanning could be explored as an additional layer of security in high-security banking facilities, particularly for accessing safe deposit boxes or restricted areas."
        },
        {
          title: "High-Value Transactions",
          description: "For transactions above certain thresholds, retina scanning could provide additional authentication, especially in private banking services."
        },
        {
          title: "Central Bank Operations",
          description: "Access to monetary policy operations and gold reserves could be secured using retina scanning technology."
        }
      ]
    },
    {
      id: "corporate",
      title: "Corporate Security",
      icon: <Building className="h-6 w-6" />,
      iconBgClass: "bg-indigo-100",
      iconColorClass: "text-indigo-600",
      iconHoverClass: "group-hover:bg-indigo-200",
      description: "Enterprises with sensitive intellectual property and research facilities may employ retina scanning for their most secure areas.",
      examples: [
        {
          title: "R&D Laboratories",
          description: "Companies developing proprietary technologies might secure their research facilities with retina scanning to protect intellectual property."
        },
        {
          title: "Data Centers",
          description: "Critical data infrastructure could implement retina scanning for physical access control to server rooms and network operation centers."
        },
        {
          title: "Executive Floors",
          description: "Areas where strategic corporate decisions are made might employ retina scanning to limit access to authorized personnel only."
        }
      ]
    },
    {
      id: "border",
      title: "Border and Immigration Control",
      icon: <Globe className="h-6 w-6" />,
      iconBgClass: "bg-purple-100",
      iconColorClass: "text-purple-600",
      iconHoverClass: "group-hover:bg-purple-200",
      description: "Biometric identification at borders is increasingly important, and retina scanning offers one of the most secure methods.",
      examples: [
        {
          title: "Enhanced Border Security",
          description: "For high-security border crossings or immigration points, retina scanning could verify identities when absolute certainty is required."
        },
        {
          title: "Special Access Programs",
          description: "Expedited border crossing programs for pre-screened travelers might incorporate retina scanning for the highest tier of security clearance."
        },
        {
          title: "Diplomatic Channels",
          description: "Special immigration channels for diplomatic personnel could utilize retina scanning for enhanced security and verification."
        }
      ]
    },
    {
      id: "challenges",
      title: "Challenges in Wider Adoption",
      icon: <AlertTriangle className="h-6 w-6" />,
      iconBgClass: "bg-red-100",
      iconColorClass: "text-red-600",
      iconHoverClass: "group-hover:bg-red-200",
      description: "Despite these applications, the widespread adoption of retina scanning is hindered by several factors:",
      examples: [
        {
          title: "Cost and Complexity",
          description: "The high cost and complexity of retinal scanning equipment limit its use to environments where budget is less of a concern compared to the security offered."
        },
        {
          title: "User Comfort and Accessibility",
          description: "The need for close contact with the scanning device and the sensitivity of the procedure can be deterrents for many users, making the technology less suitable for public or consumer-focused applications."
        },
        {
          title: "Privacy Concerns",
          description: "As with all biometric data, retinal scans raise significant privacy questions regarding data storage, consent, and potential misuse of this highly personal information."
        }
      ]
    }
  ];
  
  return (
    <section id="applications" className="relative overflow-hidden py-16">
      {/* Decorative background elements */}
      <div className="absolute left-0 top-40 -z-10 h-96 w-96 rounded-full bg-blue-50 opacity-40 blur-3xl"></div>
      <div className="absolute right-0 bottom-40 -z-10 h-96 w-96 rounded-full bg-teal-50 opacity-40 blur-3xl"></div>
      
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-4 inline-block bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl lg:text-5xl">
            Real-World Applications
          </h2>
          <div className="mx-auto mt-6 max-w-3xl">
            <p className="text-lg text-gray-600">
              While retina scanning is currently limited in everyday use due to cost and complexity, 
              its potential in high-security environments demonstrates its significant value.
            </p>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {applications.map((app) => (
            <div 
              key={app.id}
              className="group relative overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-300 hover:shadow-md"
            >
              <div 
                className="cursor-pointer p-6"
                onClick={() => toggleCard(app.id)}
                aria-expanded={expandedCard === app.id}
                aria-controls={`card-content-${app.id}`}
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && toggleCard(app.id)}
                aria-label={`Expand ${app.title} section`}
              >
                <div className="mb-5 flex items-center gap-3">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-full transition-colors ${app.iconBgClass} ${app.iconColorClass} ${app.iconHoverClass}`}>
                    {app.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{app.title}</h3>
                </div>
                
                <div className="text-gray-700">
                  <p className="mb-4 line-clamp-2">{app.description}</p>
                  
                  <div className="flex items-center text-sm font-medium text-teal-600">
                    <span>{expandedCard === app.id ? 'Show less' : 'Show examples'}</span>
                    <div className={`ml-1 transition-transform duration-300 ${expandedCard === app.id ? 'rotate-180' : ''}`}>
                      <PlusCircle className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </div>
              
              <div 
                id={`card-content-${app.id}`}
                className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                  expandedCard === app.id 
                    ? 'max-h-[500px] opacity-100 pb-6' 
                    : 'max-h-0 opacity-0'
                }`}
              >
                <div className="space-y-4 border-t border-gray-100 pt-4">
                  {app.examples.map((example, idx) => (
                    <div key={idx} className="rounded-lg bg-gray-50 p-4 transition-all duration-200 hover:bg-gray-100">
                      <h4 className="mb-1 font-medium text-gray-900">{example.title}</h4>
                      <p className="text-sm text-gray-700">{example.description}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Decorative card effects */}
              <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-blue-500 to-teal-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 overflow-hidden rounded-xl bg-gradient-to-r from-gray-900 to-gray-800 p-1 shadow-lg">
          <div className="rounded-lg bg-white p-6">
            <div className="flex flex-col items-center sm:flex-row sm:justify-between">
              <div className="mb-6 sm:mb-0 sm:max-w-xl">
                <h3 className="mb-3 text-xl font-semibold text-gray-900">Future Outlook</h3>
                <p className="text-gray-700">
                  As technology advances and costs decrease, we may see retina scanning expand beyond 
                  high-security environments into more mainstream applications, especially as concerns 
                  about digital security and identity theft continue to grow.
                </p>
              </div>
              
              <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-blue-100 to-teal-100 p-1">
                <div className="absolute inset-0 rounded-full bg-white/60"></div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/10 to-teal-500/10"></div>
                <div className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-white shadow-inner"></div>
                <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-gradient-to-br from-blue-400/20 to-teal-400/20"></div>
                <div className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-gradient-to-br from-blue-500 to-teal-500">
                  <div className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-black">
                    <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-white"></div>
                  </div>
                </div>
                
                {/* Futuristic scanning effect */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-full w-full animate-[pulse_2s_infinite] rounded-full border border-teal-500/40"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
