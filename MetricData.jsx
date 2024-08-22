import React, { useState, useEffect } from 'react';
import './ApplicationDetail.scss';

const ApplicationDetail = ({ applicationId }) => {
  const [applicationDetails, setApplicationDetails] = useState({});
  const [photoUrls, setPhotoUrls] = useState({});
  const [metricsData, setMetricsData] = useState([]);
  const [scoresData, setScoresData] = useState([]);

  useEffect(() => {
    const fetchApplicationDetails = async () => {
      try {
        const response = await fetch(`/applications/${applicationId}`);
        const data = await response.json();
        setApplicationDetails(data);

        const ownerRoles = data.applicationRoles.filter(role => role.roleType === 'CBT(a)');
        const photos = await Promise.all(ownerRoles.map(async role => {
          const photoResponse = await fetch(`/api/photo/${role.ownerSID}`);
          const photoBlob = await photoResponse.blob();
          const photoUrl = URL.createObjectURL(photoBlob);
          return { [role.ownerSID]: photoUrl };
        }));

        setPhotoUrls(Object.assign({}, ...photos));
      } catch (error) {
        console.error('Error fetching application details:', error);
      }
    };

    const fetchMetricsData = async () => {
      try {
        const response = await fetch(`/api/metrics?sealId=${applicationId}&metricDate=2024-08-21`);
        const metrics = await response.json();
        setMetricsData(metrics);
      } catch (error) {
        console.error('Error fetching metrics data:', error);
      }
    };

    const fetchScoresData = async () => {
      try {
        const response = await fetch(`/api/scores?sealId=${applicationId}`);
        const scores = await response.json();
        setScoresData(scores);
      } catch (error) {
        console.error('Error fetching scores data:', error);
      }
    };

    fetchApplicationDetails();
    fetchMetricsData();
    fetchScoresData();
  }, [applicationId]);

  const renderMetricsTable = (metrics) => {
    const mergedMetrics = [];

    const addMetric = (dimension, metricType, metricKey, metricValue) => {
      const scoreData = scoresData.find(score => score.Dimension === dimension);
      const score = scoreData ? scoreData.Score : 'N/A';
      mergedMetrics.push({
        Dimension: dimension,
        MetricType: metricType,
        MetricKey: metricKey,
        MetricValue: metricValue,
        Score: score,
      });
    };

    metrics.forEach((metric) => {
      const dimension = metric.Dimension;
      const metricType = metric["MetricDate#MetricType"].split("#")[1];
      
      Object.keys(metric).forEach(key => {
        if (key !== 'Dimension' && key !== 'SealId' && key !== 'MetricDate#MetricType') {
          addMetric(dimension, metricType, key, metric[key]);
        }
      });
    });

    return (
      <table className="metrics-table">
        <thead>
          <tr>
            <th>Dimension</th>
            <th>MetricType</th>
            <th>Metric</th>
            <th>Value</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {mergedMetrics.map((metric, index) => (
            <tr key={index}>
              <td>{index === 0 || mergedMetrics[index - 1].Dimension !== metric.Dimension ? metric.Dimension : ''}</td>
              <td>{index === 0 || mergedMetrics[index - 1].MetricType !== metric.MetricType ? metric.MetricType : ''}</td>
              <td>{metric.MetricKey}</td>
              <td>{metric.MetricValue}</td>
              <td>{metric.Score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="application-detail">
      <h1>{applicationDetails.name} ({applicationDetails.shortName})</h1>
      <div className="roles-container">
        {applicationDetails.applicationRoles && applicationDetails.applicationRoles
          .filter(role => role.roleType === 'CBT(a)')
          .map(role => (
            <div key={role.ownerSID} className="role-card">
              <h2>Owner: {role.ownerSID}</h2>
              {photoUrls[role.ownerSID] && (
                <img src={photoUrls[role.ownerSID]} alt={`Owner ${role.ownerSID}`} />
              )}
            </div>
          ))}
      </div>
      <h2>Application Metrics</h2>
      {renderMetricsTable(metricsData)}
    </div>
  );
};

export default ApplicationDetail;