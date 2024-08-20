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
        const response = await fetch('/applications');
        if (!response.ok) {
          throw new Error('Failed to fetch applications');
        }
        const data = await response.json();
        setAllApplications(data.applications);
        setFilteredApplications(data.applications);
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
      const filtered = allApplications.filter(app => String(app.applicationId).startsWith(query));
      setFilteredApplications(filtered);
    } else {
      setFilteredApplications(allApplications);
    }
  };

  const handleCardClick = (appId) => {
    navigate(`/application/${appId}`);
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
          disabled={loading || filteredApplications.length > 1}
        />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error">Error: {error}</p>
      ) : (
        filteredApplications.length === 1 && (
          <div className="card" onClick={() => handleCardClick(filteredApplications[0].applicationId)}>
            <h2>Applications</h2>
            {filteredApplications.map((app) => (
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
  );
};

export default SearchPage;
