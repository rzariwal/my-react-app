const renderMetricsTable = (metricsData) => {
    const getMetricValue = (metric, key) => {
        return metric[key] !== undefined ? metric[key] : '';
    };

    // Extract all possible metric types to ensure they are displayed correctly
    const extractMetricRows = (metrics) => {
        return metrics.flatMap(metric => {
            const metricRows = [];
            for (const [key, value] of Object.entries(metric)) {
                if (key !== 'Dimension' && key !== 'MetricDate#MetricType' && key !== 'SealId') {
                    metricRows.push({
                        Dimension: metric.Dimension,
                        MetricType: metric['MetricDate#MetricType'].split('#')[1],
                        Metric: key,
                        Value: value
                    });
                }
            }
            return metricRows;
        });
    };

    const doraMetrics = extractMetricRows(metricsData.filter(metric => metric.Dimension === "DORA"));
    const agileMetrics = extractMetricRows(metricsData.filter(metric => metric.Dimension === "AGILE"));

    const renderRows = (metrics) => {
        return metrics.map((metric, index) => (
            <tr key={index}>
                <td>{metric.Dimension}</td>
                <td>{metric.MetricType}</td>
                <td>{metric.Metric}</td>
                <td>{metric.Value}</td>
            </tr>
        ));
    };

    return (
        <table className="metrics-table">
            <thead>
                <tr>
                    <th>Dimension</th>
                    <th>MetricType</th>
                    <th>Metric</th>
                    <th>Value</th>
                </tr>
            </thead>
            <tbody>
                {renderRows(doraMetrics)}
                {renderRows(agileMetrics)}
            </tbody>
        </table>
    );
};

// Usage in your component
return (
    <div className="application-detail">
        {renderMetricsTable(metricsData)}
    </div>
);
