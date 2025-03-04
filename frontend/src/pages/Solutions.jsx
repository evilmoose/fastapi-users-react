const Solutions = () => {
  return (
    <div className="min-h-screen bg-neutral-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-primary mb-6 text-center">Our Automation Solutions</h1>
        <p className="text-lg text-neutral-600 text-center mb-12">
          Whether you're just starting or scaling fast, our flexible solutions help you streamline processes and unlock growth.
        </p>

        {/* Pre-Built Packs */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-primary mb-4">Pre-Built Automation Packs</h2>
          <p className="text-neutral-600 mb-6">
            Ready-to-go workflows tailored for your industry — installed and customized in days.
          </p>
          <ul className="space-y-4">
            <li><strong>Real Estate:</strong> Lead Intake → Agent Assignment → Follow-Up Sequence</li>
            <li><strong>Legal:</strong> Client Intake → Document Collection → Case Milestone Alerts</li>
            <li><strong>Marketing Agencies:</strong> New Client Kickoff → Asset Request → Weekly Progress Reports</li>
            <li><strong>E-commerce:</strong> Abandoned Cart Recovery → Post-Purchase Nurture → VIP Loyalty Flows</li>
          </ul>
        </div>

        {/* Full Automation Audit */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-primary mb-4">Full Automation Audit & Fractional RevOps</h2>
          <p className="text-neutral-600 mb-6">
            Deep-dive into your processes to uncover bottlenecks, design better workflows, and ensure your revenue operations flow smoothly.
          </p>
          <p>✔️ Full Process Mapping<br/>
             ✔️ Automation Recommendations<br/>
             ✔️ Quarterly Reviews & Optimization
          </p>
        </div>

        {/* AI-Powered Process Optimization */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-primary mb-4">AI-Powered Process Optimization</h2>
          <p className="text-neutral-600 mb-6">
            Add intelligence to your workflows — predict lead quality, detect bottlenecks, and generate insights using AI.
          </p>
          <p>✔️ Lead Scoring with Langchain<br/>
             ✔️ Sentiment Analysis from Calls & Emails<br/>
             ✔️ Process Health Alerts & Recommendations
          </p>
        </div>
      </div>
    </div>
  );
};

export default Solutions; 