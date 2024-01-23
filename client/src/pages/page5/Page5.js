// Page5.js
import React, { useEffect, useState } from 'react';
import './page5.css';
import MyBarChart from '../../MyBarChart';
import MyPieChart from '../../MyPieChart';
import Homepage from '../homepage/Homepage';
import Page4 from '../page4/Page4';

function Page5() {
  const [scores, setScores] = useState([]);
  const [emotions, setEmotions] = useState([]);
  const [currentPage, setCurrentPage] = useState('page5');

  useEffect(() => {
    // Fetch emotions data from your server
    fetch('http://localhost:4000/api/emotions')
      .then(response => response.json())
      .then(data => setEmotions(data))
      .catch(error => console.error('Error fetching emotions:', error));

    // Fetch scores data from your server
    fetch('http://localhost:4000/api/scores')
      .then(response => response.json())
      .then(data => setScores(data))
      .catch(error => console.error('Error fetching scores:', error));
  }, []);

  const handleNavigate = (page) => {
    setCurrentPage(page)
  }

  const handleExit = () => {
    setCurrentPage(currentPage === 'page5' ? 'Homepage' : 'page5');
  };
  return (
    <div>
        {currentPage === 'page5' && (
            <div className="container5">
            <h2 className="hello">Emotion Tracking</h2>
            <div className="barContainer">
                <MyBarChart fetchData={() => fetch('http://localhost:4000/api/scores').then(response => response.json())} />
            </div>

            <div className="chartContainer">
                {/* Use MyPieChart for emotion tracking */}
                <MyPieChart fetchData={() => fetch('http://localhost:4000/api/emotions').then(response => response.json())} />
            </div>

            <button
                className='backButton4'
                onClick={() => handleNavigate('page4')}>
                    Go back
                 </button>

            <button
            className="exitButton5"
            onClick={handleExit}>
            {currentPage === 'page5' ? 'x' : ''}
            </button>
            </div>
        )}

        {currentPage === 'page4' && (
                    <div>
                    <Page4 />
                    </div>
                )}

        {currentPage === 'Homepage' && (
            <div>
            <Homepage />
            </div>
        )}
    </div>
  );
}

export default Page5;