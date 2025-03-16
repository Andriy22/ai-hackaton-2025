import React from 'react';
import { Check, X, AlertCircle } from 'lucide-react';

export const AdvantagesLimitations: React.FC = () => {
  return (
    <section className="py-16 px-4 lg:px-8 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute -right-20 top-10 h-64 w-64 rounded-full bg-blue-50 opacity-50 blur-3xl"></div>
      <div className="absolute -left-20 bottom-10 h-64 w-64 rounded-full bg-cyan-50 opacity-50 blur-3xl"></div>
      
      <div className="container mx-auto max-w-4xl relative z-10">
        <h2 className="mb-8 text-3xl font-bold text-gray-900">Advantages and Limitations of Retina Scans</h2>
        
        <div className="mb-10 text-gray-700 leading-relaxed">
          <p className="mb-4">
            Retina scans, often lauded for their accuracy and uniqueness, stand at the forefront of biometric security solutions. However, like any technology, they come with their own set of advantages and potential drawbacks. This section provides a balanced view, dissecting the strengths that make retina scanning a formidable security tool, and the limitations that constrain its widespread adoption.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Advantages */}
          <div className="group rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 group-hover:bg-green-200">
                <Check className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900">Advantages of Retina Scans</h3>
            </div>
            
            <div className="text-gray-700 leading-relaxed">
              <p className="mb-4">
                The benefits of retina scanning technology are rooted in its accuracy, security, and the detailed data it provides.
              </p>
              
              <div className="space-y-4">
                <div className="rounded-lg bg-gray-50 p-4">
                  <h4 className="mb-2 font-medium text-gray-900">Unmatched Accuracy</h4>
                  <p className="text-sm text-gray-700">
                    The retinal pattern offers an incredibly high level of accuracy in identification. The unique configuration of retinal blood vessels ensures that the probability of false positives is extremely low.
                  </p>
                </div>
                
                <div className="rounded-lg bg-gray-50 p-4">
                  <h4 className="mb-2 font-medium text-gray-900">Security</h4>
                  <p className="text-sm text-gray-700">
                    Given the internal location of the retina and the requirement of a live individual present for the scanning process, retina scans are highly secure and nearly impossible to forge or replicate.
                  </p>
                </div>
                
                <div className="rounded-lg bg-gray-50 p-4">
                  <h4 className="mb-2 font-medium text-gray-900">Health Insights</h4>
                  <p className="text-sm text-gray-700">
                    Beyond identification, retina scans can offer valuable insights into a person's health. The visibility of blood vessels allows for the detection of various conditions, including diabetic retinopathy, hypertension, and other ocular or systemic health issues.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Limitations */}
          <div className="group rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 group-hover:bg-red-200">
                <X className="h-5 w-5 text-red-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900">Limitations of Retina Scans</h3>
            </div>
            
            <div className="text-gray-700 leading-relaxed">
              <p className="mb-4">
                Despite the significant advantages, the implementation and widespread adoption of retina scans are hindered by several factors, from user comfort to technological and infrastructural requirements.
              </p>
              
              <div className="space-y-4">
                <div className="rounded-lg bg-gray-50 p-4">
                  <h4 className="mb-2 font-medium text-gray-900">Invasive Nature</h4>
                  <p className="text-sm text-gray-700">
                    The process of retina scanning typically involves close proximity between the device and the individual's eye, which can be perceived as intrusive or uncomfortable. This closeness may also pose challenges for individuals with certain disabilities.
                  </p>
                </div>
                
                <div className="rounded-lg bg-gray-50 p-4">
                  <h4 className="mb-2 font-medium text-gray-900">Technological Complexity and Cost</h4>
                  <p className="text-sm text-gray-700">
                    The sophisticated nature of retinal scanning technology translates to higher costs and infrastructural demands. This complexity limits the feasibility of deploying retina scans in public or consumer-focused settings.
                  </p>
                </div>
                
                <div className="rounded-lg bg-gray-50 p-4">
                  <h4 className="mb-2 font-medium text-gray-900">Sensitivity to Ocular Conditions</h4>
                  <p className="text-sm text-gray-700">
                    Changes in the retina due to conditions like macular degeneration or diabetic retinopathy can affect the accuracy of the scans, necessitating regular updates to the biometric data.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Balancing the Equation */}
        <div className="mt-10 rounded-xl bg-gradient-to-r from-gray-800 to-blue-900 p-6 text-white shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="h-6 w-6 text-blue-300" />
            <h3 className="text-2xl font-semibold">Balancing the Equation</h3>
          </div>
          <p className="text-gray-100">
            While retina scans offer a high degree of security and accuracy, the balance between the technology's benefits and its practical challenges is crucial. The cost, comfort, and accessibility factors play significant roles in determining the feasibility of implementing retina scanning solutions, especially in environments that require quick or non-intrusive methods.
          </p>
          <p className="mt-4 text-gray-100">
            Retina scans represent a pinnacle of biometric identification technology, offering unmatched accuracy and valuable health insights. However, the practical deployment of this technology is influenced by factors such as user comfort, health condition impacts, and the cost and sophistication of the required equipment.
          </p>
        </div>
      </div>
    </section>
  );
};
