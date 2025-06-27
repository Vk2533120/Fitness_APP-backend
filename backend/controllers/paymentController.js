// const Stripe = require('stripe');
require('dotenv').config();

const Stripe = require('stripe');
console.log("hhshds");

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);


console.log("Stripe Key:", process.env.STRIPE_SECRET_KEY);
exports.processPayment = async (req, res) => {
  const { amount, currency = 'inr' } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // convert to paisa
      currency,
      payment_method_types: ['card'],
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
