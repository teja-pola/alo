import React, { createContext, useContext, useReducer } from 'react';
import PropTypes from 'prop-types';

const CheckoutContext = createContext(null);

const initialState = {
  mealPlan: null,
  selectedOptions: null,
  deliveryDetails: null,
  currentStep: 'plan',
};

const checkoutReducer = (state, action) => {
  switch (action.type) {
    case 'SET_MEAL_PLAN':
      return {
        ...state,
        mealPlan: action.payload,
      };
    case 'SET_SELECTED_OPTIONS':
      return {
        ...state,
        selectedOptions: action.payload,
        currentStep: 'details',
      };
    case 'SET_DELIVERY_DETAILS':
      return {
        ...state,
        deliveryDetails: action.payload,
        currentStep: 'payment',
      };
    case 'COMPLETE_CHECKOUT':
      return {
        ...state,
        currentStep: 'confirmation',
      };
    case 'RESET_CHECKOUT':
      return initialState;
    default:
      return state;
  }
};

export const CheckoutProvider = ({ children }) => {
  const [state, dispatch] = useReducer(checkoutReducer, initialState);

  const value = {
    state,
    setMealPlan: (mealPlan) => dispatch({ type: 'SET_MEAL_PLAN', payload: mealPlan }),
    setSelectedOptions: (options) => dispatch({ type: 'SET_SELECTED_OPTIONS', payload: options }),
    setDeliveryDetails: (details) => dispatch({ type: 'SET_DELIVERY_DETAILS', payload: details }),
    completeCheckout: () => dispatch({ type: 'COMPLETE_CHECKOUT' }),
    resetCheckout: () => dispatch({ type: 'RESET_CHECKOUT' }),
  };

  return (
    <CheckoutContext.Provider value={value}>
      {children}
    </CheckoutContext.Provider>
  );
};

CheckoutProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useCheckout = () => {
  const context = useContext(CheckoutContext);
  if (!context) {
    throw new Error('useCheckout must be used within a CheckoutProvider');
  }
  return context;
}; 