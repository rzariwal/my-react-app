import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import './_SearchPage.scss'; // Import SCSS file

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [allApplications, setAllApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch all applications on component mount
  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/applications?values=name,shortName'); // Updated API endpoint
        if (!response.ok) {
          throw new Error('Failed to fetch applications');
        }
        const data = await response.json();
        setAllApplications(data.applications);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  // Filter applications based on search query
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = allApplications.filter(app => {
        const appIdStr = String(app.applicationId); // Ensure applicationId is treated as a string
        return appIdStr.toLowerCase().startsWith(searchQuery.toLowerCase());
      });
      setFilteredApplications(filtered);
    } else {
      setFilteredApplications([]); // Start with an empty array when query is empty
    }
  }, [searchQuery, allApplications]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCardClick = (appId) => {
    if (appId) {
      navigate(`/applications/${appId}`); // Updated navigation URL
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

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error">Error: {error}</p>
      ) : (
        <div
          className={`card ${filteredApplications.length === 1 ? 'clickable' : 'not-clickable'}`}
          onClick={() => filteredApplications.length === 1 && handleCardClick(filteredApplications[0].applicationId)}
        >
          {filteredApplications.length === 0 && searchQuery.trim() ? (
            <p>No applications found</p>
          ) : (
            filteredApplications.length > 0 && (
              <div className="card-content">
                {filteredApplications.map(app => (
                  <div key={app.applicationId} className="card-item">
                    <p><strong>Application ID:</strong> {app.applicationId}</p>
                    <p><strong>Name:</strong> {app.name}</p>
                    <p><strong>Short Name:</strong> {app.shortName}</p>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
