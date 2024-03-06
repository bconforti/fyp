import React, { useState } from "react";
import Loginpage from "./Loginpage";
import "./registerpage.css"

function Registerpage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [currentPage, setCurrentPage] = useState('registerpage');

    const handleNavigate = (page) => {
        setCurrentPage(page);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:4000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password, role }),
            });

            if (response.ok) {
                console.log('User registered successfully');
                console.log({ username, password, role })
                handleNavigate('loginpage')
            } else {
                console.error('Error registering user:', response.statusText);
            }
        } catch (error) {
            console.error('Error registering user:', error.message);
        }
    };

    return (
        <div>
            {currentPage === 'registerpage' && (
            <form className="registerForm">
            <h2 className="registerh2"> Register </h2>

            <label className="userLabel2"> Username </label>
            <input
                className="userInput2"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />

            <label className="passLabel2"> Password </label>
            <input
                className="passInput2"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <label className="roleLabel"> Role </label>
            <select 
            className="roleInput"
            onChange={(e) => setRole(e.target.value)}>
            <option value="" disabled selected> Select Role</option>
            <option value={"teamlead"}> Team Lead </option>
            <option value={"scrummaster"}> Scrum Master </option>
            <option value={"softwaredev"}> Software Developer </option>
            <option value={"tester"}> Tester </option>
            </select>

            <button
                className="registerSubmit"
                onClick={handleSubmit}>
                Register
            </button>
            <button
                className="loginButton"
                onClick={() => handleNavigate('loginpage')}
            >
                Already have an account? <strong>Login</strong>
            </button>
            </form>
        )}
        {currentPage === 'loginpage' && (
            <div>
                <Loginpage/>
            </div>
        )}
        </div>
    );
}

export default Registerpage;
