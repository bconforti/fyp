import React, { useState, useEffect } from "react";
import './page9b.css';
import axios from 'axios';
import Page9c from "./Page9c";
import Homepage from "../homepage/Homepage";

/* User submits which from which Jira board they want issues to be displayed from */
function Page9b({ boards, jiraInstance, accessToken, currentSprint }) {
    const [selectedBoard, setSelectedBoard] = useState(''); 
    const [selectedProjectKey, setSelectedProjectKey] = useState('');
    const [currentPage, setCurrentPage] = useState('page9b');

    useEffect(() => {
        console.log(boards);
    })

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Board id", selectedBoard);
        console.log("Jira Instance:", jiraInstance);
        handleNavigate('page9c');
    };

    const handleNavigate = (page) => {
        setCurrentPage(page);
    };

    const handleBoardChange = (e) => {
        const selectedBoardId = e.target.value;
        setSelectedBoard(selectedBoardId);
        setSelectedProjectKey(boards[selectedBoardId - 1].location.projectKey);
        console.log("1", boards[selectedBoardId - 1].location.projectKey)
    };

    return (
        <div>
            {currentPage === 'page9b' && (
                <form className="container9b" onSubmit={handleSubmit}> 
                    <button className= "exitButton9b" onClick={() => handleNavigate('homepage')}> x </button>
                    <h2 className="head9b">Select a board</h2>
                    <select className= "boardDropdown" value={selectedBoard} onChange={handleBoardChange}>
                        <option value="">Select a board</option>
                        {Object.values(boards).map(board => (
                            <option key={board.id} value={board.id}>{board.name}</option>
                        ))}
                    </select>
                    <button  className= "submit9b" type="submit">Submit</button>
                </form>
            )}

            {currentPage === 'page9c' && (
                <Page9c 
                    selectedBoard={selectedBoard} 
                    selectedProjectKey={selectedProjectKey} 
                    jiraInstance={jiraInstance} 
                    accessToken={accessToken} 
                    boards={boards} 
                    currentSprint={currentSprint}
                />
            )}

            {currentPage === 'homepage' && (
                <Homepage jiraInstance={jiraInstance} currentSprint={currentSprint}/>
            )}
        </div>
    );
}

export default Page9b;
