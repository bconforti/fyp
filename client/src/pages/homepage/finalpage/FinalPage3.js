import React, { useEffect, useState } from "react";
import './finalpage.css';
import Homepage from "../Homepage";
import FinalPage2 from "./FinalPage2";
import FinalPage4 from "./FinalPage4";

function FinalPage3(currentSprint) {
    const [topComments, setTopComments] = useState(null);
    const [currentPage, setCurrentPage] = useState('finalpage3')

    const handleNavigate = (page) => {
        setCurrentPage(page);
    }

    useEffect(() => {
        fetch('http://localhost:4000/api/top_comments')
        .then(response => response.json())
        .then(data => {
        setTopComments(data.map(commentObj => commentObj.comment));
        console.log('Top Comments:', data.map(commentObj => commentObj.comment));
        })
        .catch(error => console.error('Error fetching comments:', error));

    }, []);

    return(
        <div>
            {currentPage === 'finalpage3' && (
                <div className = "finalContainer">
                    <h1 className="finalh1"> Close the stage</h1>
                    <button 
                    className="finalExitButton"
                    onClick={() => handleNavigate('homepage')}> x </button>

                    <div className="finalView">
                        <h2> Here is what you thought about this sprint... </h2>
                        <ol className="c3">
                            {topComments && topComments.map((comment, index) => (
                                <li key={index}>{comment} </li>
                            ))}
                        </ol>
                    </div>

                    <button
                    className="finalLeft"
                    onClick={() => handleNavigate('finalpage2')}>
                        ⬅️
                    </button>

                    <button
                    className="finalRight"
                    onClick={() => handleNavigate('finalpage4')}> 
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

            {currentPage === 'finalpage4' && (
                <FinalPage4 currentSprint={currentSprint}/>
            )}
        </div>
    )
}

export default FinalPage3;