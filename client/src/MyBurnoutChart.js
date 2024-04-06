import React from "react";
import { Line } from "react-chartjs-2";

const MyBurnoutChart = ({ doneIssues, plannedIssues, currentIssues }) => {
  // Combine data for the chart
  const prepareChartData = (issues) => {
    const dateCountMap = {};

    issues.forEach((issue) => {
      const resolutionDate = issue.fields.resolutiondate;
      // Assuming resolution date is in a valid date format, adjust accordingly
      const dateKey = resolutionDate.substring(0, 10);

      if (dateCountMap[dateKey]) {
        dateCountMap[dateKey]++;
      } else {
        dateCountMap[dateKey] = 1;
      }
    });

    const chartData = {
      labels: Object.keys(dateCountMap),
      datasets: [
        {
          label: "Issues",
          borderColor: "rgba(75,192,192,1)",
          data: Object.values(dateCountMap),
        },
      ],
    };

    return chartData;
  };

  const doneChartData = prepareChartData(doneIssues);
  const plannedChartData = prepareChartData(plannedIssues);
  const currentChartData = prepareChartData(currentIssues);

  const options = {
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day', // Adjust time unit as needed
        },
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Number of Issues',
        },
      },
    },
  };

  return (
    <div className="chart-container">
      <Line data={doneChartData} options={options} />
      {/* Add more lines for planned and current issues if needed */}
    </div>
  );
};

export default MyBurnoutChart;
