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

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = allApplications.filter(app => {
        const appIdStr = String(app.applicationId);
        return appIdStr.toLowerCase().startsWith(searchQuery.toLowerCase());
      });
      setFilteredApplications(filtered);
    } else {
      setFilteredApplications([]);
    }
  }, [searchQuery, allApplications]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCardClick = (appId) => {
    if (appId) {
      navigate(`/applications/${appId}`);
    }
  };

  return (
    <div className="search-page">
      <h1>Search Applications</h1>
      <div className="search-page__search-container">
        <FontAwesomeIcon icon={faSearch} style={{ marginRight: '8px', fontSize: '20px' }} />
        <input
          type="text"
          placeholder="Enter application ID to search"
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-page__search-input"
        />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="search-page__error">Error: {error}</p>
      ) : (
        <div
          className={`search-page__card ${filteredApplications.length === 1 ? 'search-page__card--clickable' : 'search-page__card--not-clickable'}`}
          onClick={() => filteredApplications.length === 1 && handleCardClick(filteredApplications[0].applicationId)}
        >
          {filteredApplications.length === 0 && searchQuery.trim() ? (
            <p>No applications found</p>
          ) : (
            filteredApplications.length > 0 && (
              <div className="search-page__card-content">
                {filteredApplications.map(app => (
                  <div key={app.applicationId} className="search-page__card-item">
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
