import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';

const ErrorPage = () => {
  const [searchParams] = useSearchParams();
  const errorMessage = searchParams.get('message') || 'An error occurred';
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary-50 to-white">
      <div className="w-full max-w-md p-8 bg-white/80 backdrop-blur-sm rounded-xl shadow-card border border-secondary-200 text-center">
        <h1 className="text-2xl font-bold text-error-600 mb-4">Authentication Error</h1>
        <p className="text-secondary-700 mb-6">{errorMessage}</p>
        <Link to="/login" className="inline-block px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all duration-200">
          Return to Login
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;