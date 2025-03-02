import HeroSection from '../components/HeroSection';
import LeadForm from '../components/LeadForm';

const Home = () => {
  return (
    <div className="min-h-screen bg-neutral-100">
      <HeroSection />
      
      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary">Powerful Workflow Features</h2>
            <p className="mt-4 text-lg text-neutral-600 max-w-2xl mx-auto">
              Our platform provides everything you need to streamline your business processes.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-neutral-100 p-6 rounded-lg">
              <div className="w-12 h-12 bg-accent-blue rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-primary mb-2">Automated Workflows</h3>
              <p className="text-neutral-600">
                Create custom workflows that automate repetitive tasks and save your team valuable time.
              </p>
            </div>
            
            <div className="bg-neutral-100 p-6 rounded-lg">
              <div className="w-12 h-12 bg-accent-green rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-primary mb-2">Real-time Analytics</h3>
              <p className="text-neutral-600">
                Get insights into your workflow performance with detailed analytics and reporting.
              </p>
            </div>
            
            <div className="bg-neutral-100 p-6 rounded-lg">
              <div className="w-12 h-12 bg-accent-purple rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-primary mb-2">Team Collaboration</h3>
              <p className="text-neutral-600">
                Collaborate seamlessly with your team members on workflows and projects.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section with Lead Form */}
      <section className="py-16 bg-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-primary mb-4">Ready to Transform Your Workflow?</h2>
              <p className="text-lg text-neutral-600 mb-6">
                Join thousands of businesses that have improved their productivity with our workflow management solution.
              </p>
              <ul className="space-y-3">
                {['Easy to set up and use', 'Integrates with your existing tools', 'Dedicated support team'].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="h-6 w-6 text-accent-green mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-neutral-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <LeadForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
