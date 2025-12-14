'use client';

import { ParsedData } from '@/lib/types';

interface ProfitDashboardProps {
  data: ParsedData;
  onReset: () => void;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

function StatCard({ label, value, subtext, color = 'gray' }: {
  label: string;
  value: string;
  subtext?: string;
  color?: 'green' | 'red' | 'orange' | 'gray' | 'blue';
}) {
  const colorClasses = {
    green: 'bg-green-50 border-green-200',
    red: 'bg-red-50 border-red-200',
    orange: 'bg-orange-50 border-orange-200',
    gray: 'bg-gray-50 border-gray-200',
    blue: 'bg-blue-50 border-blue-200',
  };

  const textClasses = {
    green: 'text-green-700',
    red: 'text-red-700',
    orange: 'text-orange-700',
    gray: 'text-gray-700',
    blue: 'text-blue-700',
  };

  return (
    <div className={`rounded-xl p-4 border ${colorClasses[color]}`}>
      <p className="text-sm text-gray-600 font-medium">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${textClasses[color]}`}>{value}</p>
      {subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
    </div>
  );
}

function FeeRow({ label, amount, percent }: { label: string; amount: number; percent: number }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-600">{label}</span>
      <div className="text-right">
        <span className="text-sm font-medium text-gray-900">{formatCurrency(amount)}</span>
        <span className="text-xs text-gray-500 ml-2">({formatPercent(percent)})</span>
      </div>
    </div>
  );
}

export function ProfitDashboard({ data, onReset }: ProfitDashboardProps) {
  const { summary, orders } = data;

  const feeBreakdown = [
    { label: 'Transaction Fees (6.5%)', amount: summary.totalTransactionFees, percent: summary.totalRevenue > 0 ? (summary.totalTransactionFees / summary.totalRevenue) * 100 : 0 },
    { label: 'Payment Processing (3% + $0.25)', amount: summary.totalPaymentProcessingFees, percent: summary.totalRevenue > 0 ? (summary.totalPaymentProcessingFees / summary.totalRevenue) * 100 : 0 },
    { label: 'Offsite Ads (12-15%)', amount: summary.totalOffsiteAdsFees, percent: summary.totalRevenue > 0 ? (summary.totalOffsiteAdsFees / summary.totalRevenue) * 100 : 0 },
    { label: 'Shipping Labels', amount: summary.totalShippingLabelCosts, percent: summary.totalRevenue > 0 ? (summary.totalShippingLabelCosts / summary.totalRevenue) * 100 : 0 },
    { label: 'Listing Fees ($0.20 each)', amount: summary.totalListingFees, percent: summary.totalRevenue > 0 ? (summary.totalListingFees / summary.totalRevenue) * 100 : 0 },
    { label: 'Regulatory Operating Fees', amount: summary.totalRegulatoryFees, percent: summary.totalRevenue > 0 ? (summary.totalRegulatoryFees / summary.totalRevenue) * 100 : 0 },
    { label: 'Other Fees', amount: summary.totalOtherFees, percent: summary.totalRevenue > 0 ? (summary.totalOtherFees / summary.totalRevenue) * 100 : 0 },
  ].filter(f => f.amount > 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Your Profit Report</h2>
          <p className="text-sm text-gray-500">
            {summary.dateRange.start && summary.dateRange.end
              ? `${summary.dateRange.start} - ${summary.dateRange.end}`
              : 'Date range not available'}
            {' · '}{summary.orderCount} orders
          </p>
        </div>
        <button
          onClick={onReset}
          className="text-sm text-gray-500 hover:text-gray-700 underline"
        >
          Upload new file
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Gross Revenue"
          value={formatCurrency(summary.totalRevenue)}
          subtext={`${formatCurrency(summary.totalSales)} sales + ${formatCurrency(summary.totalShippingCharged)} shipping`}
          color="blue"
        />
        <StatCard
          label="Total Fees"
          value={formatCurrency(summary.totalFees)}
          subtext={`${formatPercent(summary.effectiveFeeRate)} of revenue`}
          color="red"
        />
        <StatCard
          label="Net Profit"
          value={formatCurrency(summary.netProfit)}
          subtext="What you actually keep"
          color="green"
        />
        <StatCard
          label="Profit Margin"
          value={formatPercent(summary.profitMargin)}
          subtext={summary.profitMargin >= 70 ? 'Healthy margin!' : summary.profitMargin >= 50 ? 'Room to improve' : 'Review your fees'}
          color={summary.profitMargin >= 70 ? 'green' : summary.profitMargin >= 50 ? 'orange' : 'red'}
        />
      </div>

      {/* The Brutal Truth Box */}
      <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
        <h3 className="font-semibold text-orange-800 mb-2">The Brutal Truth</h3>
        <p className="text-sm text-orange-700">
          Etsy reports <strong>{formatCurrency(summary.totalRevenue + summary.totalSalesTax)}</strong> as your gross sales to the IRS (1099-K).
          {' '}But after all fees, you actually keep <strong>{formatCurrency(summary.netProfit)}</strong>.
          {' '}That&apos;s a <strong>{formatCurrency(summary.totalFees)}</strong> difference the IRS thinks you received!
        </p>
        <p className="text-xs text-orange-600 mt-2">
          Make sure your accountant deducts these fees to avoid overpaying taxes.
        </p>
      </div>

      {/* Fee Breakdown */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Fee Breakdown</h3>
        <div className="space-y-1">
          {feeBreakdown.map((fee) => (
            <FeeRow key={fee.label} {...fee} />
          ))}
        </div>
        <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-200">
          <span className="font-semibold text-gray-900">Total Fees</span>
          <span className="font-bold text-red-600">{formatCurrency(summary.totalFees)}</span>
        </div>
      </div>

      {/* Order Details */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Order Details</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Date</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Item</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Revenue</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Fees</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Profit</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Margin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.slice(0, 20).map((order) => (
                <tr key={order.orderNumber} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-600">{order.date}</td>
                  <td className="px-4 py-3 text-gray-900 max-w-xs truncate" title={order.items.join(', ')}>
                    {order.items[0] || 'Unknown item'}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-900">{formatCurrency(order.totalRevenue)}</td>
                  <td className="px-4 py-3 text-right text-red-600">{formatCurrency(order.totalFees)}</td>
                  <td className="px-4 py-3 text-right text-green-600 font-medium">{formatCurrency(order.netProfit)}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                      order.profitMargin >= 70
                        ? 'bg-green-100 text-green-700'
                        : order.profitMargin >= 50
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {formatPercent(order.profitMargin)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {orders.length > 20 && (
          <div className="p-4 bg-gray-50 text-center text-sm text-gray-500">
            Showing 20 of {orders.length} orders. Upgrade to Pro to see all orders and export to CSV.
          </div>
        )}
      </div>
    </div>
  );
}
