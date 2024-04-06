import React, { useEffect, useState } from "react";
import './finalpage.css';
import Homepage from "../homepage/Homepage";
import FinalPage2 from "./FinalPage2";
import FinalPage5 from "./FinalPage5";


/* Shows the top five suggestions for the next sprint */
function FinalPage3({currentSprint}) {
    const [topSuggestions, setTopSuggestions] = useState(null);
    const [selectedSuggestion, setSelectedSuggestion] = useState('');
    const [currentPage, setCurrentPage] = useState('finalpage3');
    const [jiraBoardUrl, setJiraBoardUrl] = useState(null);


    useEffect(() => {
        fetch('http://localhost:4000/api/top_suggestions')
        .then(response => response.json())
        .then(data => {
            setTopSuggestions(data);
            console.log(topSuggestions);
        })
        .catch(error => console.error('Error fetching suggestions:', error));

    }, []);

    const handleNavigate = (page) => {
        setCurrentPage(page);
    }
    
    const handleButtonClick = (suggestionObj) => {
        setSelectedSuggestion(suggestionObj);
        console.log("selected suggestion", suggestionObj);
        handleNavigate('finalpage5');
    }

    const fetchJiraBoardUrl = () => {
        // Fetch Jira board URL from your backend
        fetch('http://localhost:4000/api/jira_board_url')
        .then(response => response.json())
        .then(data => {
            if (data.jiraBoardUrl) {
                setJiraBoardUrl(data.jiraBoardUrl);
            } else {
                console.error("Jira board URL not available");
            }
        })
        .catch(error => console.error('Error fetching Jira board URL:', error));
    };
    
    
    /* Button to send you back to Jira */
    const handleGoToJira = () => {
        //fetchJiraBoardUrl();
        const URL = `https://bcconforti.atlassian.net/jira/projects`;
        window.location.href = URL;
    }; 


    return(
        <div>
            {currentPage === 'finalpage3' && (
                <div className = "finalContainer">
                    <h1 className="finalh1"> Close the stage</h1>
                    <button 
                    className="finalExitButton"
                    onClick={() => handleNavigate('homepage')}> x </button>

                    <div>
                        <h2> Here is what you thought should change next sprint... </h2>
                        <div className="suggBoxes">
                            {topSuggestions && topSuggestions.map((suggestionObj, index) => (
                                <button key={index} className="suggBox" onClick={() => handleButtonClick(suggestionObj)}>
                                    {suggestionObj.suggestion}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                    className="finalLeft"
                    onClick={() => handleNavigate('finalpage2')}
                    > &#8678; 
                    </button>


                    <button 
                    className="finalJiraButton"
                    onClick={() => handleGoToJira()}
                    > Continue with sprint </button>

                    <button
                    className="finalInfoButton">
                        i
                    <div className="finalInfoPopup">
                    Below are the standout suggestions from this sprint. <br />
                    Click on any of them to engage in a discussion to explore potential actions for the next sprint. <br />
                    </div>
                    </button>


                </div>
            )}
            {currentPage === 'homepage' && (
                <Homepage currentSprint={currentSprint}/>
            )}

            {currentPage === 'finalpage2' && (
                <FinalPage2 currentSprint={currentSprint}/>
            )}

            {currentPage === 'finalpage5' && (
                <FinalPage5 currentSprint={currentSprint} 
                selectedSuggestion={selectedSuggestion.suggestion}
                selectedSuggestionId={selectedSuggestion.id}/>
            )}
        </div>
    )
}

export default FinalPage3;
