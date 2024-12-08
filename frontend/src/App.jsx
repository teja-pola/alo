import React from 'react';
import AppRoutes from './routes/AppRoutes';
import Header from './components/layout/Header';
import StripeProvider from './components/payment/StripeProvider';

const App = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <StripeProvider>
        <Header />
        <AppRoutes />
      </StripeProvider>
    </div>
  );
};

export default App; 