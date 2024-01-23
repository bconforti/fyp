// MyBarChart.js
import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const MyBarChart = ({ fetchData }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const fetchAndRenderData = async () => {
      try {
        const data = await fetchData();

        if (!chartRef.current || !data) return;

        // Destroy existing chart if it exists
        if (chartRef.current.chart) {
          chartRef.current.chart.destroy();
        }

        const ctx = chartRef.current.getContext('2d');
        const labels = data.map(score => score.score.toString());
        const counts = data.map(score => score.count);

        chartRef.current.chart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [
              {
                label: 'Score Counts',
                data: counts,
                backgroundColor: 'rgba(75,192,192,0.2)',
                borderColor: 'rgba(75,192,192,1)',
                borderWidth: 1,
              },
            ],
          },
          options: {
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Scores',
                },
              },
              y: {
                title: {
                  display: true,
                  text: 'Count',
                },
              },
            },
          },
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchAndRenderData();
  }, [fetchData]);

  return <canvas ref={chartRef} />;
};

export default MyBarChart;
