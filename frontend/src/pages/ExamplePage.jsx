import React from 'react';
import Layout from '../components/Layout';

/**
 * Example page that demonstrates how to use the Layout component
 * for consistent styling across all pages
 */
const ExamplePage = () => {
  return (
    <Layout>
      <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
        <h1 className="text-2xl font-bold text-primary mb-6">Example Page</h1>
        
        <p className="text-neutral-600 mb-6">
          This is an example page that uses the Layout component to ensure consistent styling.
          All new pages should use this Layout component to maintain the same background color
          and spacing throughout the application.
        </p>
        
        <div className="bg-neutral-100 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-primary mb-2">Using the Layout Component</h3>
          <p className="text-neutral-600">
            To use the Layout component in a new page, simply import it and wrap your page content:
          </p>
          <pre className="bg-neutral-800 text-white p-4 rounded-md mt-4 overflow-x-auto">
            {`import Layout from '../components/Layout';

const YourNewPage = () => {
  return (
    <Layout>
      {/* Your page content here */}
    </Layout>
  );
};`}
          </pre>
        </div>
      </div>
    </Layout>
  );
};

export default ExamplePage; 