import NormalScrollLayout from '../components/NormalScrollLayout';

const Pricing = () => {
  return (
    <NormalScrollLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-primary mb-6 text-center">Pricing Plans</h1>
        <p className="text-lg text-neutral-600 text-center mb-12">
          Transparent pricing that grows with your business — from quick wins to fully-managed automation.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Starter Pack */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-primary mb-4">Starter Automation Pack</h2>
            <p className="text-neutral-600 mb-6">For SMBs wanting quick wins with essential automations.</p>
            <p className="text-2xl font-bold text-primary">$999 <span className="text-sm text-neutral-500">one-time</span></p>
            <ul className="mt-6 space-y-3">
              <li className="flex items-start">
                <svg className="h-6 w-6 text-accent-green flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="ml-3">1 pre-built workflow</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-accent-green flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="ml-3">Basic customization</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-accent-green flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="ml-3">30 days of support</span>
              </li>
            </ul>
            <button className="mt-8 w-full bg-accent-blue text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors">
              Get Started
            </button>
          </div>

          {/* Advanced Pack */}
          <div className="bg-white rounded-lg shadow-md p-6 border-2 border-accent-blue relative">
            <div className="absolute top-0 right-0 bg-accent-blue text-white px-3 py-1 text-sm font-medium rounded-bl-lg">
              Popular
            </div>
            <h2 className="text-xl font-semibold text-primary mb-4">Advanced Automation Pack</h2>
            <p className="text-neutral-600 mb-6">For growing businesses needing comprehensive automation.</p>
            <p className="text-2xl font-bold text-primary">$2,499 <span className="text-sm text-neutral-500">one-time</span></p>
            <ul className="mt-6 space-y-3">
              <li className="flex items-start">
                <svg className="h-6 w-6 text-accent-green flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="ml-3">3 pre-built workflows</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-accent-green flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="ml-3">Full customization</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-accent-green flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="ml-3">90 days of support</span>
              </li>
            </ul>
            <button className="mt-8 w-full bg-accent-blue text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors">
              Get Started
            </button>
          </div>

          {/* Enterprise */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-primary mb-4">Enterprise Automation</h2>
            <p className="text-neutral-600 mb-6">For organizations needing custom, end-to-end solutions.</p>
            <p className="text-2xl font-bold text-primary">Custom <span className="text-sm text-neutral-500">pricing</span></p>
            <ul className="mt-6 space-y-3">
              <li className="flex items-start">
                <svg className="h-6 w-6 text-accent-green flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="ml-3">Unlimited workflows</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-accent-green flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="ml-3">Custom development</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-accent-green flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="ml-3">Dedicated support</span>
              </li>
            </ul>
            <button className="mt-8 w-full bg-neutral-800 text-white py-2 px-4 rounded-md hover:bg-neutral-700 transition-colors">
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </NormalScrollLayout>
  );
};

export default Pricing; 