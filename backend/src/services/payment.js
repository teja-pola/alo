const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const crypto = require('crypto');

class PaymentService {
  async createPaymentIntent(amount, currency = 'inr') {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100, // Convert to smallest currency unit
        currency,
        payment_method_types: ['card'],
      });

      return paymentIntent;
    } catch (error) {
      throw new Error(`Failed to create payment intent: ${error.message}`);
    }
  }

  async confirmPayment(paymentIntentId, paymentMethodId) {
    try {
      const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId, {
        payment_method: paymentMethodId,
      });

      return {
        success: paymentIntent.status === 'succeeded',
        paymentIntent,
      };
    } catch (error) {
      throw new Error(`Failed to confirm payment: ${error.message}`);
    }
  }

  async initiateUPIPayment(bookingData) {
    try {
      // Generate a unique transaction ID
      const transactionId = crypto.randomBytes(16).toString('hex');

      // In a real implementation, you would:
      // 1. Create a UPI payment request with your payment gateway
      // 2. Return the UPI payment URL or deep link
      // 3. Store the transaction details in your database

      return {
        success: true,
        transactionId,
        upiUrl: `upi://pay?pa=${process.env.UPI_ID}&pn=ALO&am=${bookingData.amount}&tr=${transactionId}`,
      };
    } catch (error) {
      throw new Error(`Failed to initiate UPI payment: ${error.message}`);
    }
  }

  async verifyUPIPayment(transactionId) {
    try {
      // In a real implementation, you would:
      // 1. Check the payment status with your payment gateway
      // 2. Update the transaction status in your database
      // 3. Return the verification result

      // Simulated verification
      return {
        success: true,
        transactionId,
        status: 'completed',
      };
    } catch (error) {
      throw new Error(`Failed to verify UPI payment: ${error.message}`);
    }
  }

  async processRefund(paymentDetails, amount) {
    try {
      if (paymentDetails.paymentMethod === 'card') {
        const refund = await stripe.refunds.create({
          payment_intent: paymentDetails.transactionId,
          amount: amount * 100,
        });

        return {
          success: true,
          refundId: refund.id,
        };
      } else if (paymentDetails.paymentMethod === 'upi') {
        // Implement UPI refund logic
        return {
          success: true,
          refundId: crypto.randomBytes(16).toString('hex'),
        };
      }

      throw new Error('Unsupported payment method for refund');
    } catch (error) {
      throw new Error(`Failed to process refund: ${error.message}`);
    }
  }
}

module.exports = new PaymentService(); 