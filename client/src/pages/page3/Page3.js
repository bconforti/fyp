import React, { useState } from 'react';
import './page3.css';
import Homepage from '../homepage/Homepage';
import Page4 from '../page4/Page4';
import Page5 from '../page5/Page5';

function Page3() {
  const [counts, setCounts] = useState({
    b1: 0,
    b2: 0,
    b3: 0,
    b4: 0,
    b5: 0,
  });
  
  const [currentPage, setCurrentPage] = useState('page3');
  const [pressedButtons, setPressedButtons] = useState([]);



  const handleButtonClick = (btnName) => {
      console.log("Button clicked:", btnName);

      setPressedButtons((prevButtons) => [...prevButtons, btnName]);

      // Submit the selected emotion to the server
      fetch('http://localhost:4000/api/emotions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emote: btnName,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log('Emotion submitted successfully:', data);
        })
        .catch((error) => {
          console.error('Error submitting emotion:', error);
        });
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleNavigate = () => {
    setCurrentPage(currentPage === 'page3' ? 'page4' : 'page3');
  };

  const handleExit = () => {
    setCurrentPage(currentPage === 'page3' ? 'Homepage' : 'page3');
  };

  return (
    <div>
      {currentPage === 'page3' && (
        <form className="form3" onSubmit={handleSubmit}>
          <h1> Emotion Tracking</h1>
          
          <h2> How are you feeling at this stage of development?</h2>
          <button 
          className = "infoButton">
            i
            <div className="infoPopup">   
                😆: Excellent< br/>
                😅: Good< br/>
                😶: Neutral< br/>
                😓: Not So Good< br/>
                😡: Poor
            </div>
          </button>
          <div>
            <button className="b1" onClick={() => handleButtonClick("b1")}>
              😆
            </button>
            <button className="b2" onClick={() => handleButtonClick("b2")}>
              😅
            </button>
            <button className="b3" onClick={() => handleButtonClick("b3")}>
              😶
            </button>
            <button className="b4" onClick={() => handleButtonClick("b4")}>
              😓
            </button>
            <button className="b5" onClick={() => handleButtonClick("b5")}>
              😡
            </button>
          </div>

          <button
            className='nextButton'
            onClick={() => {
              handleNavigate();
            }}
          >
            {currentPage === 'page3' ? 'Next' : 'Submit'}
          </button>

          <button
            className="exitButton3"
            onClick={handleExit}
          >
            {currentPage === 'page3' ? 'x' : ''}
          </button>
          
        </form>
      )}

      {currentPage === 'page4' && (
        <div>
          <Page4/>
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

export default Page3;