import React from 'react';
import { Package } from 'lucide-react';
import Navigation from '../../components/Navigation';
import ComingSoon from '../../components/ui/ComingSoon';

const InventoryManagementPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      
      <div className="container mx-auto px-4 py-4 md:py-6">
        <ComingSoon
          title="Inventory Management"
          description="Comprehensive inventory tracking system with real-time stock alerts, supplier management, and automated reordering."
          icon={<Package className="h-10 w-10" />}
          estimatedDate="Q1 2026"
          features={[
            'Real-time stock level monitoring with visual indicators',
            'Automatic low-stock alerts and critical inventory warnings',
            'Supplier management and contact information',
            'Cost tracking and total inventory valuation',
            'Reorder point automation with one-click ordering',
            'Category-based organization and filtering',
            'Inventory usage reports and analytics',
            'Integration with menu items and recipes',
          ]}
        />
      </div>
    </div>
  );
};

export default InventoryManagementPage;
