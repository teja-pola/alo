import React from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../components/search/SearchBar';
import Card from '../components/common/Card';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-white overflow-hidden">
        <div className="container-custom">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="section-padding">
              <div className="sm:text-center lg:text-left">
                <h1 className="heading-1">
                  <span className="block">Subscribe to</span>
                  <span className="block text-primary-600">Delicious Meals</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Get your favorite meals delivered from top restaurants and hotels.
                  Choose your meal plan and enjoy hassle-free dining.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <SearchBar />
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <img
            className="img-responsive"
            src="/hero-image.jpg"
            alt="Delicious food"
          />
        </div>
      </div>

      {/* Features Section */}
      <div className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center">
            <h2 className="heading-2 text-primary-600">How it works</h2>
            <p className="mt-4 text-xl text-gray-600">
              Subscribe to your favorite meals in three simple steps
            </p>
          </div>

          <div className="mt-12">
            <div className="cards-grid">
              {/* Feature 1 */}
              <Card className="px-6 py-8">
                <div className="text-center">
                  <div className="h-12 w-12 text-primary-600 mx-auto">
                    {/* Icon */}
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">
                    Choose your location
                  </h3>
                  <p className="mt-2 text-base text-gray-500">
                    Enter your location to find restaurants and hotels near you.
                  </p>
                </div>
              </Card>

              {/* Feature 2 */}
              <Card className="px-6 py-8">
                <div className="text-center">
                  <div className="h-12 w-12 text-primary-600 mx-auto">
                    {/* Icon */}
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">
                    Select your meal plan
                  </h3>
                  <p className="mt-2 text-base text-gray-500">
                    Choose from various meal plans that suit your preferences.
                  </p>
                </div>
              </Card>

              {/* Feature 3 */}
              <Card className="px-6 py-8">
                <div className="text-center">
                  <div className="h-12 w-12 text-primary-600 mx-auto">
                    {/* Icon */}
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">
                    Enjoy your meals
                  </h3>
                  <p className="mt-2 text-base text-gray-500">
                    Get your meals delivered or dine in at your convenience.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 