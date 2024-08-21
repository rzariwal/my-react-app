import React, { useEffect, useState } from 'react';
import './ApplicationDetail.scss';

const ApplicationDetail = ({ sealId, metricDate }) => {
    const [metricsData, setMetricsData] = useState([]);
    const [scoreData, setScoreData] = useState([]);

    useEffect(() => {
        const fetchMetricsData = async () => {
            try {
                const metricsResponse = await fetch(`/api/metrics?sealId=${sealId}&metricDate=${metricDate}`);
                const metricsJson = await metricsResponse.json();
                setMetricsData(metricsJson);

                const scoreResponse = await fetch(`/api/scores?sealId=${sealId}&metricDate=${metricDate}`);
                const scoreJson = await scoreResponse.json();
                setScoreData(scoreJson);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchMetricsData();
    }, [sealId, metricDate]);

    const findScoreByDimension = (dimension) => {
        const scoreObj = scoreData.find(score => score.Dimension === dimension);
        return scoreObj ? scoreObj.Score : 'N/A';
    };

    const renderMetricsTable = (metrics) => {
        const mergedMetrics = [];

        metrics.forEach(metric => {
            Object.keys(metric).forEach(key => {
                if (key !== 'Dimension' && key !== 'MetricDate#MetricType' && key !== 'SealId') {
                    mergedMetrics.push({
                        dimension: metric.Dimension,
                        metricType: metric['MetricDate#MetricType'].split('#')[1],
                        metric: key,
                        value: metric[key],
                        score: findScoreByDimension(metric.Dimension)
                    });
                }
            });
        });

        return (
            <table>
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
                    {mergedMetrics.map((item, index) => (
                        <tr key={index}>
                            <td>{index === 0 || mergedMetrics[index - 1].dimension !== item.dimension ? item.dimension : ''}</td>
                            <td>{index === 0 || mergedMetrics[index - 1].metricType !== item.metricType ? item.metricType : ''}</td>
                            <td>{item.metric}</td>
                            <td>{item.value}</td>
                            <td>{item.score}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    return (
        <div className="application-detail">
            <h3>Application Metrics</h3>
            {renderMetricsTable(metricsData)}
        </div>
    );
};

export default ApplicationDetail;
