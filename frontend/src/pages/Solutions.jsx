import NormalScrollLayout from '../components/NormalScrollLayout';

const Solutions = () => {
  return (
    <NormalScrollLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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

        {/* Custom Automation */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-primary mb-4">Custom Automation Development</h2>
          <p className="text-neutral-600 mb-6">
            Bespoke workflows designed for your unique business processes and integrated with your tech stack.
          </p>
          <ul className="space-y-4">
            <li><strong>Process Analysis:</strong> We map your current workflows and identify automation opportunities</li>
            <li><strong>Custom Development:</strong> Our experts build tailored solutions that integrate with your existing tools</li>
            <li><strong>Testing & Deployment:</strong> Rigorous testing ensures smooth implementation with minimal disruption</li>
            <li><strong>Training & Support:</strong> Comprehensive training and ongoing support for your team</li>
          </ul>
        </div>

        {/* Managed Services */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-primary mb-4">Managed Automation Services</h2>
          <p className="text-neutral-600 mb-6">
            Let our experts handle everything — from strategy to implementation and ongoing optimization.
          </p>
          <ul className="space-y-4">
            <li><strong>Strategy Development:</strong> Comprehensive automation roadmap aligned with your business goals</li>
            <li><strong>Full Implementation:</strong> End-to-end deployment of your automation ecosystem</li>
            <li><strong>Continuous Optimization:</strong> Regular reviews and improvements to maximize ROI</li>
            <li><strong>Dedicated Support:</strong> Your personal automation team, available when you need them</li>
          </ul>
        </div>
      </div>
    </NormalScrollLayout>
  );
};

export default Solutions; 