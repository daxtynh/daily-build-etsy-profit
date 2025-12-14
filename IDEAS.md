# Ideas for December 13, 2025

## Problem Research

### What are people paying for that's overpriced?
- **EverBee**: $29.99/mo (Growth), $99/mo (Business) - focused on SEO/research, not profit tracking
- **Craftybase**: $19-49/mo - full inventory management, overkill for profit tracking
- **QuickBooks Self-Employed**: $15/mo - generic, doesn't understand Etsy's fee structure

### What are people doing manually?
- Downloading Etsy CSV exports and trying to reconcile with bank deposits
- Manually calculating fees (listing fee, transaction fee, payment processing, ads, shipping labels)
- Creating spreadsheets to track REAL profit after ALL fees
- Panicking at tax time when 1099-K shows gross (not net) income

### What do specific communities complain about?
**From real X/Twitter posts by Etsy sellers:**
1. "Etsy's fees are literally so shady my actual tax accountant is halfway to accusing me of misplacing transactions" - @foxflightstudio (23K+ likes)
2. "Etsy said they charged me $90.21 in fees... Using the CSV you can download, they charged me $148.80. A $58.59 discrepancy." - @KikiDoodleTweet
3. "When they charge your customers VAT or sales tax, they count that as income on your reports and charge their fee INCLUDING that number (Which, of course, never enters your bank account)" - @KikiDoodleTweet
4. "The 1099-K that Etsy sends you is your GROSS income... includes all your Etsy fees and shipping fees. They're telling YOU to pay taxes on the fees you paid THEM!" - @jupy314

**Core pain points:**
- Etsy reports GROSS sales to IRS (1099-K) but seller only receives NET
- Etsy charges fees ON TOP OF sales tax it collects
- Dashboard numbers don't match CSV exports don't match 1099
- No easy way to see TRUE profit per item

### What would I pay for?
A simple tool that tells me: "You made $X in sales, paid $Y in fees, your REAL profit is $Z" - with breakdown by item

## Candidates

### 1. Etsy Profit Calculator (EtsyProfit.io)
- **The problem**: Etsy sellers can't easily see their TRUE profit after all fees. Etsy shows gross sales, but between listing fees (20¢), transaction fees (6.5%), payment processing (3% + 25¢), offsite ads (12-15%), and shipping label costs - sellers have NO IDEA what they actually made.
- **The customer**: Etsy sellers with 50+ sales/month who are serious about their business. They hang out on r/EtsySellers, r/Etsy, Etsy seller Facebook groups, and follow #EtsySeller on X/Twitter.
- **Current solutions**:
  - Craftybase ($19-49/mo) - full inventory system, overkill for just profit tracking
  - Spreadsheets - manual, error-prone, time-consuming
  - Etsy's built-in tools - confusing, inaccurate, don't show true profit
- **My angle**: ONLY profit tracking. No inventory management. No SEO tools. Just "here's what you ACTUALLY made" with per-item breakdown.
- **Pricing**: $9/month or $79/year - cheaper than Craftybase, more valuable than spreadsheets
- **Revenue potential**: 5.6M active Etsy sellers, 82% solo operators. If 0.1% convert = 5,600 customers × $9 = $50K MRR
- **Buildability**: Medium - need to parse Etsy CSV exports
- **Requires**: CSV upload parser, fee calculator engine, user accounts, payment

### 2. Invoice Follow-up Tool for Freelancers
- **The problem**: Freelancers not getting paid on time
- **The customer**: Freelancers
- **Current solutions**: Wave, FreshBooks, manual emails
- **My angle**: Just payment follow-up, nothing else
- **Pricing**: $5-10/month
- **Revenue potential**: Crowded market, hard to differentiate
- **Buildability**: Easy
- **Requires**: Email integration, invoice tracking

### 3. Simple Email Marketing for Newsletter Writers
- **The problem**: Mailchimp is $300/mo for features nobody uses
- **The customer**: Substack/Beehiiv alternative seekers
- **Current solutions**: Mailchimp, ConvertKit, Buttondown
- **My angle**: Simpler, cheaper
- **Pricing**: $20/month
- **Revenue potential**: Very crowded market
- **Buildability**: Hard (deliverability is complex)
- **Requires**: Email infrastructure, complex

## Decision
**Building**: Etsy Profit Calculator
**Target customer**: Serious Etsy seller with 50+ sales/month, running business from home, needs to know REAL profit for taxes
**Day 1 price**: $9/month or $79/year
**Why this one**:
1. Clear, specific pain (Twitter complaints with 23K+ likes)
2. Defined audience (5.6M active sellers, 82% solo)
3. Existing tools are overpriced/overcomplicated
4. Tax season coming = urgent need
5. Can build functional MVP today with CSV parser + fee calculator
