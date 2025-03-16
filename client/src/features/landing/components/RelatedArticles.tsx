import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const RelatedArticles: React.FC = () => {
  return (
    <section className="bg-gray-50 py-16 px-4 lg:px-8 border-t border-gray-200">
      <div className="container mx-auto max-w-4xl">
        <h2 className="mb-8 text-3xl font-bold text-gray-900">Related Articles</h2>
        
        <div className="grid gap-8 md:grid-cols-2">
          <article className="group relative overflow-hidden rounded-xl bg-white shadow-sm transition-all hover:shadow-md">
            <div className="aspect-[16/9] w-full overflow-hidden">
              <img
                src="https://www.aratek.co/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Firis-recognition-scaled.4d77ee9e.jpg&w=3840&q=75" 
                alt="Iris recognition technology close-up" 
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="p-6">
              <Link to="/landing" className="group/link">
                <h3 className="mb-2 text-xl font-semibold text-gray-900 group-hover/link:text-blue-600 transition-colors">
                  What Is Iris Recognition? Benefits and Real-World Applications
                </h3>
              </Link>
              <p className="mb-4 text-gray-700 line-clamp-3">
                Discover how iris recognition works, its advantages over other biometric methods, and where this technology is making the biggest impact in security and identification.
              </p>
              <Link 
                to="/landing" 
                className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                aria-label="Read more about Iris Recognition"
                tabIndex={0}
              >
                Read more 
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </article>

          <article className="group relative overflow-hidden rounded-xl bg-white shadow-sm transition-all hover:shadow-md">
            <div className="aspect-[16/9] w-full overflow-hidden">
              <img
                src="https://www.aratek.co/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Ffingerprint-biometrics-scaled.6c2f3d1e.jpg&w=3840&q=75" 
                alt="Fingerprint scanning technology" 
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="p-6">
              <Link to="/landing" className="group/link">
                <h3 className="mb-2 text-xl font-semibold text-gray-900 group-hover/link:text-blue-600 transition-colors">
                  The Evolution of Fingerprint Scanning in Modern Biometrics
                </h3>
              </Link>
              <p className="mb-4 text-gray-700 line-clamp-3">
                Explore the technological advancements in fingerprint biometrics, from traditional ink methods to today's sophisticated digital scanners and AI-enhanced recognition algorithms.
              </p>
              <Link 
                to="/landing" 
                className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                aria-label="Read more about Fingerprint Scanning"
                tabIndex={0}
              >
                Read more 
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </article>
        </div>

        {/* Newsletter Subscription */}
        <div className="mt-16 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 p-8 shadow-lg">
          <div className="mb-6 max-w-lg">
            <h3 className="mb-2 text-2xl font-bold text-white">Stay Updated on Biometric Security</h3>
            <p className="text-blue-100">
              Subscribe to our newsletter to receive the latest updates, insights, and research in biometric security technologies.
            </p>
          </div>
          
          <form className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <div className="flex-grow">
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                className="w-full rounded-lg border-0 px-4 py-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-400"
                aria-label="Email address for newsletter subscription"
                tabIndex={0}
              />
            </div>
            <button
              type="button"
              className="rounded-lg bg-white px-5 py-3 text-sm font-semibold text-blue-600 shadow-sm hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-colors"
              aria-label="Subscribe to newsletter"
              tabIndex={0}
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
