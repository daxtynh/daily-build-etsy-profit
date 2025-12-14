'use client';

import { useState } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { ProfitDashboard } from '@/components/ProfitDashboard';
import { PricingModal } from '@/components/PricingModal';
import { parseEtsyCSV, generateDemoData } from '@/lib/etsy-parser';
import { ParsedData } from '@/lib/types';

export default function Home() {
  const [data, setData] = useState<ParsedData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (content: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const parsed = parseEtsyCSV(content);
      if (parsed.orders.length === 0 && parsed.rawTransactions.length === 0) {
        setError('No valid transactions found in the CSV. Make sure you\'re uploading an Etsy export file.');
        setIsLoading(false);
        return;
      }
      setData(parsed);
    } catch (e) {
      console.error('Parse error:', e);
      setError('Failed to parse the CSV file. Please make sure it\'s a valid Etsy export.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemo = () => {
    setData(generateDemoData());
  };

  const handleReset = () => {
    setData(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Navigation */}
      <nav className="border-b border-orange-100 bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">EP</span>
            </div>
            <span className="font-bold text-gray-900">EtsyProfit</span>
          </div>
          <button
            onClick={() => setShowPricing(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Upgrade to Pro
          </button>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {!data ? (
          <>
            {/* Hero Section */}
            <div className="text-center mb-12 pt-8">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                See Your <span className="text-orange-500">Real</span> Etsy Profit
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-2">
                Stop guessing. Know exactly what you keep after Etsy takes their cut.
              </p>
              <p className="text-sm text-gray-500">
                Transaction fees, payment processing, offsite ads, shipping labels - we track it all.
              </p>
            </div>

            {/* Upload Section */}
            <div className="max-w-xl mx-auto mb-8">
              <FileUpload onFileSelect={handleFileSelect} isLoading={isLoading} />
              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}
              <div className="mt-4 text-center">
                <span className="text-gray-500 text-sm">or </span>
                <button
                  onClick={handleDemo}
                  className="text-orange-500 hover:text-orange-600 text-sm font-medium underline"
                >
                  try with demo data
                </button>
              </div>
            </div>

            {/* How It Works */}
            <div className="max-w-3xl mx-auto mt-16">
              <h2 className="text-center text-2xl font-bold text-gray-900 mb-8">How It Works</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-orange-600 font-bold">1</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Export from Etsy</h3>
                  <p className="text-sm text-gray-600">
                    Go to Shop Manager → Settings → Options → Download Data → Select &quot;Orders&quot;
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-orange-600 font-bold">2</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Upload Your CSV</h3>
                  <p className="text-sm text-gray-600">
                    Drag and drop or click to upload. Your data never leaves your browser.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-orange-600 font-bold">3</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">See Your Real Profit</h3>
                  <p className="text-sm text-gray-600">
                    Get a complete breakdown of every fee and your actual take-home profit.
                  </p>
                </div>
              </div>
            </div>

            {/* The Problem */}
            <div className="max-w-3xl mx-auto mt-16 bg-white border border-gray-200 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">The Problem with Etsy&apos;s Numbers</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  <strong className="text-gray-900">Etsy shows you gross sales.</strong> But between listing fees, transaction fees, payment processing, offsite ads, and shipping labels - the number you see is NOT what you keep.
                </p>
                <p>
                  <strong className="text-gray-900">Even worse:</strong> Etsy reports your gross sales (including sales tax they collect) to the IRS on your 1099-K. Many sellers end up paying taxes on money they never received.
                </p>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mt-4">
                  <p className="text-orange-800 text-sm">
                    <strong>Real example:</strong> A seller with $10,000 in gross sales actually kept only $7,200 after Etsy&apos;s fees. That&apos;s $2,800 in fees - but Etsy still reported $10,000 to the IRS.
                  </p>
                </div>
              </div>
            </div>

            {/* Fee Breakdown */}
            <div className="max-w-3xl mx-auto mt-16">
              <h2 className="text-center text-2xl font-bold text-gray-900 mb-8">Etsy&apos;s Hidden Fees</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { name: 'Listing Fee', rate: '$0.20', desc: 'Per item listed (renews every 4 months)' },
                  { name: 'Transaction Fee', rate: '6.5%', desc: 'On item price + shipping charged' },
                  { name: 'Payment Processing', rate: '3% + $0.25', desc: 'Per transaction through Etsy Payments' },
                  { name: 'Offsite Ads', rate: '12-15%', desc: 'If sale came from Etsy\'s ads (mandatory for some)' },
                  { name: 'Shipping Labels', rate: 'Varies', desc: 'If you buy labels through Etsy' },
                  { name: 'Regulatory Fee', rate: '0.3-0.5%', desc: 'State/country specific operating fee' },
                ].map((fee) => (
                  <div key={fee.name} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{fee.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">{fee.desc}</p>
                      </div>
                      <span className="text-red-600 font-mono font-medium">{fee.rate}</span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-center text-sm text-gray-500 mt-4">
                Combined, these fees typically eat 20-30% of your revenue
              </p>
            </div>

            {/* CTA */}
            <div className="max-w-xl mx-auto mt-16 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to See Your Real Numbers?</h2>
              <p className="text-gray-600 mb-6">
                Upload your Etsy export and get instant clarity on your actual profit.
              </p>
              <button
                onClick={handleDemo}
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
              >
                Try Demo Data
              </button>
            </div>
          </>
        ) : (
          <ProfitDashboard data={data} onReset={handleReset} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-16 py-8">
        <div className="max-w-5xl mx-auto px-4 text-center text-sm text-gray-500">
          <p>EtsyProfit helps Etsy sellers understand their real profit after fees.</p>
          <p className="mt-2">
            Your data is processed entirely in your browser - we never see or store your sales data.
          </p>
        </div>
      </footer>

      <PricingModal isOpen={showPricing} onClose={() => setShowPricing(false)} />
    </div>
  );
}
