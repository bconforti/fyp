import React, { useEffect, useState } from "react";
import './finalpage.css';
import Homepage from "../Homepage";
import FinalPage1 from "./FinalPage1";
import FinalPage3 from "./FinalPage3"


function FinalPage2({currentSprint}) {
    const [topEmote, setTopEmote] = useState(null);
    const [currentPage, setCurrentPage] = useState('finalpage2')

    const handleNavigate = (page) => {
        setCurrentPage(page);
    }

    const handleEmojis = () => {
        let emoji = "";
        const emote = String(topEmote)
        if (emote === "b1") {
          emoji = "😆";
        }
        else if (emote === "b2") {
          emoji = "😅";
        }
        else if (emote === "b3") {
          emoji = "😶";
        }
        else if (emote === "b4") {
          emoji = "😓"
        }
        else if (emote === "b5") {
          emoji = "😡"
        }
        return emoji;
      }

    useEffect(() => {
        fetch('http://localhost:4000/api/top_emotion')
          .then(response => response.json())
          .then(data => {
            setTopEmote(data[0].emote);
            console.log('Top Emote:', data[0].emote);
          })
          .catch(error => console.error('Error fetching emotions:', error));

    }, []);

    return(
        <div>
            {currentPage === 'finalpage2' && (
                <div className = "finalContainer">
                    <h1 className="finalh1"> Close the stage</h1>
                    <button 
                    className="finalExitButton"
                    onClick={() => handleNavigate('homepage')}> x </button>

                    <div className="finalView">
                        <h2> This sprint most people felt...</h2>
                        <body className="c2"> {handleEmojis()}</body>
                    </div>

                    <button
                    className="finalLeft"
                    onClick={() => handleNavigate('finalpage1')}>
                        ⬅️
                    </button>

                    <button
                    className="finalRight"
                    onClick={() => handleNavigate('finalpage3')}> 
                        ➡️ 
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
        </div>
)}

export default FinalPage2;