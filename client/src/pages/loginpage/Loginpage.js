import React, { useState } from "react";
import Registerpage from "./Registerpage";
import Homepage from "../homepage/Homepage";
import "./loginpage.css";
import SprintPage from "../sprintpage/SprintPage";

function Loginpage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [currentPage, setCurrentPage] = useState("loginpage");
    const [incorrectLogin, setIncorrectLogin] = useState(false);

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
                    <button className="registerButton"onClick={() => handleNavigate("registerpage")}>
                        Don't have an account? <strong>Register</strong>
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
