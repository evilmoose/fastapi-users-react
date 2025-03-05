import React from 'react';
import SimpleFooter from './SimpleFooter';

/**
 * Layout component that provides a consistent background color and structure for all pages
 * Wrap your page content with this component to ensure consistent styling
 * Updated to prevent overflow and scrolling, and includes the simplified footer
 */
const Layout = ({ children }) => {
  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      <div className="flex-grow bg-page-background overflow-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </div>
      </div>
      <SimpleFooter />
    </div>
  );
};

export default Layout; 