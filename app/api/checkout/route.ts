import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const PRICES = {
  monthly: process.env.STRIPE_MONTHLY_PRICE_ID || 'price_monthly',
  yearly: process.env.STRIPE_YEARLY_PRICE_ID || 'price_yearly',
};

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    return null;
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

export async function POST(request: NextRequest) {
  try {
    const { plan } = await request.json();

    if (!plan || !['monthly', 'yearly'].includes(plan)) {
      return NextResponse.json(
        { error: 'Invalid plan selected' },
        { status: 400 }
      );
    }

    const stripe = getStripe();

    // Check if Stripe is configured
    if (!stripe) {
      // Return a demo checkout URL for testing
      return NextResponse.json({
        url: '/checkout-demo?plan=' + plan,
        demo: true,
      });
    }

    const origin = request.headers.get('origin') || 'https://etsyprofit.io';

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: PRICES[plan as keyof typeof PRICES],
          quantity: 1,
        },
      ],
      success_url: origin + '/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: origin + '/?canceled=true',
      allow_promotion_codes: true,
      billing_address_collection: 'required',
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
