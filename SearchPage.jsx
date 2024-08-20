import React, { useState, useEffect } from 'react';

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');  // To hold the search input
  const [applicationData, setApplicationData] = useState(null);  // To hold the fetched data
  const [loading, setLoading] = useState(false);  // To handle loading state
  const [error, setError] = useState(null);  // To handle errors

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      fetchApplicationData(searchQuery);
    }
  };

  const fetchApplicationData = async (appId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://api.example.com/applications/${appId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch application data');
      }
      const data = await response.json();
      setApplicationData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
      <h1>Search Application</h1>
      <form onSubmit={handleSearchSubmit} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Enter Application ID"
          value={searchQuery}
          onChange={handleSearchChange}
          style={{ padding: '10px', width: '300px', fontSize: '16px' }}
        />
        <button type="submit" style={{ padding: '10px 20px', marginLeft: '10px', fontSize: '16px' }}>Search</button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {applicationData && (
        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', textAlign: 'center', width: '400px' }}>
          <h2>{applicationData.name}</h2>
          <p><strong>Application ID:</strong> {applicationData.applicationId}</p>
          <p><strong>Short Name:</strong> {applicationData.shortname}</p>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
