import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import './_SearchPage.scss'; // Import the SCSS file

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
        const response = await fetch('/applications?value=name,shortName');  // Updated API endpoint
        if (!response.ok) {
          throw new Error('Failed to fetch applications');
        }
        const data = await response.json();
        setAllApplications(data.applications); // Store all applications in state
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
      const filtered = allApplications.filter(app => String(app.applicationId).startsWith(query));
      setFilteredApplications(filtered);
    } else {
      setFilteredApplications([]);
    }
  };

  return (
    <div className="container">
      <h1>Search Applications</h1>
      <div className="search-container">
        <FontAwesomeIcon icon={faSearch} style={{ marginRight: '8px', fontSize: '20px' }} />
        <input
          type="text"
          placeholder="Enter application ID to search"
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="error">Error: {error}</p>}
      {filteredApplications.length > 0 && (
        <div className="card">
          <h2>Applications</h2>
          {filteredApplications.map((app) => (
            <div key={app.applicationId} className="card-item">
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
