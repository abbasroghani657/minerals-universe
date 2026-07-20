// CHANGE THIS LINE TO GO LIVE: replace the test key with your live STRIPE_SECRET_KEY in .env.local
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock_key', {
  apiVersion: '2026-03-25.dahlia',
});

export default stripe;
