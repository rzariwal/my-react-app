import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './_ApplicationDetail.scss';

const ApplicationDetail = () => {
  const { applicationId } = useParams(); // Get applicationId from URL
  const [applicationDetails, setApplicationDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplicationDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/applications/${applicationId}`);
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
  }, [applicationId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="application-detail__error">Error: {error}</p>;
  }

  if (!applicationDetails) {
    return <p>No details available</p>;
  }

  // Extract necessary details
  const { name, shortName, applicationRoles } = applicationDetails;

  // Find the application owner in applicationRoles
  const owner = applicationRoles?.find(role => role.roleType === 'owner')?.workersid || 'N/A';

  return (
    <div className="application-detail">
      <h1>Application Details</h1>
      <div className="application-detail__cards">
        <div className="application-detail__card">
          <h2>Name</h2>
          <p>{name}</p>
        </div>
        <div className="application-detail__card">
          <h2>Short Name</h2>
          <p>{shortName}</p>
        </div>
        <div className="application-detail__card">
          <h2>Owner</h2>
          <p>{owner}</p>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetail;
