import React, { useEffect, useState } from "react";
import './finalpage.css';
import Homepage from "../Homepage";
import FinalPage3 from "./FinalPage2";

function FinalPage4(currentSprint) {
    const [topSuggestions, setTopSuggestions] = useState(null);
    const [currentPage, setCurrentPage] = useState('finalpage4')

    const handleNavigate = (page) => {
        setCurrentPage(page);
    }

    useEffect(() => {
        fetch('http://localhost:4000/api/top_suggestions')
        .then(response => response.json())
        .then(data => {
        setTopSuggestions(data.map(suggestionObj => suggestionObj.suggestion));
        console.log('Top Suggestions:', data.map(suggestionObj => suggestionObj.suggestion));
        })
        .catch(error => console.error('Error fetching suggestions:', error));
    }, []);

    return(
        <div>
            {currentPage === 'finalpage4' && (
                <div className = "finalContainer">
                    <h1 className="finalh1"> Close the stage</h1>
                    <button 
                    className="finalExitButton"
                    onClick={() => handleNavigate('homepage')}> x </button>

                    <div className="finalView">
                        <h2> Here is what you think you should do for the next sprint... </h2>
                        <ol className="c4">
                            {topSuggestions && topSuggestions.map((suggestion, index) => (
                                <li key={index}>{suggestion} </li>
                            ))}
                        </ol>
                    </div>

                    <button
                    className="finalLeft"
                    onClick={() => handleNavigate('finalpage3')}>
                        ⬅️
                    </button>


                </div>
            )}

            {currentPage === 'homepage' && (
                <Homepage currentSprint={currentSprint}/>
            )}

            {currentPage === 'finalpage3' && (
                <FinalPage3 currentSprint={currentSprint}/>
            )}
        </div>
    )
}

export default FinalPage4;