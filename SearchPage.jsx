import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');  // To hold the search input
  const [allApplications, setAllApplications] = useState([]);  // To hold all fetched applications
  const [filteredApplications, setFilteredApplications] = useState([]);  // To hold filtered applications
  const [loading, setLoading] = useState(true);  // To handle loading state
  const [error, setError] = useState(null);  // To handle errors

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/applications?value=name,shortName');
        if (!response.ok) {
          throw new Error('Failed to fetch applications');
        }
        const data = await response.json();
        setAllApplications(data.applications);
        setFilteredApplications(data.applications); // Initialize with all applications
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim()) {
      // Filter applications where applicationId starts with the search query
      const filtered = allApplications.filter(app => app.applicationId.startsWith(query));
      setFilteredApplications(filtered);
    } else {
      // If search query is empty, show all applications
      setFilteredApplications(allApplications);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
      <h1>Search Applications</h1>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <FontAwesomeIcon icon={faSearch} style={{ marginRight: '8px', fontSize: '20px' }} />
        <input
          type="text"
          placeholder="Enter application ID to search"
          value={searchQuery}
          onChange={handleSearchChange}
          style={{ padding: '10px', width: '300px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '8px' }}
        />
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {filteredApplications.length > 0 && (
        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', textAlign: 'center', width: '400px' }}>
          <h2>Applications</h2>
          {filteredApplications.map((app) => (
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
