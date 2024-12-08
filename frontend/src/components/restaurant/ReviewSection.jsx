import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '../../hooks/useAuth';
import { getRestaurantReviews, submitRestaurantReview } from '../../services/restaurant';
import Button from '../common/Button';
import ReviewForm from './ReviewForm';

const ReviewSection = ({ restaurantId }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, [restaurantId, page]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await getRestaurantReviews(restaurantId, { page });
      if (page === 1) {
        setReviews(response.data);
      } else {
        setReviews((prev) => [...prev, ...response.data]);
      }
      setHasMore(response.data.length === 10); // Assuming 10 reviews per page
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (reviewData) => {
    try {
      await submitRestaurantReview(restaurantId, reviewData);
      setShowReviewForm(false);
      setPage(1);
      fetchReviews();
    } catch (error) {
      console.error('Failed to submit review:', error);
    }
  };

  return (
    <div className="space-y-8">
      {/* Review Form */}
      {user && !showReviewForm && (
        <div className="text-center">
          <Button onClick={() => setShowReviewForm(true)}>Write a Review</Button>
        </div>
      )}

      {showReviewForm && (
        <ReviewForm
          onSubmit={handleSubmitReview}
          onCancel={() => setShowReviewForm(false)}
        />
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review._id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <img
                  src={review.user.profileImage || 'https://via.placeholder.com/40'}
                  alt={review.user.name}
                  className="h-10 w-10 rounded-full"
                />
                <div className="ml-4">
                  <h4 className="text-sm font-medium text-gray-900">{review.user.name}</h4>
                  <div className="mt-1 flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-sm ${
                          i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <span className="text-sm text-gray-500">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="mt-4 text-gray-600">{review.comment}</p>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && !loading && (
        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => setPage((prev) => prev + 1)}
          >
            Load More Reviews
          </Button>
        </div>
      )}

      {loading && (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      )}
    </div>
  );
};

ReviewSection.propTypes = {
  restaurantId: PropTypes.string.isRequired,
};

export default ReviewSection; 