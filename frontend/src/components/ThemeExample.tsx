import React from 'react';

/**
 * ThemeExample component demonstrates how to use the Tailwind theme
 * instead of inline styles for consistent styling
 */
const ThemeExample: React.FC = () => {
  return (
    <div className="p-md">
      <h1 className="text-3xl font-sans font-bold text-primary mb-lg">
        Tailwind Theme Example
      </h1>
      
      <section className="mb-xl">
        <h2 className="text-xl font-sans text-neutral-800 mb-md">Color Palette</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-sm">
          <div className="bg-primary p-md text-secondary rounded shadow-md">Primary</div>
          <div className="bg-secondary p-md text-primary border border-neutral-300 rounded shadow-md">Secondary</div>
          <div className="bg-accent-blue p-md text-secondary rounded shadow-md">Accent Blue</div>
          <div className="bg-accent-green p-md text-secondary rounded shadow-md">Accent Green</div>
          <div className="bg-accent-purple p-md text-secondary rounded shadow-md">Accent Purple</div>
          <div className="bg-accent-red p-md text-secondary rounded shadow-md">Accent Red</div>
          <div className="bg-neutral-100 p-md text-neutral-900 rounded shadow-md">Neutral 100</div>
          <div className="bg-neutral-900 p-md text-neutral-100 rounded shadow-md">Neutral 900</div>
        </div>
      </section>
      
      <section className="mb-xl">
        <h2 className="text-xl font-sans text-neutral-800 mb-md">Typography</h2>
        <div className="space-y-sm">
          <p className="font-sans text-xs">Text Extra Small (xs)</p>
          <p className="font-sans text-sm">Text Small (sm)</p>
          <p className="font-sans text-base">Text Base</p>
          <p className="font-sans text-lg">Text Large (lg)</p>
          <p className="font-sans text-xl">Text Extra Large (xl)</p>
          <p className="font-sans text-2xl">Text 2XL</p>
          <p className="font-serif text-base">Serif Font</p>
          <p className="font-mono text-base">Monospace Font</p>
        </div>
      </section>
      
      <section className="mb-xl">
        <h2 className="text-xl font-sans text-neutral-800 mb-md">Spacing</h2>
        <div className="flex flex-wrap gap-sm">
          <div className="bg-neutral-200 p-xs">xs</div>
          <div className="bg-neutral-200 p-sm">sm</div>
          <div className="bg-neutral-200 p-md">md</div>
          <div className="bg-neutral-200 p-lg">lg</div>
          <div className="bg-neutral-200 p-xl">xl</div>
          <div className="bg-neutral-200 p-2xl">2xl</div>
        </div>
      </section>
      
      <section className="mb-xl">
        <h2 className="text-xl font-sans text-neutral-800 mb-md">Border Radius</h2>
        <div className="flex flex-wrap gap-sm">
          <div className="bg-neutral-200 p-md rounded-none">none</div>
          <div className="bg-neutral-200 p-md rounded-sm">sm</div>
          <div className="bg-neutral-200 p-md rounded">default</div>
          <div className="bg-neutral-200 p-md rounded-md">md</div>
          <div className="bg-neutral-200 p-md rounded-lg">lg</div>
          <div className="bg-neutral-200 p-md rounded-xl">xl</div>
          <div className="bg-neutral-200 p-md rounded-2xl">2xl</div>
          <div className="bg-neutral-200 p-md rounded-full">full</div>
        </div>
      </section>
      
      <section>
        <h2 className="text-xl font-sans text-neutral-800 mb-md">Shadows</h2>
        <div className="flex flex-wrap gap-md">
          <div className="bg-secondary p-md shadow-sm">sm</div>
          <div className="bg-secondary p-md shadow">default</div>
          <div className="bg-secondary p-md shadow-md">md</div>
          <div className="bg-secondary p-md shadow-lg">lg</div>
          <div className="bg-secondary p-md shadow-xl">xl</div>
        </div>
      </section>
    </div>
  );
};

export default ThemeExample; 