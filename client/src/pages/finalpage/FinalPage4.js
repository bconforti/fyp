import React, { useEffect, useState } from "react";
import Draggable from "react-draggable";
import './whiteboard.css';
import Homepage from "../homepage/Homepage";
import FinalPage2 from "./FinalPage2";


function FinalPage4({ currentSprint, selectedComment, selectedCommentId }) {
    const [postIts, setPostIts] = useState([]);
    const [commentAnswers, setCommentAnswers] = useState([]);
    const [currentPage, setCurrentPage] = useState('finalpage4')

    const handleNavigate = (page) => {
        setCurrentPage(page);
    }

    useEffect(() => {
        console.log("selectedCommentId:", selectedCommentId);
        fetch(`http://localhost:4000/api/commentanswers/${selectedCommentId}`)
        .then(response => response.json())
        .then(data => {
            console.log("Data:", data)
            setCommentAnswers(data);
            console.log("selectedCommentId:", selectedCommentId);
            console.log("answers" , commentAnswers);
        }) 
        .catch(error => console.error('Error fetching comment answers:', error));
    }, [selectedCommentId]);

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

    const addCommentAnswer = (e, text) => {
        e.preventDefault();
        fetch('http://localhost:4000/api/commentanswers', {
            method: 'POST', 
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ 
                answer: text,
                topcomment: selectedCommentId
            })
        })
        .then((response) => {
            if(!response.ok) {
                throw new Error('HTTP error! Status: ${response.status}');
            }
            return response.json();
        })
        .then((data) => console.log(data))
        .catch((error) => console.error('Error submitting comment answer:', error))
        
    };

    const handleDelete = (idtodelete) => {
        fetch(`http://localhost:4000/api/commentanswers/${selectedCommentId}`, {
          method: 'DELETE',
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
          })
          .then((data) => {
            setCommentAnswers((prevCommentAnswers) =>
                prevCommentAnswers.filter((ans) => ans.id !== idtodelete)
            );
            console.log(data); 
        
          })
          .catch((error) => console.error('Error deleting suggestion:', error));
      };
    

    return (
        <div>
            {currentPage === 'finalpage4' && (
                <div className="finalWhiteContainer">
                <h1 className="finalWhiteText"> What impact does <br/> '<i> {selectedComment} </i>' <br/>have on our goals? </h1>
                {commentAnswers.map((answer, index) => (
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
                            <button onClick={(e) => addCommentAnswer(e, text)} className="postItButton">Save</button>
                        </div>
                    </Draggable>
                ))}
            <button className="infoButtonWhiteboard">
            i
            <div className="infoPopupWhiteboard">
              Press the + button to begin your discussion. <br />
              And press the x button on the suggestion in order to delete it.
            </div>
          </button>

                <button onClick={() => handleNavigate('homepage')} className="exitWhiteboardButton"> x </button>

                <button onClick={addPostIt} className="addPostItButton"> + </button>

                <button onClick={() => handleNavigate('finalpage2')}className="whiteboardBackButton"> Go back </button>
            </div>
            )}

            {currentPage === 'finalpage2' && (
                <FinalPage2 currentSprint={currentSprint} />
            )}

            {currentPage === 'homepage' && (
                <Homepage currentSprint={currentSprint} />
            )}
            
        </div>

    );
}

export default FinalPage4;
