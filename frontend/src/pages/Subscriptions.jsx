import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { booking } from '../services/booking';
import Button from '../components/common/Button';

const SubscriptionCard = ({ subscription, onCancel }) => {
  const [loading, setLoading] = useState(false);

  const handleCancel = async () => {
    if (window.confirm('Are you sure you want to cancel this subscription?')) {
      setLoading(true);
      try {
        await onCancel(subscription._id);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              {subscription.mealPlan.name}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {subscription.restaurant.name}
            </p>
          </div>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            subscription.status === 'active'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {subscription.status}
          </span>
        </div>

        <dl className="mt-4 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-gray-500">Meal Type</dt>
            <dd className="mt-1 text-sm text-gray-900 capitalize">
              {subscription.selectedOptions.mealType}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Delivery Option</dt>
            <dd className="mt-1 text-sm text-gray-900 capitalize">
              {subscription.selectedOptions.deliveryOption}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Start Date</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {new Date(subscription.startDate).toLocaleDateString()}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">End Date</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {new Date(subscription.endDate).toLocaleDateString()}
            </dd>
          </div>
        </dl>

        {subscription.status === 'active' && (
          <div className="mt-6 flex justify-end">
            <Button
              variant="danger"
              onClick={handleCancel}
              isLoading={loading}
              disabled={loading}
            >
              Cancel Subscription
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

const Subscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const response = await booking.getSubscriptions();
      setSubscriptions(response.data);
    } catch (err) {
      setError('Failed to fetch subscriptions. Please try again later.');
      console.error('Error fetching subscriptions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async (subscriptionId) => {
    try {
      await booking.cancelSubscription(subscriptionId);
      await fetchSubscriptions(); // Refresh the list
    } catch (err) {
      console.error('Error canceling subscription:', err);
      // Show error message to user
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">My Subscriptions</h1>
          <Link to="/search">
            <Button>Browse Meal Plans</Button>
          </Link>
        </div>

        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 text-red-600 rounded-md p-4">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {subscriptions.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No active subscriptions
              </h3>
              <p className="text-gray-500">
                Start by browsing our available meal plans and subscribe to one that suits you.
              </p>
            </div>
          ) : (
            subscriptions.map((subscription) => (
              <SubscriptionCard
                key={subscription._id}
                subscription={subscription}
                onCancel={handleCancelSubscription}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Subscriptions; 