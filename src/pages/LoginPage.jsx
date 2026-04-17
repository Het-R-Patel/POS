import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ChefHat, UtensilsCrossed, ShoppingBag } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import {
  clearAuthError,
  getRoleHomePath,
  loginUser,
} from '../store/features/auth/authSlice';

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, error: authError } = useSelector((state) => state.auth);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!identifier || !password) {
      setValidationError('Please fill in all fields');
      return;
    }

    setValidationError('');

    try {
      const result = await dispatch(loginUser({ identifier, password })).unwrap();
      navigate(getRoleHomePath(result?.user?.role), { replace: true });
    } catch {
      return;
    }
  };

  const errorMessage = validationError || authError;

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 sm:px-6 md:px-8 lg:px-12 xl:px-24">
        <div className="w-full max-w-md">
          {/* Logo and Title */}
          <div className="mb-6 md:mb-8">
            <div className="flex items-center mb-6">
              <div className="h-12 w-12 bg-primary-500 rounded-xl flex items-center justify-center">
                <ChefHat className="h-7 w-7 text-white" />
              </div>
              <div className="ml-3">
                <h1 className="text-2xl font-display font-bold text-gray-900">
                  Restro POS
                </h1>
                <p className="text-sm text-gray-600">Point of Sale System</p>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back!
            </h2>
            <p className="text-gray-600">
              Sign in to access your dashboard
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <Input
              label="Username or Email"
              type="text"
              value={identifier}
              onChange={(e) => {
                if (authError) {
                  dispatch(clearAuthError());
                }
                setIdentifier(e.target.value);
              }}
              placeholder="Enter your username or email"
              error={validationError && !identifier ? 'Username or email is required' : ''}
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => {
                if (authError) {
                  dispatch(clearAuthError());
                }
                setPassword(e.target.value);
              }}
              placeholder="Enter your password"
              error={validationError && !password ? 'Password is required' : ''}
            />

            {errorMessage && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-800">{errorMessage}</p>
              </div>
            )}

            <Button type="submit" variant="primary" size="lg" fullWidth disabled={isLoading}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>

            {/* Additional Links */}
            <div className="text-center text-sm text-gray-600">
              <a href="#" className="hover:text-primary-600 transition-colors">
                Forgot password?
              </a>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-8 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-500">
              © 2026 Orderly System. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Illustration/Image */}
      <div className="hidden xl:flex xl:flex-1 bg-gradient-to-br from-primary-500 via-primary-600 to-orange-600 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white opacity-10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white opacity-5 rounded-full blur-3xl"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full text-white px-12">
          {/* Main Illustration */}
          <div className="mb-12">
            <div className="relative">
              {/* Central Circle */}
              <div className="w-64 h-64 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center mb-8 shadow-2xl">
                <ChefHat className="h-32 w-32 text-white" />
              </div>
              
              {/* Floating Icons */}
              <div className="absolute -top-8 -right-8 w-20 h-20 bg-white bg-opacity-30 backdrop-blur-sm rounded-2xl flex items-center justify-center rotate-12 shadow-xl">
                <UtensilsCrossed className="h-10 w-10 text-white" />
              </div>
              <div className="absolute -bottom-8 -left-8 w-20 h-20 bg-white bg-opacity-30 backdrop-blur-sm rounded-2xl flex items-center justify-center -rotate-12 shadow-xl">
                <ShoppingBag className="h-10 w-10 text-white" />
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="text-center max-w-md">
            <h2 className="text-4xl font-bold mb-6">
              Streamline Your Restaurant Operations
            </h2>
            <p className="text-xl text-white text-opacity-90 mb-8 leading-relaxed">
              Manage orders, kitchen operations, and payments all in one powerful platform.
            </p>
            
            {/* Feature List */}
            <div className="space-y-4 text-left">
              {[
                'Real-time order tracking and management',
                'Seamless kitchen-to-table communication',
                'Quick and secure payment processing',
                'Comprehensive analytics and reporting',
              ].map((feature, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-white bg-opacity-30 rounded-full flex items-center justify-center mt-0.5">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-white text-opacity-90 leading-relaxed">
                    {feature}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 w-full max-w-lg">
            {[
              { value: '500+', label: 'Restaurants' },
              { value: '50K+', label: 'Daily Orders' },
              { value: '99.9%', label: 'Uptime' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-white text-opacity-80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
