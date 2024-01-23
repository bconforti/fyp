import React, { useState, useEffect } from "react";
import Draggable from 'react-draggable';
import './page7.css';
import Homepage from "../homepage/Homepage";
import Page6 from "../page6/Page6";

function Page7({currentSprint}) {
  const [suggestions, setSuggestions] = useState([]);
  const [currentPage, setCurrentPage] = useState('page7');
  const [votes, setVotes] = useState({});

  useEffect(() => {
    fetch('http://localhost:4000/api/nextsteps')
      .then((response) => response.json())
      .then((data) => {
        setSuggestions(data);

        data.forEach((suggestion) => {
            const encodedSuggestion = encodeURIComponent(suggestion.suggestion);
            fetch(`http://localhost:4000/api/sugg_votes/${encodedSuggestion}`)
            .then((response) => response.json())
              .then((voteData) => {
                setVotes((prevVotes) => ({
                  ...prevVotes,
                  [`${suggestion.suggestion}`]: voteData.votes,
                }));
              })
              .catch((error) => console.error('Error fetching votes:', error));
          });
        })
      .catch((error) => console.error('Error fetching suggestions:', error));
  }, []);
  
  const handleButtonClick = (suggestion) => {
    const key = `${suggestion}`;
    setVotes((prevVotes) => ({
      ...prevVotes,
      [key]: (prevVotes[key] || 0) + 1,
    }));
  
    // Update votes in the backend
    const updatedVotes = votes[key] + 1;
  
    fetch('http://localhost:4000/api/sugg_votes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        suggestion,
        votes: updatedVotes,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => console.log(data))
      .catch((error) => console.error('Error updating votes:', error));
  };
  

  /* User can delete the suggestion (from screen AND database) */
  const handleDelete = (suggestion) => {
    fetch(`http://localhost:4000/api/nextsteps/${suggestion}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        // Update the state to remove the deleted suggestion
        setSuggestions((prevSuggestions) =>
          prevSuggestions.filter((sugg) => sugg.suggestion !== suggestion)
        );
        console.log(data); // Log the response from the server
        // Handle any further actions on success
      })
      .catch((error) => console.error('Error deleting suggestion:', error));
  };
  
  
  
  const handleNavigate = () => {
    setCurrentPage(currentPage === 'page7' ? 'page6': 'page7');
  }

  const handleExit = () => {
    setCurrentPage(currentPage === 'page7' ? 'Homepage': 'page7');
}

  return (
    <div>
        {currentPage === 'page7' && (
                <div className='container7'>
                <h1 className="h7"> Next steps </h1>

                {suggestions.map((suggestion) => (
                  <Draggable key={suggestion.suggestionId}>
                    <div className='suggestionBox'>
                      {suggestion.suggestion}

                    <button
                        className="voteButton7"
                    onClick={() => handleButtonClick(suggestion.suggestion)}> 
                    👍
                    </button>

                    <button
                        className="deleteButton7"
                    onClick={() => handleDelete(suggestion.suggestion)}> 
                    x
                    </button>


                        
                         <div className="votesCount7">
                        {`${votes[suggestion.suggestion] || 0}`}
                        </div>

                    </div>
                  </Draggable>
                ))}

                <button
                className="pageButton7"
                onClick={handleNavigate}>
                    {currentPage === 'page7' ? ' + Add suggestion': ''} 
                </button>


                <button
                    className="exitButton7"
                    onClick={handleExit}>
                        {currentPage === 'page7' ? 'x': ''}
                    </button>
              </div>

        )}
            {currentPage === 'page6' && (
                <div>
                    <Page6 currentSprint={currentSprint}/>
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

export default Page7;
