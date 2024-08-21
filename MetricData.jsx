import React, { useEffect, useState } from 'react';
import './ApplicationDetail.scss';

const ApplicationDetail = ({ applications }) => {
  const [metricsData, setMetricsData] = useState([]);

  useEffect(() => {
    const fetchMetricsData = async () => {
      try {
        const response = await fetch('/metrics-endpoint'); // Replace with actual metrics endpoint
        const data = await response.json();
        setMetricsData(data);
      } catch (error) {
        console.error('Error fetching metrics data:', error);
      }
    };

    fetchMetricsData();
  }, []);

  const renderMetricsTable = (metrics) => {
    const doraMetrics = metrics.filter(metric => metric.Dimension === "DORA");
    const agileMetrics = metrics.filter(metric => metric.Dimension === "AGILE");

    return (
      <div className="metrics-table">
        <h3>Metrics</h3>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Metric Type</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {doraMetrics.map((metric, index) => (
              <tr key={index}>
                <td>{metric["MetricDate#MetricType"].split('#')[0]}</td>
                <td>{metric["MetricDate#MetricType"].split('#')[1]}</td>
                <td>{metric.ActualDeployFrequency || metric.ActualFailureRate || metric.ActualRecoverTime || 'N/A'}</td>
              </tr>
            ))}
            {agileMetrics.map((metric, index) => (
              <tr key={index}>
                <td>{metric["MetricDate#MetricType"].split('#')[0]}</td>
                <td>{metric["MetricDate#MetricType"].split('#')[1]}</td>
                <td>{metric.SayDoIssue || metric.SayDoStory || metric.ChurnIssue || metric.ChurStory || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="application-detail">
      <div className="card-container">
        {applications.map((app) => (
          <div key={app.applicationId} className="card">
            <img src={app.photoUrl} alt={`${app.name} photo`} />
            <div className="card-content">
              <h3>{app.name}</h3>
              <p>{app.shortName}</p>
              {app.applicationRoles
                .filter(role => role.roleType === 'CBT(a)')
                .map(role => (
                  <p key={role.ownerSID}>Owner: {role.ownerSID}</p>
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* Render Metrics Data Below Application Cards */}
      {metricsData.length > 0 && renderMetricsTable(metricsData)}
    </div>
  );
};

export default ApplicationDetail;
