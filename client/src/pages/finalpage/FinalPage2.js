import React, { useEffect, useState } from "react";
import './finalpage.css';
import Homepage from "../homepage/Homepage";
import FinalPage1 from "./FinalPage1";
import FinalPage3 from "./FinalPage3";
import FinalPage4 from "./FinalPage4"

/* Shows the top five comments for the sprint */
function FinalPage2({currentSprint}) {
    const [topComments, setTopComments] = useState(null);
    const [selectedComment, setSelectedComment] = useState('');
    const [currentPage, setCurrentPage] = useState('finalpage2')

    useEffect(() => {
        fetch('http://localhost:4000/api/top_comments')
        .then(response => response.json())
        .then(data => {
        //setTopComments(data.map(commentObj => commentObj.comment));
        //console.log('Top Comments:', data.map(commentObj => commentObj.comment));
            setTopComments(data);
            console.log(topComments);
        })
        .catch(error => console.error('Error fetching comments:', error));

    }, []);

    const handleNavigate = (page) => {
        setCurrentPage(page);
    }
    
    const handleButtonClick = (commentObj) => {
        setSelectedComment(commentObj);
        console.log("selected comment", commentObj);
        //console.log("Selected Comment:", selectedComment);
        handleNavigate('finalpage4')
    }

    return(
        <div>
            {currentPage === 'finalpage2' && (
                <div className = "finalContainer">
                    <h1 className="finalh1"> Close the stage</h1>
                    <button 
                    className="finalExitButton"
                    onClick={() => handleNavigate('homepage')}> x </button>

                    <div>
                        <h2> Here is what you thought about this sprint... </h2>
    
                        <div className="commentBoxes">
                            {topComments && topComments.map((commentObj, index) => (
                                <button key={index} className="commentBox" onClick={() => handleButtonClick(commentObj)}>
                                    {commentObj.comment}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                    className="finalLeft"
                    onClick={() => handleNavigate('finalpage1')}
                    > &#8678;
                </button>

                    <button
                    className="finalRight"
                    onClick={() => handleNavigate('finalpage3')}> 
                       &#8680; 
                    </button>

                    <button
                    className="finalInfoButton">
                        i
                    <div className="finalInfoPopup">
                    Below are the standout comments from this sprint. <br />
                    Click on any of them to engage in a discussion to explore potential actions for the next sprint. <br />
                    </div>
                </button>

                </div>
            )}

            {currentPage === 'homepage' && (
                <Homepage currentSprint={currentSprint}/>
            )}

            {currentPage === 'finalpage1' && (
                <FinalPage1 currentSprint={currentSprint}/>
            )}

            {currentPage === 'finalpage3' && (
                <FinalPage3 currentSprint={currentSprint}/>
            )}

            {currentPage === 'finalpage4' && (
                <FinalPage4 currentSprint={currentSprint} 
                selectedComment={selectedComment.comment}
                selectedCommentId={selectedComment.id}/>
            )}
        </div>
    )
}

export default FinalPage2;