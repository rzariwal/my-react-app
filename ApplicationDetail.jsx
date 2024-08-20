import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './_ApplicationDetail.scss'; // Import your styles if needed

const ApplicationDetail = () => {
  const { appId } = useParams();
  const [applicationDetails, setApplicationDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplicationDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/application/${appId}`); // Update with your API endpoint
        if (!response.ok) {
          throw new Error('Failed to fetch application details');
        }
        const data = await response.json();
        setApplicationDetails(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicationDetails();
  }, [appId]);

  return (
    <div className="container">
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error">Error: {error}</p>
      ) : (
        applicationDetails && (
          <div className="detail-card">
      
