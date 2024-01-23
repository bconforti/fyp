import React, { useState } from "react";
import './sprintpage.css';
import Homepage from "../homepage/Homepage";
import Header from "../../Header";

function SprintPage() {
    const [sprint_num, setSprintNum] = useState('');
    const [start_date, setStartDate] = useState('');
    const [end_date, setEndDate] = useState('');
    const [currentSprint, setCurrentSprint] = useState(null);
    const [currentPage, setCurrentPage] = useState('sprintpage');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:4000/api/sprints', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ sprint_num, start_date, end_date }),
            });

            if (response.ok) {
                const newSprint = { sprint_num, start_date, end_date };
                setCurrentSprint(newSprint);
                console.log('Sprint was successfully added', newSprint);
                setCurrentPage('homepage');
            } else {
                console.error('Error adding sprint:', response.statusText);
            }
        } catch (error) {
            console.error('Error adding sprint:', error.message);
        }
    };

    return (
        <div>
          <Header currentSprint={currentSprint} />
          {currentPage === 'sprintpage' && (
            <form className="sprintForm" onSubmit={handleSubmit}>
              <h1 className="sprintH1"> Begin Retrospective </h1>
              <h2 className="sprintH2"> Enter sprint information</h2>
      
              <label className="sprintNum"> Sprint number:</label>
              <input
                required
                className="sprintBox"
                onChange={(e) => setSprintNum(e.target.value)}
              ></input>
      
              <label className="startDate"> Start Date:</label>
              <input
                required
                type="date"
                className="startDateBox"
                onChange={(e) => setStartDate(e.target.value)}
              ></input>
      
              <label className="endDate"> End date:</label>
              <input
                required
                type="date"
                className="endDateBox"
                onChange={(e) => setEndDate(e.target.value)}
              ></input>
      
              <button className="sprintSubmitButton"> Submit </button>
            </form>
          )}
      
          {currentPage === 'homepage' && (
            <div>
              <Homepage currentSprint={currentSprint} />
            </div>
          )}
        </div>
      );
      
}

export default SprintPage;
