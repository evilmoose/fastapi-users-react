import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen bg-neutral-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          <h1 className="text-2xl font-bold text-primary mb-6">Dashboard</h1>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-neutral-800 mb-4">Welcome, {currentUser?.name || 'User'}!</h2>
            <p className="text-neutral-600">
              This is your personal dashboard where you can manage your workflows and settings.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-neutral-100 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-primary mb-2">My Workflows</h3>
              <p className="text-neutral-600 mb-4">
                Create and manage your custom workflows.
              </p>
              <button className="text-accent-blue hover:underline font-medium">
                View Workflows
              </button>
            </div>
            
            <div className="bg-neutral-100 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-primary mb-2">Analytics</h3>
              <p className="text-neutral-600 mb-4">
                View performance metrics and reports.
              </p>
              <button className="text-accent-blue hover:underline font-medium">
                View Analytics
              </button>
            </div>
            
            <div className="bg-neutral-100 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-primary mb-2">Settings</h3>
              <p className="text-neutral-600 mb-4">
                Manage your account and preferences.
              </p>
              <button className="text-accent-blue hover:underline font-medium">
                View Settings
              </button>
            </div>
          </div>
          
          <div className="mt-12 border-t border-neutral-200 pt-6">
            <h3 className="text-lg font-medium text-primary mb-4">Recent Activity</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-neutral-200 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-neutral-800">Account created</p>
                  <p className="text-sm text-neutral-500">Welcome to ArtOfWorkflows!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 