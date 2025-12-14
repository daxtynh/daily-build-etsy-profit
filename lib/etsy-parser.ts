import Papa from 'papaparse';
import { EtsyTransaction, EtsyOrder, ProfitSummary, ParsedData } from './types';

// Etsy CSV column mappings (they export different formats)
const COLUMN_MAPPINGS = {
  date: ['Date', 'date', 'Transaction Date'],
  type: ['Type', 'type', 'Transaction Type'],
  title: ['Title', 'title', 'Description'],
  info: ['Info', 'info', 'Additional Info', 'Details'],
  currency: ['Currency', 'currency'],
  amount: ['Amount', 'amount', 'Sale Amount'],
  feesAndTaxes: ['Fees & Taxes', 'Fees and Taxes', 'fees', 'Fee'],
  net: ['Net', 'net', 'Net Amount'],
};

function findColumn(headers: string[], possibleNames: string[]): string | null {
  const lowerHeaders = headers.map(h => h?.toLowerCase().trim());
  for (const name of possibleNames) {
    const idx = lowerHeaders.indexOf(name.toLowerCase());
    if (idx !== -1) return headers[idx];
  }
  return null;
}

function parseAmount(value: string | number | undefined): number {
  if (value === undefined || value === null || value === '') return 0;
  if (typeof value === 'number') return value;
  // Remove currency symbols, commas, and parse
  const cleaned = value.toString().replace(/[^0-9.-]/g, '');
  return parseFloat(cleaned) || 0;
}

function extractOrderNumber(info: string): string | undefined {
  // Etsy order numbers are typically in the info field
  const match = info?.match(/(?:Order\s*#?\s*|#)(\d{10,})/i);
  return match ? match[1] : undefined;
}

export function parseEtsyCSV(csvContent: string): ParsedData {
  const result = Papa.parse(csvContent, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim(),
  });

  const headers = result.meta.fields || [];
  const rows = result.data as Record<string, string>[];

  // Find column names
  const dateCol = findColumn(headers, COLUMN_MAPPINGS.date);
  const typeCol = findColumn(headers, COLUMN_MAPPINGS.type);
  const titleCol = findColumn(headers, COLUMN_MAPPINGS.title);
  const infoCol = findColumn(headers, COLUMN_MAPPINGS.info);
  const currencyCol = findColumn(headers, COLUMN_MAPPINGS.currency);
  const amountCol = findColumn(headers, COLUMN_MAPPINGS.amount);
  const feesCol = findColumn(headers, COLUMN_MAPPINGS.feesAndTaxes);
  const netCol = findColumn(headers, COLUMN_MAPPINGS.net);

  // Parse transactions
  const transactions: EtsyTransaction[] = rows.map(row => ({
    date: dateCol ? row[dateCol] || '' : '',
    type: typeCol ? row[typeCol] || '' : '',
    title: titleCol ? row[titleCol] || '' : '',
    info: infoCol ? row[infoCol] || '' : '',
    currency: currencyCol ? row[currencyCol] || 'USD' : 'USD',
    amount: amountCol ? parseAmount(row[amountCol]) : 0,
    feesAndTaxes: feesCol ? parseAmount(row[feesCol]) : 0,
    net: netCol ? parseAmount(row[netCol]) : 0,
    orderNumber: infoCol ? extractOrderNumber(row[infoCol] || '') : undefined,
  })).filter(t => t.date || t.amount !== 0);

  // Categorize transactions and calculate
  const orders = aggregateOrders(transactions);
  const summary = calculateSummary(orders, transactions);

  return {
    orders,
    summary,
    rawTransactions: transactions,
  };
}

function categorizeTransaction(type: string, title: string): string {
  const lowerType = type.toLowerCase();
  const lowerTitle = title.toLowerCase();

  if (lowerType.includes('sale') || lowerType.includes('payment')) return 'sale';
  if (lowerType.includes('listing') || lowerTitle.includes('listing fee')) return 'listing_fee';
  if (lowerType.includes('transaction') || lowerTitle.includes('transaction fee')) return 'transaction_fee';
  if (lowerType.includes('processing') || lowerTitle.includes('payment processing')) return 'processing_fee';
  if (lowerType.includes('offsite') || lowerTitle.includes('offsite ad')) return 'offsite_ad_fee';
  if (lowerType.includes('shipping') && (lowerType.includes('label') || lowerTitle.includes('label'))) return 'shipping_label';
  if (lowerType.includes('shipping')) return 'shipping';
  if (lowerType.includes('tax') || lowerTitle.includes('sales tax')) return 'sales_tax';
  if (lowerType.includes('regulatory') || lowerTitle.includes('regulatory')) return 'regulatory_fee';
  if (lowerType.includes('fee') || lowerTitle.includes('fee')) return 'other_fee';
  if (lowerType.includes('refund')) return 'refund';
  if (lowerType.includes('deposit')) return 'deposit';

  return 'other';
}

function aggregateOrders(transactions: EtsyTransaction[]): EtsyOrder[] {
  const orderMap = new Map<string, EtsyOrder>();
  let unassignedOrderNum = 0;

  for (const tx of transactions) {
    const category = categorizeTransaction(tx.type, tx.title);

    // Skip non-order transactions like deposits
    if (category === 'deposit') continue;

    const orderNumber = tx.orderNumber || `unassigned-${unassignedOrderNum++}`;

    if (!orderMap.has(orderNumber)) {
      orderMap.set(orderNumber, {
        orderNumber,
        date: tx.date,
        items: [],
        saleAmount: 0,
        shippingCharged: 0,
        salesTax: 0,
        totalRevenue: 0,
        listingFees: 0,
        transactionFees: 0,
        paymentProcessingFees: 0,
        offsiteAdsFees: 0,
        shippingLabelCost: 0,
        regulatoryFees: 0,
        otherFees: 0,
        totalFees: 0,
        netProfit: 0,
        profitMargin: 0,
      });
    }

    const order = orderMap.get(orderNumber)!;

    switch (category) {
      case 'sale':
        order.saleAmount += Math.abs(tx.amount);
        if (tx.title && !order.items.includes(tx.title)) {
          order.items.push(tx.title);
        }
        break;
      case 'shipping':
        order.shippingCharged += Math.abs(tx.amount);
        break;
      case 'sales_tax':
        order.salesTax += Math.abs(tx.amount);
        break;
      case 'listing_fee':
        order.listingFees += Math.abs(tx.feesAndTaxes || tx.amount);
        break;
      case 'transaction_fee':
        order.transactionFees += Math.abs(tx.feesAndTaxes || tx.amount);
        break;
      case 'processing_fee':
        order.paymentProcessingFees += Math.abs(tx.feesAndTaxes || tx.amount);
        break;
      case 'offsite_ad_fee':
        order.offsiteAdsFees += Math.abs(tx.feesAndTaxes || tx.amount);
        break;
      case 'shipping_label':
        order.shippingLabelCost += Math.abs(tx.amount);
        break;
      case 'regulatory_fee':
        order.regulatoryFees += Math.abs(tx.feesAndTaxes || tx.amount);
        break;
      case 'refund':
        order.saleAmount -= Math.abs(tx.amount);
        break;
      default:
        if (tx.feesAndTaxes && tx.feesAndTaxes < 0) {
          order.otherFees += Math.abs(tx.feesAndTaxes);
        }
    }
  }

  // Calculate totals for each order
  return Array.from(orderMap.values()).map(order => {
    order.totalRevenue = order.saleAmount + order.shippingCharged;
    order.totalFees = order.listingFees + order.transactionFees +
      order.paymentProcessingFees + order.offsiteAdsFees +
      order.shippingLabelCost + order.regulatoryFees + order.otherFees;
    order.netProfit = order.totalRevenue - order.totalFees;
    order.profitMargin = order.totalRevenue > 0
      ? (order.netProfit / order.totalRevenue) * 100
      : 0;
    return order;
  }).filter(order => order.saleAmount > 0 || order.totalFees > 0)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

function calculateSummary(orders: EtsyOrder[], transactions: EtsyTransaction[]): ProfitSummary {
  const summary: ProfitSummary = {
    totalSales: 0,
    totalShippingCharged: 0,
    totalSalesTax: 0,
    totalRevenue: 0,
    totalListingFees: 0,
    totalTransactionFees: 0,
    totalPaymentProcessingFees: 0,
    totalOffsiteAdsFees: 0,
    totalShippingLabelCosts: 0,
    totalRegulatoryFees: 0,
    totalOtherFees: 0,
    totalFees: 0,
    netProfit: 0,
    profitMargin: 0,
    effectiveFeeRate: 0,
    orderCount: orders.length,
    dateRange: {
      start: '',
      end: '',
    },
  };

  for (const order of orders) {
    summary.totalSales += order.saleAmount;
    summary.totalShippingCharged += order.shippingCharged;
    summary.totalSalesTax += order.salesTax;
    summary.totalListingFees += order.listingFees;
    summary.totalTransactionFees += order.transactionFees;
    summary.totalPaymentProcessingFees += order.paymentProcessingFees;
    summary.totalOffsiteAdsFees += order.offsiteAdsFees;
    summary.totalShippingLabelCosts += order.shippingLabelCost;
    summary.totalRegulatoryFees += order.regulatoryFees;
    summary.totalOtherFees += order.otherFees;
  }

  summary.totalRevenue = summary.totalSales + summary.totalShippingCharged;
  summary.totalFees = summary.totalListingFees + summary.totalTransactionFees +
    summary.totalPaymentProcessingFees + summary.totalOffsiteAdsFees +
    summary.totalShippingLabelCosts + summary.totalRegulatoryFees + summary.totalOtherFees;
  summary.netProfit = summary.totalRevenue - summary.totalFees;
  summary.profitMargin = summary.totalRevenue > 0
    ? (summary.netProfit / summary.totalRevenue) * 100
    : 0;
  summary.effectiveFeeRate = summary.totalRevenue > 0
    ? (summary.totalFees / summary.totalRevenue) * 100
    : 0;

  // Calculate date range
  const dates = transactions
    .map(t => t.date)
    .filter(d => d)
    .map(d => new Date(d))
    .filter(d => !isNaN(d.getTime()))
    .sort((a, b) => a.getTime() - b.getTime());

  if (dates.length > 0) {
    summary.dateRange.start = dates[0].toLocaleDateString();
    summary.dateRange.end = dates[dates.length - 1].toLocaleDateString();
  }

  return summary;
}

// Generate demo data for users without Etsy exports
export function generateDemoData(): ParsedData {
  const demoOrders: EtsyOrder[] = [
    {
      orderNumber: '3847291056',
      date: '2024-12-10',
      items: ['Handmade Ceramic Mug - Blue Glaze'],
      saleAmount: 34.99,
      shippingCharged: 8.50,
      salesTax: 3.22,
      totalRevenue: 43.49,
      listingFees: 0.20,
      transactionFees: 2.83,
      paymentProcessingFees: 1.58,
      offsiteAdsFees: 0,
      shippingLabelCost: 5.25,
      regulatoryFees: 0.30,
      otherFees: 0,
      totalFees: 10.16,
      netProfit: 33.33,
      profitMargin: 76.6,
    },
    {
      orderNumber: '3847291057',
      date: '2024-12-09',
      items: ['Custom Pet Portrait - Digital Download'],
      saleAmount: 45.00,
      shippingCharged: 0,
      salesTax: 4.05,
      totalRevenue: 45.00,
      listingFees: 0.20,
      transactionFees: 2.93,
      paymentProcessingFees: 1.63,
      offsiteAdsFees: 5.40,
      shippingLabelCost: 0,
      regulatoryFees: 0.30,
      otherFees: 0,
      totalFees: 10.46,
      netProfit: 34.54,
      profitMargin: 76.8,
    },
    {
      orderNumber: '3847291058',
      date: '2024-12-08',
      items: ['Knitted Baby Blanket - Soft Pink'],
      saleAmount: 89.99,
      shippingCharged: 12.00,
      salesTax: 9.18,
      totalRevenue: 101.99,
      listingFees: 0.20,
      transactionFees: 6.63,
      paymentProcessingFees: 3.36,
      offsiteAdsFees: 12.24,
      shippingLabelCost: 8.95,
      regulatoryFees: 0.30,
      otherFees: 0,
      totalFees: 31.68,
      netProfit: 70.31,
      profitMargin: 68.9,
    },
    {
      orderNumber: '3847291059',
      date: '2024-12-07',
      items: ['Vintage Style Earrings - Gold'],
      saleAmount: 28.00,
      shippingCharged: 4.50,
      salesTax: 2.93,
      totalRevenue: 32.50,
      listingFees: 0.20,
      transactionFees: 2.11,
      paymentProcessingFees: 1.24,
      offsiteAdsFees: 0,
      shippingLabelCost: 3.75,
      regulatoryFees: 0.30,
      otherFees: 0,
      totalFees: 7.60,
      netProfit: 24.90,
      profitMargin: 76.6,
    },
    {
      orderNumber: '3847291060',
      date: '2024-12-06',
      items: ['Personalized Leather Wallet'],
      saleAmount: 65.00,
      shippingCharged: 7.99,
      salesTax: 6.57,
      totalRevenue: 72.99,
      listingFees: 0.20,
      transactionFees: 4.74,
      paymentProcessingFees: 2.46,
      offsiteAdsFees: 8.76,
      shippingLabelCost: 6.15,
      regulatoryFees: 0.30,
      otherFees: 0,
      totalFees: 22.61,
      netProfit: 50.38,
      profitMargin: 69.0,
    },
  ];

  const summary: ProfitSummary = {
    totalSales: demoOrders.reduce((sum, o) => sum + o.saleAmount, 0),
    totalShippingCharged: demoOrders.reduce((sum, o) => sum + o.shippingCharged, 0),
    totalSalesTax: demoOrders.reduce((sum, o) => sum + o.salesTax, 0),
    totalRevenue: demoOrders.reduce((sum, o) => sum + o.totalRevenue, 0),
    totalListingFees: demoOrders.reduce((sum, o) => sum + o.listingFees, 0),
    totalTransactionFees: demoOrders.reduce((sum, o) => sum + o.transactionFees, 0),
    totalPaymentProcessingFees: demoOrders.reduce((sum, o) => sum + o.paymentProcessingFees, 0),
    totalOffsiteAdsFees: demoOrders.reduce((sum, o) => sum + o.offsiteAdsFees, 0),
    totalShippingLabelCosts: demoOrders.reduce((sum, o) => sum + o.shippingLabelCost, 0),
    totalRegulatoryFees: demoOrders.reduce((sum, o) => sum + o.regulatoryFees, 0),
    totalOtherFees: demoOrders.reduce((sum, o) => sum + o.otherFees, 0),
    totalFees: demoOrders.reduce((sum, o) => sum + o.totalFees, 0),
    netProfit: demoOrders.reduce((sum, o) => sum + o.netProfit, 0),
    profitMargin: 0,
    effectiveFeeRate: 0,
    orderCount: demoOrders.length,
    dateRange: { start: '12/6/2024', end: '12/10/2024' },
  };

  summary.profitMargin = (summary.netProfit / summary.totalRevenue) * 100;
  summary.effectiveFeeRate = (summary.totalFees / summary.totalRevenue) * 100;

  return {
    orders: demoOrders,
    summary,
    rawTransactions: [],
  };
}
