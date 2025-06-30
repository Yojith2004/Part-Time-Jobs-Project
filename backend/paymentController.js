const stripe = require('stripe')('your_stripe_secret_key');  // Add your secret key here

// Endpoint to handle payment creation
exports.createPayment = async (req, res) => {
  const { amount } = req.body; // Amount in dollars

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,  // Convert dollars to cents
      currency: 'usd',
    });
    
    res.status(200).send({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
