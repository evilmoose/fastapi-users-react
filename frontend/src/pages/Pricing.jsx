const Pricing = () => {
  return (
    <div className="min-h-screen bg-neutral-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
          </div>

          {/* Advanced Pack */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-primary mb-4">Advanced Automation Pack</h2>
            <p className="text-neutral-600 mb-6">For agencies needing advanced workflows & reporting dashboards.</p>
            <p className="text-2xl font-bold text-primary">$2,499 <span className="text-sm text-neutral-500">one-time</span></p>
          </div>

          {/* Full Audit */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-primary mb-4">Full Automation Audit</h2>
            <p className="text-neutral-600 mb-6">For businesses ready for end-to-end process optimization.</p>
            <p className="text-2xl font-bold text-primary">$5,000 <span className="text-sm text-neutral-500">one-time</span></p>
          </div>

          {/* Fractional RevOps */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-primary mb-4">Fractional RevOps Retainer</h2>
            <p className="text-neutral-600 mb-6">Ongoing optimization, reporting, and process improvements.</p>
            <p className="text-2xl font-bold text-primary">$2,000 <span className="text-sm text-neutral-500">per month</span></p>
          </div>

          {/* AI Add-On */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-primary mb-4">AI-Powered Insights Add-On</h2>
            <p className="text-neutral-600 mb-6">AI scoring, analysis, and intelligent process monitoring.</p>
            <p className="text-2xl font-bold text-primary">$500 <span className="text-sm text-neutral-500">per month</span></p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-neutral-700">
            Not sure which plan fits you best? <a href="/contact" className="text-primary font-medium hover:underline">Contact us</a> for a free consultation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Pricing; 