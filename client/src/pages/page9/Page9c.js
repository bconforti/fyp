import React, { useEffect, useState } from "react";
import axios from 'axios';
import Page9b from "./Page9b";
import Page9d from "./Page9d";
import './page9c.css'
import Homepage from "../homepage/Homepage";

/* Displays open and closed issues for the selected Jira board */
function Page9c({boards, selectedBoard, selectedProjectKey, jiraInstance, accessToken, currentSprint}) {
    const [currentPage, setCurrentPage] = useState('page9c')
    const [issues, setIssues] = useState([]);

    const handleNavigate = (page) => {
        setCurrentPage(page);
    }


    useEffect(() => {
        console.log("Selected Board:", selectedBoard);
        console.log("selected key", selectedProjectKey);
    }, [selectedBoard]); 


    
    useEffect(() => {
        // Fetching the issues (key, description and status)
        const fetchBoardIssues = () => {
            const instance = jiraInstance;
            const boardId = selectedBoard; 
            axios.get(`/api/jira/board/${instance}/${boardId}`, {
            })
            .then(response => {
                const issues = response.data.issues;
                
                const issueDetails = issues.map(issue => ({
                    key: issue.key,
                    title: issue.fields.summary,
                    description: issue.fields.description,
                    status: issue.fields.status.name
                }));
                setIssues(issueDetails);
                console.log(issueDetails);
            })
            .catch(error => {
                console.error('Error fetching board issues:', error.message);
            });
        };
        fetchBoardIssues();
    }, [selectedBoard, jiraInstance, accessToken]); 
  
    return(
        <div>
            {currentPage === 'page9c' && (
                <div className="container9c">  
                    <h1 className="header9c"> Gather Data </h1>

                    <div className='left9'> 
                    <ul className='doneList'>
                        {issues.
                        filter((issue) => issue.status === 'Done')
                        .map(issue => (
                            <li className="leftBox"> 
                                <div className="iTitle"> {issue.title} </div>
                                <div className="iDesc"> {issue.description} </div>
                                <div className="iStatus"> {issue.status} </div>
                            </li>
                        ))}
                    </ul>
                    </div>

                    <div className='middle9'> 
                    <ul className='inProgressList'>
                        {issues.
                        filter((issue) => issue.status === 'In Progress')
                        .map(issue => (
                            <li className="middleBox">
                                <div className="iTitle"> {issue.title} </div>
                                <div className="iDesc"> {issue.description} </div>
                                <div className="iStatus"> {issue.status} </div>
                            </li>
                        ))}
                    </ul>
                    </div>

                    <div className='right9'> 
                    <ul className='toDoList'>
                        {issues.
                        filter((issue) => issue.status === 'To Do')
                        .map(issue => (
                            <li className="rightBox">
                                <div className="iTitle"> {issue.title} </div>
                                <div className="iDec"> {issue.description}</div>
                                <div className="iStatus"> {issue.status} </div>
                            </li>
                        ))}
                    </ul>
                    </div>

                    <button 
                    className="backButton9c"
                    onClick={() => handleNavigate('page9b')}>
                    Change board </button>

                    
                    <button 
                    className="nextButton9c"
                    onClick={() => handleNavigate('page9d')}>
                        Next </button> 


                    <button
                    className="exitButton9"
                    onClick={() => handleNavigate('homepage')}> 
                    x </button>
            
                </div>
            )}


            {currentPage === 'homepage' && (
            <Homepage currentSprint={currentSprint}/>
            )}

            {currentPage === 'page9b' && (
            <Page9b 
            jiraInstance={jiraInstance} 
            accessToken={accessToken} 
            boards={boards} 
            currentSprint={currentSprint}/>
            )}

            {currentPage === 'page9d' && (
            <Page9d 
            jiraInstance={jiraInstance}
             accessToken={accessToken} 
             selectedBoard={selectedBoard} 
             currentSprint={currentSprint} 
             selectedProjectKey={selectedProjectKey}
             boards={boards} />
            )}
        </div>
    )
}

export default Page9c;