# Layout Usage Guide

This guide explains how to use the updated Layout component to prevent overflow and scrolling in your pages, along with the simplified footer.

## App.jsx Changes

Update your App.jsx file to use the following structure:

```jsx
function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="flex flex-col h-screen overflow-hidden">
          <Navbar />
          <main className="flex-grow overflow-hidden">
            <Routes>
              {/* Your routes here */}
            </Routes>
          </main>
          <footer className="bg-neutral-800 text-white py-3 text-center">
            <p className="text-neutral-400">&copy; {new Date().getFullYear()} ArtOfWorkflows. All rights reserved.</p>
          </footer>
        </div>
      </AuthProvider>
    </Router>
  );
}
```

## Layout Component

The Layout component has been updated to prevent overflow and scrolling:

```jsx
const Layout = ({ children }) => {
  return (
    <div className="h-[calc(100vh-104px)] bg-page-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 h-full overflow-auto">
        {children}
      </div>
    </div>
  );
};
```

The `h-[calc(100vh-104px)]` calculation accounts for:
- Navbar height (approximately 64px)
- Footer height (approximately 40px)

This ensures that the content area takes up exactly the remaining viewport height.

## Using the Layout Component

When creating new pages, use the Layout component as follows:

```jsx
import Layout from '../components/Layout';

const YourPage = () => {
  return (
    <Layout>
      <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
        {/* Your page content */}
      </div>
    </Layout>
  );
};
```

## Benefits

1. **No Page Scrolling**: The page will not scroll as a whole
2. **Content Scrolling**: If your content is too long, it will scroll within its container
3. **Simplified Footer**: The footer is now a single line at the bottom of the page
4. **Consistent Layout**: All pages will have the same structure and behavior

## Important Notes

- The Layout component handles the scrolling of its content
- The footer is always visible at the bottom of the viewport
- The navbar is always visible at the top of the viewport
- Content that doesn't fit in the viewport will scroll within its container 