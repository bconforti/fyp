import React, { useEffect, useState } from "react";
import axios from 'axios';
import Page9c from "./Page9c";
import './page9d.css';
import Homepage from "../homepage/Homepage";

function Page9d({selectedBoard, jiraInstance, accessToken, currentSprint, selectedProjectKey, boards}) {
  const [currentPage, setCurrentPage] = useState('page9d');
  const [suggestions, setSuggestions] = useState(null);

  useEffect(() => {
    console.log("final key:", selectedProjectKey);
    console.log("selectedBoard:", selectedBoard);
    fetch('http://localhost:4000/api/nextsteps')
    .then(response => response.json())
    .then(data => {
      console.log("Data:", suggestions);
      setSuggestions(data);
    })
    .catch(error => console.error('Error fetching suggestions:', error));
}, [selectedBoard]);


  const addIssue = (suggestion) => {
    axios.post(`/api/jira/addIssue`, {
      instance: jiraInstance,
      suggestion: suggestion,
      projectKey: selectedProjectKey
    })
    .then(response => {
      console.log("Issue added successfully", response.data);
    })
    .catch(error => {
      console.error("Error adding issue", error);
    }) 
  }

  const handleNavigate = (page) => {
    setCurrentPage(page);
  }


  return (
    <div>
      {currentPage === 'page9d' && (
        <div className="container9d">
          <h1 className="header9d"> Gather Data </h1>
          <div className="suggBoxes9">
            {suggestions && suggestions.map((suggestion, index) => (
                <div key={index} className="suggBox9">
                    {suggestion.suggestion}
                    <button className="addIssueButton"
                    onClick={() => addIssue(suggestion.suggestion)}> + 
                      <div className="addIssuePopup"> Export to Jira </div>
                    </button> 
                 
                </div>
            ))}
        
          </div>
          <button
            className="backButton9d"
            onClick={() => handleNavigate('page9c')}>
            Go back
          </button>
          <button
            className="exitButton9"
            onClick={() => handleNavigate('homepage')}>
            x
          </button>

          <button
            className="infoButton9d"
          >
            i
            <div className="infoPopup9d">
              Press one of the + buttons to add the your teams suggestions to your Jira board. <br />
            </div>
          </button>
        </div>
      )}
      {currentPage === 'page9c' && (
        <Page9c 
        jiraInstance={jiraInstance} 
        accessToken={accessToken} 
        selectedBoard={selectedBoard} 
        selectedProjectKey={selectedProjectKey} 
        currentSprint={currentSprint}
        boards={boards} 
        />
      )}
      {currentPage === 'homepage' && (
        <Homepage currentSprint={currentSprint}/>
      )}
    </div>
  )
}

export default Page9d;
