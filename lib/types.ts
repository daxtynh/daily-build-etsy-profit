export interface EtsyTransaction {
  date: string;
  type: string;
  title: string;
  info: string;
  currency: string;
  amount: number;
  feesAndTaxes: number;
  net: number;
  orderNumber?: string;
}

export interface EtsyOrder {
  orderNumber: string;
  date: string;
  items: string[];
  saleAmount: number;
  shippingCharged: number;
  salesTax: number;
  totalRevenue: number;
  // Fees
  listingFees: number;
  transactionFees: number;
  paymentProcessingFees: number;
  offsiteAdsFees: number;
  shippingLabelCost: number;
  regulatoryFees: number;
  otherFees: number;
  // Calculated
  totalFees: number;
  netProfit: number;
  profitMargin: number;
}

export interface ProfitSummary {
  totalSales: number;
  totalShippingCharged: number;
  totalSalesTax: number;
  totalRevenue: number;
  // Fee breakdown
  totalListingFees: number;
  totalTransactionFees: number;
  totalPaymentProcessingFees: number;
  totalOffsiteAdsFees: number;
  totalShippingLabelCosts: number;
  totalRegulatoryFees: number;
  totalOtherFees: number;
  // Totals
  totalFees: number;
  netProfit: number;
  profitMargin: number;
  effectiveFeeRate: number;
  // Meta
  orderCount: number;
  dateRange: {
    start: string;
    end: string;
  };
}

export interface ParsedData {
  orders: EtsyOrder[];
  summary: ProfitSummary;
  rawTransactions: EtsyTransaction[];
}
