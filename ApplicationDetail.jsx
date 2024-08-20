import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './_ApplicationDetail.scss';

const ApplicationDetail = () => {
  const { applicationId } = useParams(); // Get applicationId from URL
  const [applicationDetails, setApplicationDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [photos, setPhotos] = useState({});

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

        // Fetch photos for each ownerSID
        const rolePhotos = {};
        for (const role of data.applicationRoles || []) {
          if (role.roleType === 'CBT(a)' && role.ownerSID) {
            const photoResponse = await fetch(`/photo/${role.ownerSID}`);
            const photoBlob = await photoResponse.blob();
            rolePhotos[role.ownerSID] = URL.createObjectURL(photoBlob);
          }
        }
        setPhotos(rolePhotos);
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

  // Filter roles to include only those with roleType 'CBT(a)'
  const filteredRoles = applicationRoles?.filter(role => role.roleType === 'CBT(a)');

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
          <h2>Roles</h2>
          {filteredRoles?.length > 0 ? (
            <ul>
              {filteredRoles.map((role, index) => (
                <li key={index}>
                  {photos[role.ownerSID] && (
                    <img
                      src={photos[role.ownerSID]}
                      alt={`Photo of ${role.ownerSID}`}
                      style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                    />
                  )}
                  <br />
                  <strong>Role Type:</strong> {role.roleType} <br />
                  <strong>Owner SID:</strong> {role.ownerSID || 'N/A'}
                </li>
              ))}
            </ul>
          ) : (
            <p>No 'CBT(a)' roles available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetail;
