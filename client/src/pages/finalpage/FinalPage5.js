import React, { useEffect, useState } from "react";
import Draggable from "react-draggable";
import './whiteboard.css';
import Homepage from "../homepage/Homepage";
import FinalPage3 from "./FinalPage3";


function FinalPage5({ currentSprint, selectedSuggestion, selectedSuggestionId }) {
    const [postIts, setPostIts] = useState([]);
    const [suggestionAnswers, setSuggestionAnswers] = useState([]);
    const [currentPage, setCurrentPage] = useState('finalpage5')

    const handleNavigate = (page) => {
        setCurrentPage(page);
    }

    useEffect(() => {
        console.log("selectedSuggestionId:", selectedSuggestionId);
        fetch(`http://localhost:4000/api/suggestionanswers/${selectedSuggestionId}`)
        .then(response => response.json())
        .then(data => {
            console.log("Data:", data)
            setSuggestionAnswers(data);
            console.log("selectedSuggestionId:", selectedSuggestionId);
            console.log("answers" , suggestionAnswers);
        })
        .catch(error => console.error('Error fetching suggestion answers:', error));
    }, [selectedSuggestionId]);

    const addPostIt = () => {
        const newPostIts = [...postIts];
        newPostIts.push("");
        setPostIts(newPostIts);
    };

    const handleTextChange = (index, text) => {
        const newPostIts = [...postIts];
        newPostIts[index] = text;
        setPostIts(newPostIts); 
    };

    const addSuggestionAnswer = (e, text) => {
        e.preventDefault();
        fetch('http://localhost:4000/api/suggestionanswers', {
            method: 'POST', 
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ 
                answer: text,
                topsuggestion: selectedSuggestionId
            })
        })
        .then((response) => {
            if(!response.ok) {
                throw new Error('HTTP error! Status: ${response.status}');
            }
            return response.json();
        })
        .then((data) => console.log(data))
        .catch((error) => console.error('Error submitting suggestion answer:', error))
        
    };

    const handleDelete = (idtodelete) => {
        fetch(`http://localhost:4000/api/suggestionanswers/${selectedSuggestionId}`, {
          method: 'DELETE',
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
          })
          .then((data) => {
            setSuggestionAnswers((prevSuggestionAnswers) =>
                prevSuggestionAnswers.filter((ans) => ans.id !== idtodelete)
            );
            console.log(data); 
        
          })
          .catch((error) => console.error('Error deleting suggestion:', error));
      };
    

    return (
        <div>
            {currentPage === 'finalpage5' && (
                <div className="finalWhiteContainer">
                <h1 className="finalWhiteText"> What steps can we take in order to <br/> '<i> {selectedSuggestion} </i>' ? </h1>
                {suggestionAnswers.map((answer, index) => (
                    <Draggable key={index}>
                    <div className="postItContainer">
                        <button className="deleteAnswerButton" 
                        onClick={() => handleDelete(answer.id)}> x </button>
                        <textarea
                            value={answer.answer}
                            className="postItTextarea"
                            readOnly
                        />
                    </div>
                    </Draggable>
                ))}
                {postIts.map((text, index) => (
                    <Draggable key={index}>
                        <div className="postItContainer">
                            <textarea
                                value={text}
                                onChange={(e) => handleTextChange(index, e.target.value)}
                                className="postItTextarea"
                                placeholder="Write something ..."
                            />
                            <button onClick={(e) => addSuggestionAnswer(e, text)} className="postItButton">Save</button>
                        </div>
                    </Draggable>
                ))}
                <button onClick={() => handleNavigate('homepage')} className="exitWhiteboardButton"> x </button>

                <button onClick={addPostIt} className="addPostItButton"> + </button>

                <button onClick={() => handleNavigate('finalpage3')}className="whiteboardBackButton"> Go back </button>

                <button className="infoButtonWhiteboard">
                i
                <div className="infoPopupWhiteboard">
                Press the + button to begin your discussion. <br />
                And press the x button on the suggestion in order to delete it.
                </div>
          </button>
            </div>
            )}

            {currentPage === 'finalpage3' && (
                <FinalPage3 currentSprint={currentSprint} />
            )}

            {currentPage === 'homepage' && (
                <Homepage currentSprint={currentSprint} />
            )}
            
        </div>

    );
}

export default FinalPage5;
