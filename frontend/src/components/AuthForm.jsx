import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AuthForm = ({ type = 'login' }) => {
  const isLogin = type === 'login';
  const { login, signup, error: authError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the redirect path from location state or default to home
  const from = location.state?.from?.pathname || '/';
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const validateForm = () => {
    setError('');
    
    if (!isLogin && formData.name.trim() === '') {
      setError('Name is required');
      return false;
    }
    
    if (formData.email.trim() === '') {
      setError('Email is required');
      return false;
    }
    
    if (formData.password.trim() === '') {
      setError('Password is required');
      return false;
    }
    
    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await signup(formData.name, formData.email, formData.password);
      }
      
      // Redirect to the page they were trying to access or home
      navigate(from, { replace: true });
    } catch (err) {
      // Error is handled by the auth context
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 md:p-8 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-primary mb-6">
        {isLogin ? 'Log In to Your Account' : 'Create an Account'}
      </h2>
      
      {(error || authError) && (
        <div className="mb-6 p-4 rounded bg-red-100 text-red-800">
          {error || authError}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="John Doe"
            />
          </div>
        )}
        
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="john@example.com"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="••••••••"
          />
        </div>
        
        {!isLogin && (
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="••••••••"
            />
          </div>
        )}
        
        {isLogin && (
          <div className="mb-6 text-right">
            <Link to="/forgot-password" className="text-sm text-primary hover:underline">
              Forgot your password?
            </Link>
          </div>
        )}
        
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full bg-primary text-white py-2 px-4 rounded-md font-medium hover:bg-neutral-800 transition-colors ${
            isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting 
            ? (isLogin ? 'Logging in...' : 'Signing up...') 
            : (isLogin ? 'Log In' : 'Sign Up')}
        </button>
      </form>
      
      <div className="mt-6 text-center text-sm text-neutral-600">
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <Link 
          to={isLogin ? '/signup' : '/login'} 
          className="text-primary hover:underline font-medium"
        >
          {isLogin ? 'Sign up' : 'Log in'}
        </Link>
      </div>
    </div>
  );
};

export default AuthForm;
