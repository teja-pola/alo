import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const SearchBar = () => {
  const [location, setLocation] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (location.trim()) {
      navigate(`/search?location=${encodeURIComponent(location)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="search-wrapper">
      <input
        type="text"
        placeholder="Enter your location to find restaurants..."
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="search-input"
      />
      <button type="submit" className="search-button">
        <MagnifyingGlassIcon className="h-5 w-5 mr-2 inline-block" />
        Search
      </button>
    </form>
  );
};

export default SearchBar; 