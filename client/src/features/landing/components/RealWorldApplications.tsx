import React from 'react';
import { ShieldCheck, HeartPulse, CreditCard, AlertTriangle } from 'lucide-react';

export const RealWorldApplications: React.FC = () => {
  return (
    <section className="bg-gray-50 py-16 px-4 lg:px-8">
      <div className="container mx-auto max-w-4xl">
        <h2 className="mb-8 text-3xl font-bold text-gray-900">Possible Real-World Applications of Retina Scanning</h2>
        
        <div className="mb-10 text-gray-700 leading-relaxed">
          <p className="mb-4">
            Although the deployment of retina scanning technology in everyday scenarios is relatively rare due to its high cost and operational requirements, its potential applications, particularly in sectors where security and accuracy are non-negotiable, are noteworthy. This section explores the potential and speculative applications of retina scanning, reflecting on where this advanced technology could make a significant impact.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2">
          {/* High-Security Access Control */}
          <div className="group rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md hover:translate-y-[-4px]">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 group-hover:bg-blue-200">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">High-Security Access Control</h3>
            </div>
            
            <div className="text-gray-700 leading-relaxed">
              <p className="mb-4">
                The precision of retina scanning makes it an ideal candidate for environments where security cannot be compromised.
              </p>
              <ul className="space-y-2 ml-5 list-disc">
                <li>
                  <span className="font-medium">Military and Government Facilities:</span> Retina scanning could be considered for military bases and sensitive government installations where the highest level of security is crucial.
                </li>
                <li>
                  <span className="font-medium">Nuclear Power Plants:</span> In theoretical applications, retina scanning could serve as a robust access control mechanism in nuclear facilities, safeguarding sensitive areas from unauthorized entry.
                </li>
              </ul>
            </div>
          </div>
          
          {/* Healthcare and Research */}
          <div className="group rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md hover:translate-y-[-4px]">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600 group-hover:bg-green-200">
                <HeartPulse className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Healthcare and Research</h3>
            </div>
            
            <div className="text-gray-700 leading-relaxed">
              <p className="mb-4">
                The detailed imagery provided by retina scans can be extremely valuable in healthcare settings, not just for identification but also for medical diagnosis.
              </p>
              <ul className="space-y-2 ml-5 list-disc">
                <li>
                  <span className="font-medium">Patient Identification:</span> In specialized healthcare environments, retina scanning could ensure accurate patient identification, aligning medical services and records with the correct individuals securely.
                </li>
                <li>
                  <span className="font-medium">Medical Research:</span> Retinal imaging is already a cornerstone in studying eye diseases. With further advancements, retina scanning could play a pivotal role in diagnosing and monitoring conditions like macular degeneration and diabetic retinopathy more effectively.
                </li>
              </ul>
            </div>
          </div>
          
          {/* Financial Transactions */}
          <div className="group rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md hover:translate-y-[-4px]">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 text-yellow-600 group-hover:bg-yellow-200">
                <CreditCard className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Financial Transactions</h3>
            </div>
            
            <div className="text-gray-700 leading-relaxed">
              <p className="mb-4">
                Retina scanning could also play a vital role in securing financial transactions in specific settings.
              </p>
              <ul className="space-y-2 ml-5 list-disc">
                <li>
                  <span className="font-medium">Banking and Financial Institutions:</span> Retina scanning could be explored as an additional layer of security in high-security banking facilities, particularly for accessing safe deposit boxes or restricted areas.
                </li>
              </ul>
            </div>
          </div>
          
          {/* Challenges in Wider Adoption */}
          <div className="group rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md hover:translate-y-[-4px]">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 group-hover:bg-red-200">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Challenges in Wider Adoption</h3>
            </div>
            
            <div className="text-gray-700 leading-relaxed">
              <p className="mb-4">
                Despite these applications, the widespread adoption of retina scanning is hindered by several factors:
              </p>
              <ul className="space-y-2 ml-5 list-disc">
                <li>
                  <span className="font-medium">Cost and Complexity:</span> The high cost and complexity of retinal scanning equipment limit its use to environments where budget is less of a concern compared to the security offered.
                </li>
                <li>
                  <span className="font-medium">User Comfort and Accessibility:</span> The need for close contact with the scanning device and the sensitivity of the procedure can be deterrents for many users, making the technology less suitable for public or consumer-focused applications.
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-10 rounded-xl bg-white p-6 border border-gray-200 text-gray-700 leading-relaxed">
          <p>
            While retina scanning's direct implementation in everyday life is currently limited, its potential in sectors like high-security environments, healthcare, and specialized financial systems underscores its value. The balance between cost, user comfort, and security will continue to shape the perception and utilization of retina scanning technology.
          </p>
        </div>
      </div>
    </section>
  );
};
