import React, { useState, useEffect } from 'react';
import './page2.css';
import Homepage from '../homepage/Homepage';
import Page1 from '../page1/Page1';

/* Display page for the comment*/
function Page2({ currentSprint }) {
  const [comments, setComments] = useState([]);
  const [votes, setVotes] = useState({});
  const [reply, setReply] = useState('');
  const [commentReplies, setCommentReplies] = useState([]);
  const [currentPage, setCurrentPage] = useState('page2');
  const [isActive, setIsActive] = useState(false);


  useEffect(() => {
    fetchComments();
    fetchReplies();
  }, []);

  const fetchComments = () => {
    fetch('http://localhost:4000/api/comments')
      .then((response) => response.json())
      .then((data) => {
        setComments(data);
        // Fetch votes for each comment
        data.forEach((comment) => {
          fetchVotes(comment.outcome, comment.comment);
        });
      })
      .catch((error) => console.error('Error fetching comments', error));
  };

  const fetchVotes = (outcome, comment) => {
    fetch(`http://localhost:4000/api/votes/${outcome}/${comment}`)
      .then((response) => response.json())
      .then((voteData) => {
        setVotes((prevVotes) => ({
          ...prevVotes,
          [`${outcome}_${comment}`]: voteData.votes,
        }));
      })
      .catch((error) => console.error('Error fetching votes:', error));
  };

  const handleVotes = (outcome, comment) => {
    const key = `${outcome}_${comment}`;
    setVotes((prevVotes) => ({
      ...prevVotes,
      [key]: (prevVotes[key] || 0) + 1,
    }));

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
  
  // Reply hover button so that a user can reply to a specific comment
  const handleReplySubmit = (commentId, reply) => {
    // Make a POST request to save the reply in the backend
    fetch('http://localhost:4000/api/comments/replies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        commentId, 
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
        console.log("commentid:",commentId)
        console.log("reply", reply)
        // Clear text box after submit
        setReply('');
        fetchComments();
      })
      .catch((error) => console.error('Error submitting reply:', error));
  };


    // Function to fetch replies for a specific comment ID
    const fetchReplies = (commentId) => {
      fetch(`http://localhost:4000/api/comments/${commentId}/replies`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((replies) => {
          setCommentReplies(replies)
          console.log("commentid:", commentId)
          console.log(replies);
        })
        .catch((error) => console.error('Error fetching replies:', error));
    };


  
  // If the user presses the x button on the page then it deletes the comment
  const handleDelete = (outcome, comment) => {
    // Make a DELETE request to delete the comment
    fetch('http://localhost:4000/api/comments', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        outcome,
        comment,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        fetchComments();
        console.log(data);
      })
      .catch((error) => console.error('Error deleting comment:', error));
  };

  // Comments are ordered on votes. If one's votes surpasses another then it moves up the page
  const sortCommentsByVotes = () => {
    return comments.slice().sort((a, b) => {
      const votes1 = votes[`${a.outcome}_${a.comment}`] || 0;
      const votes2 = votes[`${b.outcome}_${b.comment}`] || 0;
      return votes2 - votes1;
    });
  };

  // When the button is CLICKED, it shows the replies
  const handleShowReplies = (commentId) => {
    fetchReplies(commentId);
    setIsActive(true); 
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
            <h2 className='successTitle'> Successes</h2>
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
                        <button onClick={() => handleReplySubmit(comment.id, reply)}>
                          Submit
                        </button>
                      </div>
                    </button>

                    <button
                      className='successButton'
                      onClick={() => handleVotes('success', comment.comment)}>
                      <span role="img">👍</span>
                    </button>

                    <button
                      className="resolvedButton"
                      onClick={() => handleDelete('success', comment.comment)}>
                      x
                    </button>


                    <div>
                        <button
                            className={`seeRepliesButton ${isActive && 'active'}`}
                            onClick={() => handleShowReplies(comment.id)}
                        >
                            See Replies
                        </button>
                        {isActive && (
                            <div className='seeRepliesPopup'>
                                <div><strong> Replies: </strong></div>
                                <ul>
                                    {commentReplies.map((reply) => (
                                        <li key={reply.id}>
                                            {reply.reply}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>



                    <div className='successVotes'>
                      {votes[`success_${comment.comment}`]}
                    </div>
                  </li>
                ))}
            </ul>
          </div>

          <div className='right'>
            <h2 className='challengeTitle'> Challenges</h2>
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
                      onClick={() => handleVotes('challenge', comment.comment)}>
                      <span role="img" aria-label="Thumbs Up">👍</span>
                    </button>

                    <button
                      className="resolvedButton"
                      onClick={() => handleDelete('challenge', comment.comment)}>
                      x
                    </button>

                    <div>
                        <button
                            className={`seeRepliesButton ${isActive && 'active'}`}
                            onClick={() => handleShowReplies(comment.id)}
                        >
                            See Replies
                        </button>
                        {isActive && (
                            <div className='seeRepliesPopup'>
                                <div><strong> Replies: </strong></div>
                                <ul>
                                    {commentReplies.map((reply) => (
                                        <li key={reply.id}>
                                            {reply.reply}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

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
