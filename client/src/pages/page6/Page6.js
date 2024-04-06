import React, { useState, useEffect } from "react";
import Draggable from 'react-draggable';
import'./page6.css';
import Homepage from '../homepage/Homepage'
import Page7 from "../page7/Page7";


/* Suggestion page - user can enter what they suggest needs to be changed for the next sprint */
function Page6({currentSprint}) {
    const [suggestion, setSuggestion] = useState('');
    const [currentPage, setCurrentPage] = useState('page6');

    const handleSubmit = async (e) => {
        e.preventDefault();


        try {
            const response = await fetch('http://localhost:4000/api/nextsteps', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ suggestion, sprint_id: currentSprint.sprint_num }),
            });
      
            if (response.ok) {
              console.log('Suggestion was successfully added');
              console.log({suggestion, sprint_id: currentSprint.sprint_num})
            } else {
              console.error('Error adding suggestion:', response.statusText);
            }
          } catch (error) {
            console.error('Error adding suggestion:', error.message);
          }
        };

        const handleNavigate = () => {
            setCurrentPage(currentPage === 'page6' ? 'page7': 'page6');
        }
    
        const handleExit = () => {
            setCurrentPage(currentPage === 'page6' ? 'Homepage': 'page6');
        }
    

    return (
        <div>
            {currentPage === 'page6' && (
                <form className="form6" onSubmit={handleSubmit}>
                    <h1 className="header6"> Next steps </h1>
                    <label className="label6"> Enter suggestion for next sprint: </label>

                    <textarea
                    className="textarea6"
                    required
                    value = {suggestion}
                    onChange={(e) => setSuggestion(e.target.value)}>
                    </textarea>

                    <button className = "submitButton6"> 
                    Submit
                    </button>

                    <button
                    className="pageButton6"
                    onClick={handleNavigate}> 
                        {currentPage === 'page6' ? 'See suggestions': ''}
                    </button>


                    <button
                    className="exitButton6"
                    onClick={handleExit}>
                        {currentPage === 'page6' ? 'x': ''}
                    </button>

                    <button
                    className="infoButton6">
                    i
                    <div className="infoPopup6">
                    Add any suggestions on how to improve during the next sprint.
                    </div>
                    </button>
                </form>
            )}



            {currentPage === 'page7' && (
                <div>
                    <Page7 currentSprint={currentSprint}/>
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

export default Page6;
