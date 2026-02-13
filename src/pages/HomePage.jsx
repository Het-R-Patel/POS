import React from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, Users, CreditCard, ArrowRight } from 'lucide-react';
import Card from '../components/ui/Card';

const HomePage = () => {
  const roles = [
    {
      title: 'Waiter',
      description: 'Create and submit orders for your tables',
      icon: Users,
      path: '/waiter',
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
    },
    {
      title: 'Kitchen',
      description: 'View and manage incoming orders',
      icon: ChefHat,
      path: '/kitchen',
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600',
    },
    {
      title: 'Cashier',
      description: 'Process payments and manage billing',
      icon: CreditCard,
      path: '/cashier',
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600',
    },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <ChefHat className="h-20 w-20 text-primary-500" />
          </div>
          <h1 className="text-5xl md:text-6xl font-display font-bold text-gray-900 mb-4">
            Restaurant POS System
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Streamline your restaurant operations with our modern point-of-sale system.
            Efficient order management from table to kitchen to payment.
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <Link key={role.path} to={role.path}>
                <Card hoverable className="h-full group">
                  <div className="text-center">
                    <div
                      className={`${role.color} ${role.hoverColor} w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 transition-all group-hover:scale-110`}
                    >
                      <Icon className="h-10 w-10 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">
                      {role.title}
                    </h2>
                    <p className="text-gray-600 mb-6">{role.description}</p>
                    <div className="flex items-center justify-center text-primary-500 font-semibold group-hover:gap-3 gap-2 transition-all">
                      <span>Get Started</span>
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Features Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-card">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                📱 Responsive Design
              </h3>
              <p className="text-gray-600">
                Works seamlessly on all devices - tablets, phones, and desktops
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-card">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                ⚡ Real-time Updates
              </h3>
              <p className="text-gray-600">
                Instant order synchronization across all stations
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-card">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                🎨 Modern Interface
              </h3>
              <p className="text-gray-600">
                Clean, intuitive design that's easy to learn and use
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-card">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                💳 Multiple Payment Options
              </h3>
              <p className="text-gray-600">
                Support for cash, card, and mobile payments
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
