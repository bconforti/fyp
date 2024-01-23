// MyPieChart.js
import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

/* Pie chart for emotion tracking*/

const MyPieChart = ({ fetchData }) => {
  const chartCanvasRef = useRef(null);

  useEffect(() => {
    const fetchAndRenderData = async () => {
      try {

        const pieChartData = await fetchData();

        if (!chartCanvasRef.current || !pieChartData) return;

        // Destroy existing chart if it exists
        if (chartCanvasRef.current.chart) {
          chartCanvasRef.current.chart.destroy();
        }

        const chartContext = chartCanvasRef.current.getContext('2d');
        
        // Extract emotion and count data from the fetched data
        const counts = pieChartData.map(emotion => emotion.count);

        // Emoji label for segment hover
        const emojiLabels = [
          '😶',
          '😅',
          '😆',
          '😓',
          '😡',
        ];

        chartCanvasRef.current.chart = new Chart(chartContext, {
          type: 'pie',
          data: {
            datasets: [
              {
                data: counts,
                backgroundColor: [
                    'rgba(102, 153, 255, 0.3)', 
                    'rgba(51, 150, 120, 0.3)', 
                    'rgba(107, 200, 89, 0.3)', 
                    'rgba(255, 99, 71, 0.3)',   
                    'rgba(178, 34, 34, 0.3)', 
                ],
                borderColor: [
                    'rgba(102, 153, 255, 0.3)',
                    'rgba(70, 130, 180, 0.5)',     
                    'rgba(77, 175, 74, 0.5)', 
                    'rgba(255, 69, 0, 0.5)',     
                    'rgba(139, 0, 0, 0.5)',      
                ],
                borderWidth: 1,
              },
            ],
          },
          options: {
            plugins: {
              tooltip: {
                mode: 'index',
                intersect: false,
                callbacks: {
                  label: (context) => emojiLabels[context.dataIndex],
                },
                backgroundColor: 'rgba(0, 0, 0, 0.3)', // Change the background color
                bodyFont: {
                  size: 30,
                }
              },
            },
          },
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // Call the fetchAndRenderData function when the component mounts or when fetchData changes
    fetchAndRenderData();
  }, [fetchData]);

  // Return the canvas element, which will be used to render the chart
  return <canvas ref={chartCanvasRef} />;
};

export default MyPieChart;
