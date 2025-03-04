import { Link } from 'react-router-dom';
import TrustedBy from './TrustedBy';

const HeroSection = () => {
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-primary tracking-tight">
              Streamline Your Workflow
            </h1>
            <p className="mt-4 text-xl text-neutral-600 max-w-2xl">
              Automate your business processes, reduce manual work, and increase productivity with our powerful workflow management solution.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-neutral-800 transition-colors"
              >
                Get Started
              </Link>
              <Link
                to="/solutions"
                className="inline-flex items-center justify-center px-6 py-3 border border-neutral-300 text-base font-medium rounded-md text-neutral-700 bg-white hover:bg-neutral-100 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
          <div className="hidden md:block">
            <img
              src="/hero-image.svg"
              alt="Workflow automation illustration"
              className="w-full h-auto object-cover rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* Industry-Leading Tools Section */}
      <TrustedBy />
    </div>
  );
};

export default HeroSection;
