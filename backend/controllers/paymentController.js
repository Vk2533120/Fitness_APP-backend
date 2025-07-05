require('dotenv').config();
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Optional: import your Payment model if saving to DB
// const Payment = require('../models/Payment');

exports.createPaymentIntent = async (req, res) => {
  const { amount } = req.body;

  if (!amount) return res.status(400).json({ message: 'Amount is required' });

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // amount in paisa
      currency: 'inr',
      metadata: {
        integration_check: 'fitness_booking',
        user: req.user?.email || 'guest',
      },
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });

  } catch (err) {
    console.error('Payment Error:', err.message);
    res.status(500).json({ message: err.message });
  }
};
