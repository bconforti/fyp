import React, { useState, useEffect } from "react";
import './page9.css';
import axios from 'axios';
import Page9b from "./Page9b";
import Homepage from "../homepage/Homepage";

/* Start of Jira integrate page to display issues */
function Page9({currentSprint}) {
    const [jiraInstance, setJiraInstance] = useState('');
    const [boards, setBoards] = useState([]);
    const [currentPage, setCurrentPage] = useState('page9');
    const [accessToken, setAccessToken] = useState('');
    const [error, setError] = useState('');

    // Token is needed for the authentication
    
    /*
    useEffect(() => {
        const storedToken = sessionStorage.getItem('accessToken');
        if (storedToken) {
            setAccessToken(storedToken);
        }

        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        if (code) {
            console.log(code);
            exchangeCodeForToken(code);
        }
    }, []); 


    // OAUTH authentication 
    const handleAuthorisation = (e) => { 
        e.preventDefault();
        const client_id = "N4HDksGGrKUmSVe8DpFhMFOCKxFjHw3s";
        const redirect = "http://localhost:3000/callback";
        const scopes = "read:account read:me read:jira-work read:jira-user read:board";
        const state = Math.random().toString(36).substring(7);
        const authorisationUrl = `https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=${client_id}&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(redirect)}&state=${state}&response_type=code&prompt=consent`;

        window.location.href = authorisationUrl;
    }; 
    */

    const handleJiraSubmit = async (e) => {
        e.preventDefault();
        console.log("Jira Instance URL submitted:", jiraInstance);
        console.log(accessToken);
        if (jiraInstance) { 
            fetchBoards();
        } else {
            setError('Jira Instance URL is required.');
        }
    };

    const handleJiraInstanceChange = (e) => {
        setJiraInstance(e.target.value);
        setError('');
    };

    // Fetches the user's boards if the authentication was successful
    const fetchBoards = async () => {
        try {
            const response = await axios.get(`/api/jira/boards/${jiraInstance}`);
            const fetchedBoards = response.data.values;
            console.log("Fetched:", fetchedBoards);
            //const test = response.data;
            //console.log("PROJECT KEY:", test.values[0].location.projectKey);
            setBoards(fetchedBoards); 
            setCurrentPage('page9b'); 
            //console.log("2:",accessToken);
        } catch (error) {
            console.error('Error fetching boards:', error.message);
            setError('Incorrect! Please check your Jira instance');
        } 
    };

    /*
    const exchangeCodeForToken = (code) => {
        const client_id = "N4HDksGGrKUmSVe8DpFhMFOCKxFjHw3s";
        const client_secret = "ATOAziHEixRPPKm06ny6t0AKsnu8WlLRHu3DZ7JoSHkzMTmEh1nTOvrYXPWu1FgNKVjX7C5E1716"
        const redirect_uri = "http://localhost:3000/callback";

        fetch("https://auth.atlassian.com/oauth/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                grant_type: "authorization_code",
                client_id,
                client_secret,
                redirect_uri,
                code
            })
        })
        .then(response => response.json())
        .then(data => {
            setAccessToken(data.access_token);
            sessionStorage.setItem('accessToken', data.access_token);
            console.log(data.access_token)
        })
        .catch(error => console.error('Error exchanging code for token:', error));
    }; */

    
    const handleNavigate = (page) => {
        setCurrentPage(page);
    }

    return (
        <div>
        {currentPage === 'page9' && (
            <div>
                <form className="container9" onSubmit={handleJiraSubmit}>
                    <h1 className="header9"> Gather Data </h1>
                    <button className="exitButton9" onClick={() => handleNavigate('homepage')}> x </button>
                    <button className="infoButton9">
                        i
                        <div className="infoPopup9">
                        Enter your Jira Instance and click the 'See Boards' button to import and export issues. <br />
                        </div>
                    </button>
                    <label className="label9"> Integrate with your Jira workspace: </label>
                    <button className="jiraButton"> </button>
                    <div className="jiraInputContainer"> 
                    <input 
                        type="text" 
                        className="jiraInstanceInput" 
                        value={jiraInstance} 
                        onChange={handleJiraInstanceChange} 
                        placeholder="Enter Jira Instance" 
                    />
                    <div className="inputHover9"> https://<strong>your-jira-instance</strong>/atlassian.net</div>
            
                    </div>
                       <button className="fetchButton" type="submit">
                        See Boards
                    </button>
                    {error && <div className = "errorMessage9"> {error} </div>}
                </form>
            </div>
        )}

        {currentPage === 'page9b' && (
            <Page9b boards={boards} jiraInstance={jiraInstance} accessToken={accessToken} currentSprint={currentSprint}/>
        )}

        {currentPage === 'homepage' && (
            <Homepage jiraInstance={jiraInstance} currentSprint={currentSprint}/>
        )}
        </div>
    );

}

export default Page9;
