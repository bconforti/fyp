import React, { useState } from 'react';
import './page3.css';
import Homepage from '../homepage/Homepage';
import Page4 from '../page4/Page4';
import Page5 from '../page5/Page5';

function Page3({currentSprint}) {
  const [currentPage, setCurrentPage] = useState('page3');
  const [emotion, setEmotion] = useState([]);

  const handleButtonClick = (e, btnName) => {
    e.preventDefault();
    setEmotion(btnName);
    console.log("Button clicked:", btnName);
  }


  const handleSubmit = (e) => {
    e.preventDefault();
      fetch('http://localhost:4000/api/emotions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({emote: emotion, sprint_id: currentSprint.sprint_num}),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log('Emotion submitted successfully:');
          console.log({emote: emotion, sprint_id: currentSprint.sprint_num});
        })
        .catch((error) => {
          console.error('Error submitting emotion:', error);
    });
  }

  

  const handleNavigate = () => {
    setCurrentPage(currentPage === 'page3' ? 'page4' : 'page3');
  };

  const handleExit = () => {
    setCurrentPage(currentPage === 'page3' ? 'Homepage' : 'page3');
  };

  return (
    <div>
      {currentPage === 'page3' && (
        <form className="form3">
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
            <button className="b1" onClick={(e) => handleButtonClick(e, "b1")}>
              😆
            </button>
            <button className="b2" onClick={(e) => handleButtonClick(e, "b2")}>
              😅
            </button>
            <button className="b3" onClick={(e) => handleButtonClick(e, "b3")}>
              😶
            </button>
            <button className="b4" onClick={(e) => handleButtonClick(e, "b4")}>
              😓
            </button>
            <button className="b5" onClick={(e) => handleButtonClick(e, "b5")}>
              😡
            </button>
          </div>


          <button 
          className="submit3Button" 
          onClick={handleSubmit}
          > Submit </button>

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
          <Page4 currentSprint={currentSprint}/>
        </div>
      )}

      {currentPage === 'Homepage' && (
        <div>
          <Homepage currentSprint={currentSprint}/>
        </div>
      )}
      
      
    </div>
  );
}

export default Page3;