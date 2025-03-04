import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import Solutions from './pages/Solutions';
import Pricing from './pages/Pricing';
import BlogPost from './pages/BlogPost';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import BlogPostEditor from './pages/BlogPostEditor';
import BlogListing from './pages/BlogListing';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/solutions" element={<Solutions />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/blog" element={<BlogListing />} />
              <Route path="/blog/:id" element={<BlogPost />} />
              <Route 
                path="/blog/new" 
                element={
                  <AdminRoute>
                    <BlogPostEditor />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/blog/:id/edit" 
                element={
                  <AdminRoute>
                    <BlogPostEditor />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <footer className="bg-neutral-800 text-white py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">ArtOfWorkflows</h3>
                  <p className="text-neutral-400">
                    Streamline your business processes with our powerful workflow management solution.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                  <ul className="space-y-2">
                    <li><a href="/" className="text-neutral-400 hover:text-white">Home</a></li>
                    <li><a href="/login" className="text-neutral-400 hover:text-white">Login</a></li>
                    <li><a href="/signup" className="text-neutral-400 hover:text-white">Sign Up</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Contact</h3>
                  <p className="text-neutral-400">
                    Email: info@artofworkflows.com<br />
                    Phone: (123) 456-7890
                  </p>
                </div>
              </div>
              <div className="mt-8 pt-8 border-t border-neutral-700 text-center text-neutral-400">
                <p>&copy; {new Date().getFullYear()} ArtOfWorkflows. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
