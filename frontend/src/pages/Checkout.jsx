import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useCheckout } from '../context/CheckoutContext';
import { useAuth } from '../hooks/useAuth';
import { getRestaurantMealPlans } from '../services/restaurant';
import { payment } from '../services/payment';
import CheckoutLayout from '../components/checkout/CheckoutLayout';
import PlanSelection from '../components/checkout/PlanSelection';
import DeliveryDetails from '../components/checkout/DeliveryDetails';
import PaymentForm from '../components/checkout/PaymentForm';
import OrderConfirmation from '../components/checkout/OrderConfirmation';

// Initialize Stripe
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const Checkout = () => {
  const { mealPlanId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    state: { mealPlan, selectedOptions, deliveryDetails, currentStep },
    setMealPlan,
    setSelectedOptions,
    setDeliveryDetails,
    completeCheckout,
  } = useCheckout();

  // Add error state for Stripe
  const [stripeError, setStripeError] = useState(null);

  useEffect(() => {
    // Check Stripe configuration
    if (!process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY) {
      setStripeError('Stripe configuration is missing');
    }
  }, []);

  useEffect(() => {
    const fetchMealPlan = async () => {
      try {
        const response = await getRestaurantMealPlans(mealPlanId);
        setMealPlan(response.data);
      } catch (error) {
        console.error('Failed to fetch meal plan:', error);
        navigate('/');
      }
    };

    if (!user) {
      navigate('/login', { state: { from: `/checkout/${mealPlanId}` } });
      return;
    }

    if (mealPlanId && !mealPlan) {
      fetchMealPlan();
    }
  }, [mealPlanId, user, navigate, mealPlan, setMealPlan]);

  const handlePlanSelection = (options) => {
    setSelectedOptions(options);
  };

  const handleDeliveryDetails = (details) => {
    setDeliveryDetails(details);
  };

  const handlePayment = async (paymentDetails) => {
    try {
      let paymentResult;

      if (paymentDetails.type === 'card') {
        // Handle Stripe payment
        const paymentIntent = await payment.createPaymentIntent({
          amount: selectedOptions.price,
          currency: 'inr',
          paymentMethodId: paymentDetails.paymentMethodId,
        });

        paymentResult = await payment.confirmPayment(
          paymentIntent.id,
          paymentDetails.paymentMethodId
        );
      } else if (paymentDetails.type === 'upi') {
        // Handle UPI payment
        paymentResult = await payment.initiateUPIPayment({
          amount: selectedOptions.price,
          mealPlanId,
          selectedOptions,
          deliveryDetails,
        });
      } else {
        // Handle COD
        paymentResult = { success: true, orderId: 'COD-' + Date.now() };
      }

      if (paymentResult.success) {
        completeCheckout();
      }
    } catch (error) {
      console.error('Payment failed:', error);
      // Handle payment error (show error message, etc.)
    }
  };

  if (!mealPlan) {
    return null; // Or loading spinner
  }

  const renderStep = () => {
    switch (currentStep) {
      case 'plan':
        return (
          <PlanSelection
            mealPlan={mealPlan}
            onNext={handlePlanSelection}
          />
        );
      case 'details':
        return (
          <DeliveryDetails
            deliveryOption={selectedOptions.deliveryOption}
            onBack={() => navigate(-1)}
            onNext={handleDeliveryDetails}
          />
        );
      case 'payment':
        return (
          <Elements stripe={stripePromise}>
            <PaymentForm
              amount={selectedOptions.price}
              onBack={() => navigate(-1)}
              onNext={handlePayment}
            />
          </Elements>
        );
      case 'confirmation':
        return (
          <OrderConfirmation
            orderDetails={{
              orderId: 'ORD-' + Date.now(), // Replace with actual order ID
              restaurant: mealPlan.restaurant,
              mealPlan,
              selectedOptions,
              deliveryDetails,
              amount: selectedOptions.price,
              startDate: new Date().toISOString(),
            }}
          />
        );
      default:
        return null;
    }
  };

  // Handle Stripe error in the render
  if (stripeError) {
    return (
      <div className="text-red-600 p-4 bg-red-50 rounded-md">
        Error: {stripeError}
      </div>
    );
  }

  return (
    <CheckoutLayout currentStep={currentStep}>
      {renderStep()}
    </CheckoutLayout>
  );
};

export default Checkout; 