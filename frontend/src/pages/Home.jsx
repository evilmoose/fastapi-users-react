import HeroSection from '../components/HeroSection';
import LeadForm from '../components/LeadForm';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import NormalScrollLayout from '../components/NormalScrollLayout';

const Home = () => {
  const { currentUser } = useAuth();
  
  return (
    <NormalScrollLayout>
      {/* Hero Section */}
      <HeroSection />

      {/* Features Section - Highlight Core Offerings */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary">Automation Services Tailored to Your Growth</h2>
            <p className="mt-4 text-lg text-neutral-600 max-w-2xl mx-auto">
              From quick-start automation packs to full RevOps optimization, we have solutions to streamline every step of your business processes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-neutral-100 p-6 rounded-lg">
              <div className="w-12 h-12 bg-accent-blue rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-primary mb-2">Pre-Built Automation Packs</h3>
              <p className="text-neutral-600">
                Quick-to-deploy workflows tailored for real estate, legal, agencies, and e-commerce businesses.
              </p>
            </div>

            <div className="bg-neutral-100 p-6 rounded-lg">
              <div className="w-12 h-12 bg-accent-green rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-primary mb-2">Full Automation Audits</h3>
              <p className="text-neutral-600">
                End-to-end process reviews and customized automation blueprints to unlock growth.
              </p>
            </div>

            <div className="bg-neutral-100 p-6 rounded-lg">
              <div className="w-12 h-12 bg-accent-purple rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-primary mb-2">AI-Powered Workflows</h3>
              <p className="text-neutral-600">
                Leverage Langchain AI to analyze data, predict outcomes, and generate smarter workflows.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PDF Processing Section */}
      <section className="py-16 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-primary mb-4">Intelligent PDF Processing</h2>
              <p className="text-lg text-neutral-600 mb-6">
                Transform your document workflows with our AI-powered PDF processing. Extract text, data, and insights automatically.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-accent-green mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-neutral-700">Advanced OCR with AWS Textract</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-accent-green mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-neutral-700">AI-powered data extraction with LangChain</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-accent-green mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-neutral-700">Interactive visualization with bounding boxes</span>
                </li>
              </ul>
              {currentUser ? (
                <Link 
                  to="/pdf-upload" 
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Try PDF Processing
                </Link>
              ) : (
                <Link 
                  to="/signup" 
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Sign Up to Try PDF Processing
                </Link>
              )}
            </div>
            <div className="relative">
              <div className="bg-white p-4 rounded-lg shadow-lg">
                <div className="aspect-w-16 aspect-h-9 bg-neutral-100 rounded overflow-hidden">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-24 w-24 text-neutral-400 m-auto" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={1.5} 
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                    />
                  </svg>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
                  <div className="h-4 bg-neutral-200 rounded w-1/2"></div>
                  <div className="h-4 bg-neutral-200 rounded w-5/6"></div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-accent-blue text-white p-3 rounded-lg shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section with Lead Form */}
      <section className="py-16 bg-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-primary mb-4">Ready to Automate Your Business?</h2>
              <p className="text-lg text-neutral-600 mb-6">
                Let us handle the automation so you can focus on what matters — growing your business.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-accent-green mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-neutral-700">Easy to set up and use</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-accent-green mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-neutral-700">Custom-built for your business</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-accent-green mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-neutral-700">Ongoing support and optimization</span>
                </li>
              </ul>
            </div>
            <div>
              <LeadForm />
            </div>
          </div>
        </div>
      </section>
    </NormalScrollLayout>
  );
};

export default Home;
