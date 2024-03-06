import React, { useEffect, useState } from "react";
import './finalpage.css';
import Homepage from "../Homepage";
import FinalPage2 from "./FinalPage2";


function FinalPage1(currentSprint) {
    const [topScore, setTopScore] = useState(null);
    const [currentPage, setCurrentPage] = useState('finalpage1')

    const handleNavigate = (page) => {
        setCurrentPage(page);
    }

    useEffect(() => {
        fetch('http://localhost:4000/api/top_score')
          .then(response => response.json())
          .then(data => {
            setTopScore(data.score);
            console.log('Top Score:', data.score);
          })
          .catch(error => console.error('Error fetching scores:', error));

    }, []);

    return(
        <div>
            {currentPage === 'finalpage1' && (
                <div className = "finalContainer">
                    <h1 className="finalh1"> Close the stage</h1>
                    <button 
                    className="finalExitButton"
                    onClick={() => handleNavigate('homepage')}> x </button>

                    <div className="finalView">
                        <h2> The team rated this sprint a... </h2>
                        <body className="c1"> {topScore} </body>
                    </div>

                    <button
                    className="finalRight"
                    onClick={() => handleNavigate('finalpage2')}> 
                        ➡️ 
                    </button>

                </div>
            )}

            {currentPage === 'homepage' && (
                <Homepage currentSprint={currentSprint}/>
            )}
            {currentPage === 'finalpage2' && (
                <FinalPage2 currentSprint={currentSprint}/>
            )}

        </div>
    )
}

export default FinalPage1;