import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import './_SearchPage.scss'; // Import the SCSS file

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
        setFilteredApplications([]); // Start with an empty array
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
      const filtered = allApplications.filter(app => app.applicationId.startsWith(searchQuery));
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
        filteredApplications.length === 1 && (
          <div className="card" onClick={() => handleCardClick(filteredApplications[0].applicationId)}>
            <h2>Application</h2>
            <div className="card-item">
              <p><strong>Application ID:</strong> {filteredApplications[0].applicationId}</p>
              <p><strong>Name:</strong> {filteredApplications[0].name}</p>
              <p><strong>Short Name:</strong> {filteredApplications[0].shortName}</p>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default SearchPage;
