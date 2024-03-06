import React, { useEffect, useState } from "react";
import './finalpage.css';
import Homepage from "../Homepage";

function FinalPage() {
  const [view, setView] = useState(0);
  const [topScore, setTopScore] = useState(null);
  const [topEmote, setTopEmote] = useState(null);
  const [topComments, setTopComments] = useState([]);
  const [topSuggestions, setTopSuggestions] = useState([]);
  const [currentPage, setCurrentPage] = useState('finalpage')

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



  const containers = [
  { text: String(topScore), className: "c1" },
  { text: handleEmojis(), className: "c2" },
  { text: topComments, className: "c3" },
  { text: topSuggestions, className: "c4" },
  ];

  const containertext = [
    { text: "The team rated this sprint a...", className: "ct1" },
    { text: "This sprint most people felt...", className: "ct2" },
    { text: "Here is what you thought about this sprint...", className: "ct3" },
    { text: "Here is what you think you should do for the next sprint...", className: "ct4" },
  ];



  const handlePrevContainer = () => {
    if (view > 0) {
        setView((prevIndex) => (prevIndex - 1) % containers.length);
    }
  };
  const handleNextContainer = () => {
    if (view < containers.length -1) {
        setView((prevIndex) => (prevIndex + 1) % containers.length);
    }
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
  }
  useEffect(() => {
    fetch('http://localhost:4000/api/top_score')
      .then(response => response.json())
      .then(data => {
        setTopScore(data.score);
        console.log('Top Score:', data);
      })
      .catch(error => console.error('Error fetching scores:', error));


    fetch('http://localhost:4000/api/top_emotion')
    .then(response => response.json())
    .then(data => {
      setTopEmote(data[0].emote);
      console.log('Top Emotion:', data[0].emote);
    })
    .catch(error => console.error('Error fetching scores:', error));

    fetch('http://localhost:4000/api/top_comments')
    .then(response => response.json())
    .then(data => {
      setTopComments(data.map(commentObj => commentObj.comment));
      console.log('Top Comments:', data.map(commentObj => commentObj.comment));
    })
    .catch(error => console.error('Error fetching comments:', error));

    fetch('http://localhost:4000/api/top_suggestions')
    .then(response => response.json())
    .then(data => {
      setTopSuggestions(data.map(suggestionObj => suggestionObj.suggestion));
      console.log('Top Suggestions:', data.map(suggestionObj => suggestionObj.suggestion));
    })
    .catch(error => console.error('Error fetching suggestions:', error));

}, []);


  return (
    <div> 
      {currentPage === 'finalpage' && (
      <div className="finalContainer">
        <h1 className="finalh1"> Close the Stage </h1>
      <button 
      className="finalExitButton"
      onClick={() => handleNavigate('homepage')}> x </button>
      
      <div className="finalView">
      <h2 className={containertext[view].className}>{containertext[view].text}</h2>
      <div className={containers[view].className}>
        {containers[view].className === 'c3' && Array.isArray(topComments) ? (
          topComments.map((comment, commentIndex) => (
            <div key={commentIndex} className={`comment-box comment-box-${commentIndex + 1}`}>
              {commentIndex + 1}. {comment}
            </div>
          ))
        ) : null}

        {containers[view].className === 'c4' && Array.isArray(topSuggestions) ? (
          topSuggestions.map((suggestion, suggestionIndex) => (
            <div key={suggestionIndex} className={`suggestion-box suggestion-box-${suggestionIndex + 1}`}>
              {suggestionIndex + 1}. {suggestion}
            </div>
          ))
        ) : null}
      </div>
    </div>

      <button 
      onClick={handlePrevContainer} 
      className="finalLeft"
      style={{ display: view === 0 ? 'none' : 'block'}}>  
      ⬅️
        </button>
      <button onClick={handleNextContainer} 
      className="finalRight"
      style={{ display: view === containers.length - 1 ? 'none' : 'block' }}
      >
        ➡️ 
    </button>
    </div>
    )}

    {currentPage === 'homepage' && (
      <div> 
        <Homepage/>
      </div>
    )}
    </div>

    
  );
}

export default FinalPage;