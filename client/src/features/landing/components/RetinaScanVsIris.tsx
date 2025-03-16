import React from 'react';

export const RetinaScanVsIris: React.FC = () => {
  return (
    <section className="bg-gray-50 py-16 px-4 lg:px-8">
      <div className="container mx-auto max-w-4xl">
        <h2 className="mb-8 text-3xl font-bold text-gray-900">Retina Scans vs. Iris Recognition</h2>
        
        <div className="mb-10 text-gray-700 leading-relaxed">
          <p className="mb-4">
            In the realm of ocular-based biometric technologies, both retina scans and iris recognition have carved out significant roles. However, these two modalities, while often mentioned in the same breath, differ fundamentally in their approach, technology, and application. This section will explore the distinct characteristics of each method, elucidating their differences and applications.
          </p>
        </div>

        <div className="grid gap-12 md:grid-cols-2">
          {/* Left column */}
          <div>
            <div className="mb-8 rounded-xl bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-2xl font-semibold text-gray-900">Fundamental Differences</h3>
              <div className="text-gray-700 leading-relaxed">
                <p className="mb-4">
                  The primary distinction between retina scans and iris recognition lies in the part of the eye each technology analyzes and the method of capturing this data.
                </p>
                <ul className="mb-4 ml-6 list-disc space-y-2">
                  <li>
                    <span className="font-medium">Retina Scans:</span> Retina scanning involves analyzing the pattern of blood vessels in the retina, located at the back of the eye. It requires low energy infrared light to illuminate the intricate network of blood vessels.
                  </li>
                  <li>
                    <span className="font-medium">Iris Recognition:</span> Iris recognition, on the other hand, involves capturing the unique patterns in the colored part of the eye, the iris. It typically uses visible light or near-infrared illumination to highlight the features of the iris.
                  </li>
                </ul>
              </div>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-2xl font-semibold text-gray-900">Comparing Accuracy and Security</h3>
              <div className="text-gray-700 leading-relaxed">
                <p className="mb-4">
                  While both retina scans and iris recognition are esteemed for their precision, the presence of certain diseases or conditions can impact the accuracy and reliability of these biometric methods.
                </p>
                <ul className="mb-4 ml-6 list-disc space-y-2">
                  <li>
                    <span className="font-medium">Accuracy of Retina Scans:</span> Retina scans are highly accurate due to the unique and complex pattern of retinal blood vessels. However, this accuracy can be compromised by ocular conditions such as diabetic retinopathy, macular degeneration, or other retinal degenerative disorders.
                  </li>
                  <li>
                    <span className="font-medium">Resilience of Iris Recognition:</span> Compared to retina scans, iris recognition is less likely to be affected by common eye diseases. This is because most conditions that impact the clarity of the iris, such as cataracts, are usually treatable, and the fundamental iris pattern remains unchanged.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div>
            <div className="mb-8 rounded-xl bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-2xl font-semibold text-gray-900">User Experience and Applications</h3>
              <div className="text-gray-700 leading-relaxed">
                <p className="mb-4">
                  The practicality of implementing these technologies can vary significantly, influenced by factors like user comfort, ease of use, and the potential need for physical contact or proximity to the scanning device.
                </p>
                <ul className="mb-4 ml-6 list-disc space-y-2">
                  <li>
                    <span className="font-medium">User Experience with Retina Scans:</span> Retina scanning can be more intrusive and less comfortable for some individuals. It requires the subject to position their eye close to the device, which can be challenging for those with certain disabilities or discomfort with close contact.
                  </li>
                  <li>
                    <span className="font-medium">User Experience with Iris Recognition:</span> Iris recognition tends to be less intrusive and can often be performed at a distance (contactless), making it more user-friendly and quicker for mass scanning scenarios, such as airport security checks and national ID registration.
                  </li>
                </ul>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 p-6 shadow-sm">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white opacity-10 blur-xl"></div>
              <div className="relative z-10">
                <h3 className="mb-4 text-2xl font-semibold text-white">Key Takeaway</h3>
                <p className="text-white/90">
                  While retina scans and iris recognition each offer unique merits in the realm of biometric identification, their practical deployment is influenced by technological availability, application context, and the balance of security against accessibility. Retina scanning, with its unparalleled precision, remains a highly specialized solution predominantly reserved for high-security sectors.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
