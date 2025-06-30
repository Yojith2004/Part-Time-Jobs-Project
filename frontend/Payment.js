import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
const stripePromise = loadStripe('your_stripe_public_key');

const Payment = ({ amount }) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    const stripe = await stripePromise;
    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount }),
    });
    const { clientSecret } = await response.json();
    const { error } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: { /* Card element */ },
      },
    });
    if (error) {
      alert('Payment failed');
    } else {
      alert('Payment successful');
    }
    setLoading(false);
  };

  return (
    <div>
      <button onClick={handlePayment} disabled={loading}>
        Pay Now
      </button>
    </div>
  );
};

export default Payment;
