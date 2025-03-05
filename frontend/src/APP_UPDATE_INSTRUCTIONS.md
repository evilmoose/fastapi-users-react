# App.jsx Update Instructions

To remove overflow and prevent scrolling in pages, and to simplify the footer to a single line, follow these instructions to update your `App.jsx` file:

## 1. Update the Main Container

Change the main container div from:

```jsx
<div className="flex flex-col min-h-screen">
```

To:

```jsx
<div className="flex flex-col h-screen overflow-hidden">
```

This ensures the app takes exactly the viewport height and prevents overflow.

## 2. Update the Main Content Area

Change the main content area from:

```jsx
<main className="flex-grow">
```

To:

```jsx
<main className="flex-grow overflow-hidden">
```

This prevents the main content from causing overflow.

## 3. Replace the Footer

Replace the entire footer section with this simplified version:

```jsx
<footer className="bg-neutral-800 text-white py-3 text-center">
  <p className="text-neutral-400">&copy; {new Date().getFullYear()} ArtOfWorkflows. All rights reserved.</p>
</footer>
```

## Complete Example

Here's how your updated App.jsx should look:

```jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
// ... other imports

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="flex flex-col h-screen overflow-hidden">
          <Navbar />
          <main className="flex-grow overflow-hidden">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              {/* ... other routes */}
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

export default App;
```

## Page Component Updates

For each page component that uses the Layout component, update the Layout component as follows:

```jsx
// frontend/src/components/Layout.jsx
import React from 'react';

const Layout = ({ children }) => {
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

export default Layout;
```

This ensures that:
1. The layout takes up exactly the available space (viewport height minus navbar and footer)
2. The background color is consistent
3. Content that doesn't fit will scroll within its container, not the entire page 