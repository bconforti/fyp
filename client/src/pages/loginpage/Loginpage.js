import React, { useState, useEffect } from "react";
import Registerpage from "./Registerpage";
import SprintPage from "../sprintpage/SprintPage";
import "./loginpage.css";

function Loginpage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [currentPage, setCurrentPage] = useState("loginpage");
    const [incorrectLogin, setIncorrectLogin] = useState(false);
    const [accessToken, setAccessToken] = useState('');


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

    const handleAuthorisation = (e) => { 
        e.preventDefault();
        const client_id = "N4HDksGGrKUmSVe8DpFhMFOCKxFjHw3s";
        const redirect = "http://localhost:3000/callback";
        const scopes = "read:account read:me read:jira-work read:jira-user read:board";
        const state = Math.random().toString(36).substring(7);
        const authorisationUrl = `https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=${client_id}&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(redirect)}&state=${state}&response_type=code&prompt=consent`;

        window.location.href = authorisationUrl;
    };
    
    

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
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        fetch("http://localhost:4000/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        })
            .then((response) => {
                if (response.ok) {
                    console.log("Login successful");
                    handleNavigate('sprintpage');
                } else {
                    return response.json().then((data) => {
                        console.error("Error logging in:", data.message);
                        setIncorrectLogin(true);
                    });
                }
            })
            .catch((error) => {
                console.error("Error logging in:", error.message);
            });
    };



    const handleNavigate = (page) => {
            setCurrentPage(page);
            console.log("page", page);
    };

    return (
        <div>
            {currentPage === "loginpage" && (
                <form className="loginForm">
                    <h2 className="loginh2"> Login </h2>
                    <label className="userLabel"> Username </label>
                    <input
                        className="userInput"
                        placeholder="Enter username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <label className="passLabel"> Password </label>
                    <input
                        className="passInput"
                        placeholder="Enter password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button className="loginSubmit" onClick={handleSubmit}>
                        Login
                    </button>
                    <button className="registerButton" onClick={() => handleNavigate("registerpage")}>
                        Don't have an account? <strong>Register</strong>
                    </button>

                    <button className="jiraLink" onClick={handleAuthorisation}> 
                        Integrate with Jira
                    </button>

                    {incorrectLogin && (
                        <div>
                            <span className="loginPopup">
                                Incorrect username or password.
                            </span>
                        </div>
                    )}
                </form>
            )}

            {currentPage === "registerpage" && (
                <div>
                    <Registerpage />
                </div>
            )}

            {currentPage === "sprintpage" && (
                <div>
                    <SprintPage />
                </div>
            )}
        </div>
    );
}

export default Loginpage;
