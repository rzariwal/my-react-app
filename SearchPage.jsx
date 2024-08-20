import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');  // To hold the search input
  const [applications, setApplications] = useState([]);  // To hold the fetched applications
  const [loading, setLoading] = useState(false);  // To handle loading state
  const [error, setError] = useState(null);  // To handle errors

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value.trim()) {
      fetchApplications(e.target.value);
    } else {
      setApplications([]); // Clear applications if search query is empty
    }
  };

  const fetchApplications = async (query) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/applications?value=${query}`);
      if (!response.ok) {
        throw new Error('Failed to fetch applications');
      }
      const data = await response.json();
      setApplications(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
      <h1>Search Applications</h1>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <FontAwesomeIcon icon={faSearch} style={{ marginRight: '8px', fontSize: '20px' }} />
        <input
          type="text"
          placeholder="Enter application name or short name"
          value={searchQuery}
          onChange={handleSearchChange}
          style={{ padding: '10px', width: '300px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '8px' }}
        />
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {applications.length > 0 && (
        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', textAlign: 'center', width: '400px' }}>
          <h2>Applications</h2>
          {applications.map((app) => (
            <div key={app.applicationId} style={{ marginBottom: '10px' }}>
              <p><strong>Application ID:</strong> {app.applicationId}</p>
              <p><strong>Name:</strong> {app.name}</p>
              <p><strong>Short Name:</strong> {app.shortName}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
