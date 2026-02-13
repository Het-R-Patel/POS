import React from "react";
import { Star } from "lucide-react";
import Navigation from "../../components/Navigation";
import ComingSoon from "../../components/ui/ComingSoon";

const CustomerLoyaltyPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      
      <div className="container mx-auto px-4 py-4 md:py-6">
        <ComingSoon
          title="Customer Loyalty Program"
          description="Build lasting relationships with your customers through our comprehensive loyalty and rewards system."
          icon={<Star className="h-10 w-10" />}
          estimatedDate="Q1 2026"
          features={[
            'Points-based rewards system with automatic accrual',
            'Multi-tier membership levels (Bronze, Silver, Gold, Platinum)',
            'Customizable rewards catalog and point redemption',
            'Customer profiles with spending history and visit tracking',
            'Birthday rewards and special occasion offers',
            'Email and SMS marketing integration',
            'Analytics dashboard for customer behavior insights',
            'Mobile app integration for easy point tracking',
          ]}
        />
      </div>
    </div>
  );
};

export default CustomerLoyaltyPage;
