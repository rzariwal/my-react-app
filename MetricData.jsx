const renderMetricsTable = (metricsData) => {
    const getMetricValue = (metric, key) => {
        return metric[key] !== undefined ? metric[key] : '';
    };

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

    const mergeCells = (metrics) => {
        let mergedRows = [];
        let previousDimension = null;
        let previousMetricType = null;
        let dimensionRowSpan = 0;
        let metricTypeRowSpan = 0;

        metrics.forEach((metric, index) => {
            const isNewDimension = metric.Dimension !== previousDimension;
            const isNewMetricType = metric.MetricType !== previousMetricType;

            if (isNewDimension) {
                if (dimensionRowSpan > 0) {
                    mergedRows[mergedRows.length - dimensionRowSpan].rowSpan = dimensionRowSpan;
                }
                previousDimension = metric.Dimension;
                dimensionRowSpan = 1;
            } else {
                dimensionRowSpan++;
            }

            if (isNewMetricType) {
                if (metricTypeRowSpan > 0) {
                    mergedRows[mergedRows.length - metricTypeRowSpan].metricTypeRowSpan = metricTypeRowSpan;
                }
                previousMetricType = metric.MetricType;
                metricTypeRowSpan = 1;
            } else {
                metricTypeRowSpan++;
            }

            mergedRows.push({
                ...metric,
                rowSpan: 1,
                metricTypeRowSpan: 1,
                isFirstDimension: isNewDimension,
                isFirstMetricType: isNewMetricType,
            });
        });

        if (dimensionRowSpan > 0) {
            mergedRows[mergedRows.length - dimensionRowSpan].rowSpan = dimensionRowSpan;
        }

        if (metricTypeRowSpan > 0) {
            mergedRows[mergedRows.length - metricTypeRowSpan].metricTypeRowSpan = metricTypeRowSpan;
        }

        return mergedRows;
    };

    const renderRows = (metrics) => {
        const mergedMetrics = mergeCells(metrics);

        return mergedMetrics.map((metric, index) => (
            <tr key={index}>
                {metric.isFirstDimension && (
                    <td rowSpan={metric.rowSpan}>{metric.Dimension}</td>
                )}
                {metric.isFirstMetricType && (
                    <td rowSpan={metric.metricTypeRowSpan}>{metric.MetricType}</td>
                )}
                <td>{metric.Metric}</td>
                <td>{metric.Value}</td>
            </tr>
        ));
    };

    return (
        <div className="application-detail">
            <h2 className="metrics-heading">ApplicationMetrics</h2>
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
        </div>
    );
};

// Usage in your component
return (
    <div className="application-detail">
        {renderMetricsTable(metricsData)}
    </div>
);
