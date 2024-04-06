import React, { useEffect, useState } from "react";
import './finalpage.css';
import Homepage from "../homepage/Homepage";
import FinalPage2 from "./FinalPage2";

/* This page displays the top emotions and rating to summarise retrospective */
function FinalPage1({currentSprint, jiraInstance}) {
    const [topScore, setTopScore] = useState(null);
    const [topEmote, setTopEmote] = useState(null);
    const [currentPage, setCurrentPage] = useState('finalpage1')

    const handleNavigate = (page) => {
        setCurrentPage(page);
    }

    useEffect(() => {
        fetch('http://localhost:4000/api/top_score')
          .then(response => response.json())
          .then(data => {
            setTopScore(data.score);
            console.log('Top Score:', data.score);
            console.log('Jira Instance', jiraInstance);

          })
          .catch(error => console.error('Error fetching scores:', error));

    }, []);


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
            {currentPage === 'finalpage1' && (
                <div className = "finalContainer">
                    <h1 className="finalh1"> Close the stage</h1>
                    <button 
                    className="finalExitButton"
                    onClick={() => handleNavigate('homepage')}> x </button>

                    <div>
                        <h2 className="finalh2"> This sprint most people felt... </h2>
                        <body className="c1"> {handleEmojis()}</body>
                        <h2 className="ratingH2"> With an average rating of... </h2>
                        <body className="c2"> {topScore} </body>
                    </div>

                    <button
                    className="finalRight"
                    onClick={() => handleNavigate('finalpage2')}> 
                        &#8680;
                    </button>

                </div>
            )}

            {currentPage === 'homepage' && (
                <Homepage currentSprint={currentSprint}/>
            )}
            {currentPage === 'finalpage2' && (
                <FinalPage2 currentSprint={currentSprint}/>
            )}

        </div>
    )
}

export default FinalPage1;