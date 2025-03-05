import React from 'react';
import LayoutWithScroll from '../components/LayoutWithScroll';

/**
 * Example page that demonstrates how to use the LayoutWithScroll component
 * to prevent page scrolling but allow content scrolling
 */
const NoScrollExample = () => {
  return (
    <LayoutWithScroll>
      <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
        <h1 className="text-2xl font-bold text-primary mb-6">No Scroll Example</h1>
        
        <p className="text-neutral-600 mb-6">
          This example page demonstrates how to use the LayoutWithScroll component to prevent
          page scrolling but allow content scrolling. The page itself will not scroll, but
          the content within this container will scroll if it exceeds the available space.
        </p>
        
        <div className="bg-neutral-100 p-6 rounded-lg mb-6">
          <h3 className="text-lg font-medium text-primary mb-2">How It Works</h3>
          <p className="text-neutral-600">
            The LayoutWithScroll component sets a fixed height based on the viewport height,
            minus the space needed for the navbar and footer. It then sets overflow-hidden
            on the outer container and overflow-auto on the inner container, allowing the
            content to scroll within its container but preventing the page from scrolling.
          </p>
        </div>
        
        {/* Generate a lot of content to demonstrate scrolling */}
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className="bg-neutral-100 p-6 rounded-lg mb-6">
            <h3 className="text-lg font-medium text-primary mb-2">Section {index + 1}</h3>
            <p className="text-neutral-600">
              This is a section of content to demonstrate scrolling. The content will scroll
              within its container, but the page itself will not scroll. This creates a cleaner
              user experience, especially for dashboard-like interfaces.
            </p>
          </div>
        ))}
      </div>
    </LayoutWithScroll>
  );
};

export default NoScrollExample; 