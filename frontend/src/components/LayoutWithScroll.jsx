import React from 'react';

/**
 * LayoutWithScroll component that provides a consistent background color and structure for all pages
 * This version handles overflow correctly, preventing page scrolling but allowing content scrolling
 */
const LayoutWithScroll = ({ children }) => {
  return (
    <div className="h-[calc(100vh-104px)] bg-page-background overflow-hidden">
      <div className="h-full overflow-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default LayoutWithScroll; 