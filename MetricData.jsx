const renderMetricsTable = (metricsData) => {
    // Filter metrics by DORA and Agile dimensions
    const doraMetrics = metricsData.filter(metric => metric.Dimension === "DORA");
    const agileMetrics = metricsData.filter(metric => metric.Dimension === "AGILE");

    // Generate table rows
    const renderRows = (metrics) => {
        return metrics.map(metric => (
            <tr key={`${metric['MetricDate#MetricType']}-${metric.Metric}`}>
                <td>{metric.Dimension}</td>
                <td>{metric['MetricDate#MetricType'].split('#')[1]}</td>
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
