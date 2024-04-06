import React, { useState, useEffect } from "react";
import './page4.css';
import Homepage from "../homepage/Homepage";
import Page3 from "../page3/Page3";
import Page5 from '../page5/Page5';

/* Emotion tracking page 2 - user rates their progress of the previous sprint */
function Page4({currentSprint}) {
    const [sliderValue, setSliderValue] = useState(0);
    const [scores, setScores] = useState([]);
    const [currentPage, setCurrentPage] = useState('page4')


    // User can move slider to select rating
    const handleSliderChange = (event) => {
        const value = event.target.value;
        setSliderValue(value);
        console.log(value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const score = parseInt(sliderValue, 10);
        setScores((prevScores) => [...prevScores, score]);
        setSliderValue(0);
        // console.log("Score", scores);
        // console.log("Score", sliderValue);

        fetch('http://localhost:4000/api/scores', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json',
            },
            body: JSON.stringify({score, sprint_id: currentSprint.sprint_num}),
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('HTTP error! Status: ${response.status}');
            }
            return response.json();
        })
        .then((data) => console.log(data))
        .catch((error) => console.error('Error submitting score:', error));
    }


    const handleNavigate = (page) => {
        setCurrentPage(page)
    }

    const handleExit = () => {
        setCurrentPage(currentPage === 'page4' ? 'Homepage' : 'page4');
      };

    return (
        <div>
            {currentPage === 'page4' && (
                <form className="form4">
                <h1 className="header4">Set the Stage</h1>
                <h2>How would you rate the progress over this sprint?</h2>
                <button className = "infoButton4">
                i
                <div className="infoPopup4">
                    Drag the slider below to indicate your rating of the progress made during this sprint. <br />
                    0: No progression/project is not going well. <br />
                    10: Project is moving at exceptional pace, everything 
                    is as expected.
                </div>
                </button>
                <span className="score0">0</span>
                    <input
                        className="slider"
                        type="range"
                        min="0"
                        max="10"
                        value={sliderValue}
                        onChange={handleSliderChange}
                    />
                <span className="score10">10</span>
                <button className="submit4Button" onClick={handleSubmit}>Submit</button>
                <button className="resultsButton" onClick={() => {handleNavigate('page5');}}> 
                See Results</button>

                <button
                className='backButton4'
                onClick={() => handleNavigate('page3')}>
                    Go back
                 </button>

                <button
                className="exitButton4"
                onClick={handleExit}>
                {currentPage === 'page4' ? 'x' : ''}
                </button>
            </form>
            )}

            {currentPage === 'page3' && (
                <div>
                    <Page3 currentSprint={currentSprint}/>
                </div>
            )}

            {currentPage === 'page5' && (
                <div>
                    <Page5 currentSprint={currentSprint}/>
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

export default Page4;