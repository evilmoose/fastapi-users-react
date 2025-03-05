import { Link } from 'react-router-dom';

/**
 * Unauthorized page displayed when a user tries to access a restricted page
 */
const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-4">
      <div className="text-red-500 text-6xl mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      
      <h1 className="text-4xl font-bold text-neutral-800 mb-2">Access Denied</h1>
      
      <p className="text-lg text-neutral-600 mb-8 text-center max-w-md">
        You don't have permission to access this page. Please contact an administrator if you believe this is an error.
      </p>
      
      <div className="flex gap-4">
        <Link 
          to="/" 
          className="px-6 py-2 bg-primary text-white rounded-md hover:bg-neutral-800 transition-colors"
        >
          Go Home
        </Link>
        
        <Link 
          to="/login" 
          className="px-6 py-2 border border-neutral-300 rounded-md hover:bg-neutral-100 transition-colors"
        >
          Log In
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized; 