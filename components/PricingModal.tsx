'use client';

import { useState } from 'react';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PricingModal({ isOpen, onClose }: PricingModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');

  if (!isOpen) return null;

  const handleCheckout = async (plan: 'monthly' | 'yearly') => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Upgrade to Pro</h2>
          <p className="text-gray-600 mt-2">Unlock unlimited orders, CSV export, and tax-ready reports</p>
        </div>

        {/* Plan Toggle */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <button
            onClick={() => setSelectedPlan('monthly')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedPlan === 'monthly'
                ? 'bg-orange-100 text-orange-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setSelectedPlan('yearly')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedPlan === 'yearly'
                ? 'bg-orange-100 text-orange-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Yearly
            <span className="ml-1 text-xs text-green-600 font-bold">Save 27%</span>
          </button>
        </div>

        {/* Pricing Card */}
        <div className="border-2 border-orange-500 rounded-xl p-6 bg-orange-50">
          <div className="text-center">
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-4xl font-bold text-gray-900">
                ${selectedPlan === 'monthly' ? '9' : '79'}
              </span>
              <span className="text-gray-600">
                /{selectedPlan === 'monthly' ? 'month' : 'year'}
              </span>
            </div>
            {selectedPlan === 'yearly' && (
              <p className="text-sm text-green-600 font-medium mt-1">
                Just $6.58/month - save $29/year
              </p>
            )}
          </div>

          <ul className="mt-6 space-y-3">
            {[
              'Unlimited order analysis',
              'Full fee breakdown per order',
              'Export to CSV for taxes',
              'Tax-ready profit reports',
              'Multi-shop support',
              'Email support',
            ].map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-sm text-gray-700">
                <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>

          <button
            onClick={() => handleCheckout(selectedPlan)}
            disabled={isLoading}
            className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Loading...' : `Get Pro - $${selectedPlan === 'monthly' ? '9/mo' : '79/yr'}`}
          </button>
        </div>

        <p className="text-center text-xs text-gray-500 mt-4">
          30-day money-back guarantee. Cancel anytime.
        </p>
      </div>
    </div>
  );
}
