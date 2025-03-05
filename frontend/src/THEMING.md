# Theming Guide for ArtOfWorkflows

This guide explains how to maintain consistent styling across all pages in the ArtOfWorkflows application.

## Background Color Standardization

To ensure all pages have the same background color, we've implemented the following:

1. Added a standardized `page.background` color in the Tailwind theme
2. Created a reusable `Layout` component that applies this background color
3. Updated existing pages to use this Layout component

## How to Use the Layout Component

For any new page you create, simply import and use the Layout component:

```jsx
import Layout from '../components/Layout';

const YourNewPage = () => {
  return (
    <Layout>
      {/* Your page content here */}
    </Layout>
  );
};
```

## Theme Colors

Our application uses the following theme colors:

- **Primary**: Black (#000000)
- **Secondary**: White (#FFFFFF)
- **Page Background**: Light gray (#F9FAFB, same as gray-50)
- **Neutral**: A grayscale palette from light to dark
- **Accent Colors**: Blue, Green, Purple, Red

## Common UI Patterns

For consistent UI elements, follow these patterns:

### Page Container
```jsx
<Layout>
  <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
    {/* Page content */}
  </div>
</Layout>
```

### Section Headers
```jsx
<h1 className="text-2xl font-bold text-primary mb-6">Page Title</h1>
<h2 className="text-xl font-semibold text-neutral-800 mb-4">Section Title</h2>
<h3 className="text-lg font-medium text-primary mb-2">Subsection Title</h3>
```

### Cards
```jsx
<div className="bg-neutral-100 p-6 rounded-lg">
  <h3 className="text-lg font-medium text-primary mb-2">Card Title</h3>
  <p className="text-neutral-600 mb-4">Card content goes here.</p>
  <button className="text-accent-blue hover:underline font-medium">
    Action Button
  </button>
</div>
```

## Benefits of This Approach

1. **Consistency**: All pages have the same background color and spacing
2. **Maintainability**: Change the background color in one place (theme) to update it everywhere
3. **Scalability**: New developers can easily follow the pattern for new pages
4. **Flexibility**: The Layout component can be extended with additional common UI elements

## Example Page

See `src/pages/ExamplePage.jsx` for a complete example of how to use the Layout component and follow the theming guidelines. 