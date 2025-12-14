# Build Log: EtsyProfit

**Date**: December 13, 2025
**Build Time**: ~1 hour
**Status**: LIVE

## Live URLs
- **Production**: https://etsy-profit-calc.vercel.app
- **GitHub**: https://github.com/daxtynh/daily-build-etsy-profit

## Problem Solved

Etsy sellers can't easily see their TRUE profit after all fees. Etsy shows gross sales, but between listing fees, transaction fees, payment processing, offsite ads, and shipping labels - sellers have NO IDEA what they actually keep.

**Key pain point discovered from Twitter research:**
> "Etsy's fees are literally so shady my actual tax accountant is halfway to accusing me of misplacing transactions bc we can't account for this gap between what they CLAIM I made on their form, what they claim I made on their website (different!) and what my software tracks I made." - @foxflightstudio (23K+ likes)

**The tax problem:**
- Etsy reports GROSS sales to IRS on 1099-K (including sales tax they collect)
- Sellers pay taxes on money they never received
- Etsy charges fees ON TOP of the taxes they collect

## Target Customer

- Etsy sellers with 50+ sales/month
- Running business from home (97% of Etsy sellers)
- Solo operators (82% of Etsy sellers)
- Need to know real profit for taxes
- Hang out on: r/EtsySellers, r/Etsy, Etsy seller Facebook groups, #EtsySeller on Twitter

**Market size**: 5.6 million active Etsy sellers

## Pricing Model

- **Free tier**: Upload CSV, see basic profit summary (limited to 20 orders displayed)
- **Pro - $9/month**: Unlimited orders, CSV export, tax-ready reports
- **Pro - $79/year**: Same as monthly, 27% savings

## What Was Built

### Core Features
1. **CSV Parser** - Parses Etsy export files with flexible column mapping
2. **Profit Calculator** - Calculates all Etsy fees:
   - Listing fees ($0.20/item)
   - Transaction fees (6.5%)
   - Payment processing (3% + $0.25)
   - Offsite ads (12-15%)
   - Shipping labels
   - Regulatory fees
3. **Dashboard** - Visual breakdown of:
   - Gross revenue vs. net profit
   - Fee breakdown by type
   - Per-order profit margins
   - "Brutal Truth" box showing IRS reporting discrepancy
4. **Demo Mode** - Try with sample data before uploading
5. **Stripe Integration** - Ready for subscriptions

### Tech Stack
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- PapaParse (CSV parsing)
- Stripe (payments)
- Vercel Analytics

## Key Files
- `lib/etsy-parser.ts` - CSV parsing and profit calculation engine
- `lib/types.ts` - TypeScript interfaces
- `components/ProfitDashboard.tsx` - Main results display
- `components/FileUpload.tsx` - Drag-drop CSV upload
- `components/PricingModal.tsx` - Upgrade modal
- `app/api/checkout/route.ts` - Stripe checkout API

## Privacy Note
All CSV parsing happens client-side in the browser. No sales data is ever sent to any server.

## To Enable Payments

1. Create Stripe account at https://dashboard.stripe.com
2. Create two products:
   - Monthly: $9/month subscription
   - Yearly: $79/year subscription
3. Add to Vercel environment variables:
   ```
   STRIPE_SECRET_KEY=sk_live_xxx
   STRIPE_MONTHLY_PRICE_ID=price_xxx
   STRIPE_YEARLY_PRICE_ID=price_xxx
   ```

## Next Steps for Growth

1. **SEO Content**: Write "Etsy fees explained" blog posts
2. **Reddit Marketing**: Help sellers on r/EtsySellers with fee questions
3. **Twitter**: Engage with Etsy seller complaints
4. **Product Hunt**: Launch during tax season (Jan-April)
5. **Feature additions**:
   - Historical trend tracking
   - Multi-shop support
   - Direct Etsy API integration
   - Automatic 1099-K reconciliation

## Revenue Potential

Conservative estimate:
- 5.6M active Etsy sellers
- 0.1% conversion = 5,600 customers
- $9/month average = **$50,400 MRR**

Even at 0.01% conversion:
- 560 customers × $9 = **$5,040 MRR**

## Competitors

| Tool | Price | Focus |
|------|-------|-------|
| Craftybase | $19-49/mo | Full inventory management |
| EverBee | $29.99/mo | SEO & research |
| eRank | $5.99/mo | SEO tools |
| **EtsyProfit** | $9/mo | **Profit tracking only** |

Our angle: Simpler, cheaper, focused only on profit clarity.
