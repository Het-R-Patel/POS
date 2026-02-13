import React from 'react';
import { Construction, Sparkles, ArrowRight } from 'lucide-react';
import Card from './Card';
import Button from './Button';

const ComingSoon = ({
  title,
  description,
  features = [],
  estimatedDate,
  icon,
}) => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-8">
      <Card className="max-w-3xl w-full" padding="none">
        {/* Header Section */}
        <div className="bg-gradient-to-br from-primary-500 to-orange-600 p-12 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl" />
          </div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white bg-opacity-20 rounded-full mb-6 backdrop-blur-sm">
              {icon || <Construction className="h-10 w-10" />}
            </div>
            
            <h1 className="text-4xl font-bold mb-4 flex items-center justify-center space-x-3">
              <span>{title}</span>
              <Sparkles className="h-8 w-8 text-yellow-300" />
            </h1>
            
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              {description}
            </p>
            
            {estimatedDate && (
              <div className="mt-6 inline-block">
                <div className="bg-white bg-opacity-20 backdrop-blur-sm px-6 py-3 rounded-full">
                  <p className="text-sm font-semibold">
                    Expected Launch: {estimatedDate}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Features Section */}
        {features.length > 0 && (
          <div className="p-12 bg-white">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              What's Coming
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-primary-50 transition-colors"
                >
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">✓</span>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{feature}</p>
                </div>
              ))}
            </div>

            {/* CTA Section */}
            <div className="text-center pt-6 border-t border-gray-200">
              <p className="text-gray-600 mb-4">
                We're working hard to bring you this feature!
              </p>
              <Button variant="primary" size="lg">
                <span>Notify Me When Ready</span>
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Simple Footer if no features */}
        {features.length === 0 && (
          <div className="p-8 bg-gray-50 text-center">
            <p className="text-gray-600 mb-4">
              This feature is currently under development.
            </p>
            <p className="text-sm text-gray-500">
              Check back soon for updates!
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ComingSoon;
