import React, { useState, useEffect } from 'react';
import './page2.css';
import Homepage from '../homepage/Homepage';
import Page1 from '../page1/Page1';

function Page2({currentSprint}) {
  const [comments, setComments] = useState([]);
  const [votes, setVotes] = useState({});
  const [reply, setReply] = useState('');
  const [currentPage, setCurrentPage] = useState('page2');


  useEffect(() => {
    fetch('http://localhost:4000/api/comments')
      .then((response) => response.json())
      .then((data) => {
        setComments(data);

        // Fetch votes for each comment
        data.forEach((comment) => {
          fetch(`http://localhost:4000/api/votes/${comment.outcome}/${comment.comment}`)
            .then((response) => response.json())
            .then((voteData) => {
              setVotes((prevVotes) => ({
                ...prevVotes,
                [`${comment.outcome}_${comment.comment}`]: voteData.votes,
              }));
            })
            .catch((error) => console.error('Error fetching votes:', error));
        });
      })
      .catch((error) => console.error('Error fetching comments', error));
  }, []);

  const handleButtonClick = (outcome, comment) => {
    const key = `${outcome}_${comment}`;
    setVotes((prevVotes) => ({
      ...prevVotes,
      [key]: (prevVotes[key] || 0) + 1,
    }));

    // Update votes in the backend
    fetch('http://localhost:4000/api/votes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        outcome,
        comment,
        votes: votes[key] + 1,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => console.log(data))
      .catch((error) => console.error('Error updating votes:', error));
  };

  const handleReplySubmit = (outcome, comment) => {
    // Make a POST request to save the reply in the backend
    fetch('http://localhost:4000/api/comments/replies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        outcome,
        comment,
        reply,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        // Clear reply state after submission
        setReply('');
      })
      .catch((error) => console.error('Error submitting reply:', error));
  };

  const sortCommentsByVotes = () => {
    return comments.slice().sort((a, b) => {
      const votes1 = votes[`${a.outcome}_${a.comment}`] || 0;
      const votes2 = votes[`${b.outcome}_${b.comment}`] || 0;
      return votes2 - votes1;
    });
  };

  const handleNavigate = () => {
    setCurrentPage(currentPage === 'page2' ? 'page1' : 'page2');
  };

  const handleExit = () => {
    setCurrentPage(currentPage === 'page2' ? 'Homepage' : 'page2');
  };


  return (
    <div>
      {currentPage === 'page2' && (
        <div className='container'>
          <div className='left'>
            <h1 className='successTitle'> Successes</h1>
            <ul className='successList'>
              {sortCommentsByVotes()
                .filter((comment) => comment.outcome === 'success')
                .map((comment, index) => (
                  <li key={index} className='successBox'>
                    {comment.comment}

                    <button className='replyButtonS'>
                      Reply
                      <div className='replyPopupS'>
                        Reply to comment
                        <textarea
                          value={reply}
                          onChange={(e) => setReply(e.target.value)}
                        ></textarea>
                        <button onClick={() => handleReplySubmit('success', comment.comment)}>
                          Submit
                        </button>
                      </div>
                    </button>

                    <button
                      className='successButton'
                      onClick={() => handleButtonClick('success', comment.comment)}>
                      <span role="img">👍</span>
                    </button>
                    <div className='successVotes'>
                      {votes[`success_${comment.comment}`]}
                    </div>
                  </li>
                ))}
            </ul>
          </div>

          <div className='right'>
            <h1 className='challengeTitle'> Challenges</h1>
            <ul className='challengeList'>
              {sortCommentsByVotes()
                .filter((comment) => comment.outcome === 'challenge')
                .map((comment, index) => (
                  <li key={index} className='challengeBox'>
                    {comment.comment}
                    <button className='replyButtonC'>
                      Reply
                      <div className='replyPopupC'>
                        Reply to comment
                        <textarea
                          value={reply}
                          onChange={(e) => setReply(e.target.value)}
                        ></textarea>
                        <button onClick={() => handleReplySubmit('challenge', comment.comment)}>
                          Submit
                        </button>
                      </div>
                    </button>
                    <button
                      className='challengeButton'
                      onClick={() => handleButtonClick('challenge', comment.comment)}>
                      <span role="img" aria-label="Thumbs Up">👍</span>
                    </button>
                    <div className='challengeVotes'>
                      {votes[`challenge_${comment.comment}`]}
                    </div>
                  </li>
                ))}
            </ul>

          </div>
          
          <button
            className="addButton2"
            onClick={handleNavigate}
          > + Add comment</button>     

          <button
            className="exitButton2"
            onClick={handleExit}
          >
            {currentPage === 'page2' ? 'x' : ''}
          </button>
          
        </div>
      )}

      {currentPage === 'page1' && (
        <div>
          <Page1 currentSprint={currentSprint} />
        </div>
      )}

      {currentPage === 'Homepage' && (
        <div>
          <Homepage currentSprint={currentSprint} />
        </div>
      )}
    </div>
  );
}

export default Page2;