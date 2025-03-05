import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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
import PDFUpload from './pages/PDFUpload';
import PdfViewer from './pages/PdfViewer';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import SimpleFooter from './components/SimpleFooter';
import NormalFooter from './components/NormalFooter';

// Wrapper component to conditionally render different layouts
const AppContent = () => {
  const location = useLocation();
  const path = location.pathname;
  
  // Pages that should have normal scrolling and full footer
  const normalScrollPages = ['/', '/solutions', '/pricing'];
  const shouldUseNormalScroll = normalScrollPages.includes(path);
  
  return (
    <div className={shouldUseNormalScroll ? "" : "flex flex-col h-screen overflow-hidden"}>
      <Navbar />
      <main className={shouldUseNormalScroll ? "" : "flex-grow overflow-hidden"}>
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
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/notifications" 
            element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/pdf-upload" 
            element={
              <ProtectedRoute>
                <PDFUpload />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/pdf-viewer/:pdfId" 
            element={
              <ProtectedRoute>
                <PdfViewer />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {shouldUseNormalScroll ? <NormalFooter /> : <SimpleFooter />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
